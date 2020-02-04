"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
function loadEnvVarFromStage(_a) {
    var envVarName = _a.envVarName, stage = _a.stage, envFileContent = _a.envFileContent;
    var processEnvVarName = stage.toUpperCase() + "_" + envVarName;
    var envVarValue = envFileContent[envVarName] || process.env[processEnvVarName];
    return envVarValue;
}
/**
 * Parses a .env file and returns and object
 * with it's values.
 * If the file is not found, an empty object
 * is returned.
 */
function parseEnvFile(filePath) {
    if (!fs_1.existsSync(filePath))
        return {};
    var result = {};
    var lines = fs_1.readFileSync(filePath)
        .toString()
        .split('\n');
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var match = line.match(/^([^=:#]+?)[=:](.*)/);
        if (match) {
            var key = match[1].trim();
            var value = match[2].trim();
            result[key] = value;
        }
    }
    return result;
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
function loadAppEnvVars(_a) {
    var appRootDir = _a.appRootDir, currentStage = _a.currentStage, expectedEnvVars = _a.expectedEnvVars, fallbackStage = _a.fallbackStage, required = _a.required;
    var envVarsToReturn = { STAGE: currentStage };
    if (expectedEnvVars.length === 0)
        return envVarsToReturn;
    var envFileName = ".env." + currentStage.toLowerCase();
    var currentStageEnvFile = path_1.default.join(appRootDir, envFileName);
    var envFileContent = parseEnvFile(currentStageEnvFile);
    var fallbackEnvFileContent = fallbackStage
        ? parseEnvFile(path_1.default.join(appRootDir, ".env." + fallbackStage.toLowerCase()))
        : {};
    for (var _i = 0, expectedEnvVars_1 = expectedEnvVars; _i < expectedEnvVars_1.length; _i++) {
        var envVarName = expectedEnvVars_1[_i];
        var envVarValue = loadEnvVarFromStage({
            envFileContent: envFileContent,
            envVarName: envVarName,
            stage: currentStage,
        });
        if (!envVarValue && fallbackStage) {
            envVarValue = loadEnvVarFromStage({
                envFileContent: fallbackEnvFileContent,
                envVarName: envVarName,
                stage: fallbackStage,
            });
        }
        if (envVarValue === undefined || envVarValue === null) {
            var errMsg = "File " + envFileName + " contains no variable named \"" + envVarName + "\" and process.env." + currentStage.toUpperCase() + "_" + envVarName + " is not defined in the current environment. It is marked as required in cantara.config.js";
            if (required) {
                throw new Error(errMsg);
            }
        }
        else {
            envVarsToReturn[envVarName] = envVarValue;
        }
    }
    // Warnings for ignored env vars in .env file
    var allEnvVarsInEnvFile = Object.keys(envFileContent);
    var ignoredEnvVars = allEnvVarsInEnvFile.filter(function (envName) { return !expectedEnvVars.includes(envName); });
    if (ignoredEnvVars.length > 0) {
        console.warn("The following environment variables are ignored, because they are not present in the crana.config.js file:\n\t" + ignoredEnvVars.join('\n\t'));
    }
    return envVarsToReturn;
}
exports.default = loadAppEnvVars;
