"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const { readFile } = fs_1.promises;
const path_1 = __importDefault(require("path"));
function isDefined(variable) {
    return variable !== undefined && variable !== null;
}
/**
 * Parses a .env file and returns and object
 * with it's values.
 * If the file is not found, an empty object
 * is returned.
 */
async function parseEnvFile(filePath) {
    if (!fs_1.existsSync(filePath))
        return {};
    let result = {};
    const lines = (await readFile(filePath)).toString().split('\n');
    for (const line of lines) {
        const match = line.match(/^([^=:#]+?)[=:](.*)/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            result[key] = value;
        }
    }
    return result;
}
/**
 * Loads, parses and merges multiple
 * env files
 */
async function loadMultipleEnvFiles(envFilePaths) {
    let mergedEnvVars = {};
    for (const envFilePath of envFilePaths) {
        const envFileContent = await parseEnvFile(envFilePath);
        mergedEnvVars = {
            ...mergedEnvVars,
            ...envFileContent,
        };
    }
    return mergedEnvVars;
}
function loadEnvVarFromStage({ envVarName, stage, envFilesContent, }) {
    const processEnvVarName = `${stage.toUpperCase()}_${envVarName}`;
    const envVarValue = process.env[processEnvVarName] || envFilesContent[envVarName];
    return envVarValue;
}
/**
 * Returns an array of .env file paths
 * which may be parsed if they exist,
 * based on the current stage
 */
function getEnvFilePaths({ currentStage, fallbackStage, appRootDir, projectRootDir, }) {
    // Unique stages, in case fallbackStage === currentStage
    const stages = Array.from(new Set([currentStage, fallbackStage].filter(Boolean)));
    const rootDirs = [appRootDir, projectRootDir];
    return stages
        .map(stage => {
        const envFileName = `.env.${stage.toLowerCase()}`;
        const envFilePaths = rootDirs.map(rootDir => path_1.default.join(rootDir, envFileName));
        return envFilePaths;
    })
        .flat();
}
/**
 * Loads env vars from either the current
 * stage's env file (.env.<stage>) or, if
 * not defined, from process.env.STAGENAME_*.
 * If neither of both is defined,
 * you can define a fallback stage. If that
 * is set, the envvars of thats stage
 * are used if defined.
 * If an env var in the array expectedEnvVars
 * is not defined, an error is thrown.
 * Additional env vars in the .env file
 * are ignored and a warning is shown.
 * The resulting object can later on
 * be used by the WebpackDefinePlugin.
 * If an environment variable is needed
 * in more than one app (e.g. two
 * serverless endpoints), you can create
 * a .env.<stage> file in the root
 * of your project.
 *
 * Example:
 * Assume the envvar DB_CONNECTION_STR is required
 * and you want to compile and deploy the project
 * (e.g. CI server).
 * You can either define it in the environment
 * by setting process.env.PRODUCTION_DB_CONNECTION_STR
 * or by genereating the file .env.production with
 * DB_CONNECTION_STR defined in it at runtime.
 * Prefixing the envvars prevents you from accidently
 * using the wrong envvars.
 */
async function loadAppEnvVars({ appRootDir, currentStage, expectedEnvVars, fallbackStage, required, projectRootDir, }) {
    let envVarsToReturn = { STAGE: currentStage };
    if (expectedEnvVars.length === 0)
        return envVarsToReturn;
    const envFilePaths = getEnvFilePaths({
        appRootDir,
        currentStage,
        fallbackStage,
        projectRootDir,
    });
    const envFilesContent = await loadMultipleEnvFiles(envFilePaths);
    for (const envVarName of expectedEnvVars) {
        let envVarValue = loadEnvVarFromStage({
            envFilesContent,
            envVarName,
            stage: currentStage,
        });
        if (envVarValue === undefined || envVarValue === null) {
            const errMsg = `[${envFilePaths.join(', ')}] contain no variable named "${envVarName}" and process.env.${currentStage.toUpperCase()}_${envVarName} is not defined in the current environment. It is marked as required in cantara.config.js`;
            if (required) {
                throw new Error(errMsg);
            }
        }
        else {
            envVarsToReturn[envVarName] = envVarValue;
        }
    }
    // Warnings for ignored env vars in .env file
    const allEnvVarsInEnvFile = Object.keys(envFilesContent);
    const ignoredEnvVars = allEnvVarsInEnvFile.filter(envName => !expectedEnvVars.includes(envName));
    if (ignoredEnvVars.length > 0) {
        console.warn(`The following environment variables are ignored, because they are not present in the cantara.config.js file:\n\t${ignoredEnvVars.join('\n\t')}`);
    }
    return envVarsToReturn;
}
exports.default = loadAppEnvVars;
