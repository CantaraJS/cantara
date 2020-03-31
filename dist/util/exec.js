"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const cantara_config_1 = __importDefault(require("../cantara-config"));
function spawnCmd(cmd, { workingDirectory, redirectIo, env = {} } = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            cwd: workingDirectory,
            env: {
                ...process.env,
                ...env,
            },
        };
        if (process.env.NODE_ENV === 'development' &&
            (cmd.startsWith('cantara') || cmd.startsWith('ctra'))) {
            // If Cantara calls itself in development mode
            // it always uses the the TEST_CMD. Therefore,
            // explicitly delete it
            delete options.env.NODE_ENV;
        }
        const [programCmd, ...params] = cmd.split(' ');
        let retData = '';
        const newProcess = child_process_1.spawn(programCmd, params, {
            ...options,
            shell: true,
            stdio: redirectIo ? 'inherit' : undefined,
        });
        function onExit(exitCode) {
            if (exitCode === 0) {
                resolve(retData);
            }
            else {
                reject(`Command "${cmd}" failed.`);
            }
        }
        newProcess.stdio.forEach(io => io &&
            io.on('data', data => {
                retData += `\n${data.toString()}`;
            }));
        // newProcess.on('close', onExit);
        newProcess.on('exit', onExit);
        newProcess.on('error', e => {
            reject(e);
        });
        // newProcess.on('disconnect', onExit);
    });
}
exports.spawnCmd = spawnCmd;
/**
 * Retrieved paths of folder which should
 * be added to PATH during this session.
 * Like this, commands can be executed
 * directly from the node_modules folder.
 * Same technique as npm run-scripts uses.
 * Add the following node_modules/.bin
 * folders to PATH:
 * - Cantara's node_modules
 * - The user's project node_modules
 */
function getCurrentPATH() {
    const globalCantaraConfig = cantara_config_1.default();
    const getNodeModulesBinPath = (folderWithNodeModules) => {
        return (folderWithNodeModules + path_1.default.sep + 'node_modules' + path_1.default.sep + '.bin');
    };
    const localNodeModulesBinPath = getNodeModulesBinPath(globalCantaraConfig.internalPaths.root);
    const userProjectNodeModulesBinPath = getNodeModulesBinPath(globalCantaraConfig.runtime.projectDir);
    let newPathEnv = process.env.PATH || '';
    const pathsToAdd = [localNodeModulesBinPath, userProjectNodeModulesBinPath];
    for (const pathToAdd of pathsToAdd) {
        if (!newPathEnv.includes(pathToAdd)) {
            newPathEnv += path_1.default.delimiter + pathToAdd;
        }
    }
    return newPathEnv;
}
/** Execute commands in different contexts and
 * with different folders in PATH.
 */
async function execCmd(cmd, { workingDirectory = process.cwd(), redirectIo, withSecrets, } = {}) {
    const globalCantaraConfig = cantara_config_1.default();
    const NEW_PATH_ENV = getCurrentPATH();
    const secretsEnvVars = withSecrets ? globalCantaraConfig.runtime.secrets : {};
    const options = {
        workingDirectory,
        env: {
            ...secretsEnvVars,
            PATH: NEW_PATH_ENV || '',
        },
        redirectIo,
    };
    return spawnCmd(cmd, options);
}
exports.default = execCmd;
