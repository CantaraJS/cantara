"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const exec_1 = __importDefault(require("../../util/exec"));
const parseDiffSummary_1 = __importDefault(require("./parseDiffSummary"));
const cantara_config_1 = __importDefault(require("../../cantara-config"));
/** Executes a function for all
 * applications/packages whose code
 * has changed since the last commit.
 * Accepts a function as a parameter
 * which gets executed with the name
 * of the app that changed as it's first
 * parameter
 */
async function executeForChangedApps(cb) {
    const { runtime: { projectDir }, allApps, } = cantara_config_1.default();
    // Identify changes between this and latest commit
    const res = await exec_1.default('git diff HEAD HEAD~1 --stat', {
        workingDirectory: projectDir,
    });
    const diffSum = parseDiffSummary_1.default(res.toString(), projectDir);
    console.log({ diffSum });
    const changedAppNames = diffSum
        .map(changeObj => {
        if (!changeObj)
            return false;
        const srcIndex = changeObj.file.indexOf('src');
        const rootPath = changeObj.file.slice(0, srcIndex);
        const name = path_1.default.basename(rootPath);
        // Only include apps that exist
        const foundApp = allApps.find(app => app.name === name);
        if (!foundApp)
            return false;
        return name;
    })
        .filter(Boolean);
    console.log({ changedAppNames });
    // Execute cb for each application
    for (const changedAppName of changedAppNames) {
        await cb(changedAppName);
    }
}
exports.default = executeForChangedApps;
/**
 * Executes an arbitrary command if the specified
 * application changed
 */
function execUserCmdForChangedApp({ appname, userCmd, }) {
    const { runtime: { projectDir }, } = cantara_config_1.default();
    return executeForChangedApps(async (changedAppName) => {
        if (appname === changedAppName) {
            // Exec cmd
            console.log(`"${appname}" changed.\nExecuting "${userCmd}"`);
            await exec_1.default(userCmd, {
                workingDirectory: projectDir,
                redirectIo: true,
            });
        }
    });
}
exports.execUserCmdForChangedApp = execUserCmdForChangedApp;
