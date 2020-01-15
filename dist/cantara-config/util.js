"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
var fs_2 = require("../util/fs");
var isDirectory = function (source) { return fs_1.lstatSync(source).isDirectory(); };
var getDirectories = function (source) {
    return fs_1.readdirSync(source)
        .map(function (name) { return path.join(source, name); })
        .filter(isDirectory);
};
/** Requires that at least one of the specified folders exist */
function requireAtLeastOneFolder(paths) {
    var doesOneFolderExist = paths
        .map(function (folderPath) { return fs_1.existsSync(folderPath); })
        .includes(true);
    if (!doesOneFolderExist) {
        throw new Error('No apps or packages folders were detected!');
    }
}
/** Returns list of all React Apps, Packages and Node Apps */
function getAllApps(_a) {
    var rootDir = _a.rootDir, stage = _a.stage;
    var FOLDER_NAMES = {
        REACT_APPS: 'react-apps',
        NODE_APPS: 'node-apps',
        PACKAGES: 'packages',
    };
    var reactAppsRootDir = path.join(rootDir, FOLDER_NAMES.REACT_APPS);
    var packagesAppsRootDir = path.join(rootDir, FOLDER_NAMES.PACKAGES);
    var nodeAppsRootDir = path.join(rootDir, FOLDER_NAMES.NODE_APPS);
    requireAtLeastOneFolder([
        reactAppsRootDir,
        packagesAppsRootDir,
        nodeAppsRootDir,
    ]);
    var allAppsDirectories = __spreadArrays(getDirectories(reactAppsRootDir).map(function (dir) { return ({ dir: dir, type: 'react' }); }), getDirectories(packagesAppsRootDir).map(function (dir) { return ({
        dir: dir,
        type: 'package',
    }); }), getDirectories(nodeAppsRootDir).map(function (dir) { return ({ dir: dir, type: 'node' }); }));
    var allApps = allAppsDirectories.map(function (_a) {
        var dir = _a.dir, type = _a.type;
        var typeToUse = type;
        var displayName = path.basename(dir);
        var userAddedMetadata = undefined;
        if (type === 'package') {
            var packageSrc = path.join(dir, 'src');
            typeToUse = fs_1.existsSync(path.join(packageSrc, 'index.tsx'))
                ? 'react-component'
                : 'js-package';
        }
        if (type === 'node') {
            typeToUse = fs_1.existsSync(path.join(dir, 'serverless.yml'))
                ? 'serverless'
                : 'node';
        }
        var packageJsonPath = path.join(dir, 'package.json');
        if (fs_1.existsSync(packageJsonPath)) {
            var packageJSON = JSON.parse(fs_1.readFileSync(packageJsonPath).toString());
            displayName = packageJSON.name;
        }
        var cantaraConfigPath = path.join(dir, 'cantara.config.js');
        if (fs_1.existsSync(cantaraConfigPath)) {
            userAddedMetadata = require(cantaraConfigPath);
        }
        var envVars = loadAppEnvVars({
            appRootDir: dir,
            currentStage: stage,
            expectedEnvVars: userAddedMetadata ? userAddedMetadata.env || [] : [],
        });
        return {
            name: path.basename(dir),
            type: typeToUse,
            env: envVars,
            paths: {
                root: dir,
                src: path.join(dir, 'src'),
                build: path.join(dir, 'build'),
                assets: path.join(dir, 'assets'),
            },
            meta: __assign({ displayName: displayName }, userAddedMetadata),
        };
    });
    // Require index.ts(x) file to exist for every app
    allApps.forEach(function (app) {
        var indexTsFileExists = fs_1.existsSync(path.join(app.paths.src, 'index.ts'));
        var indexTsxFileExists = fs_1.existsSync(path.join(app.paths.src, 'index.tsx'));
        var doesIndexFileExist = indexTsFileExists || indexTsxFileExists;
        if (!doesIndexFileExist) {
            throw new Error("Index file for \"" + app.name + "\" was not found. Please create it.");
        }
    });
    return allApps;
}
exports.default = getAllApps;
/** Loads and parses the content from the user's .secrets.json file
 * in the project root. Here, Cantara specific secrets can be stored.
 * E.g. AWS keys
 */
function loadSecrets(projectDir) {
    var secretsFilePath = path.join(projectDir, '.secrets.json');
    var secrets = {};
    if (fs_1.existsSync(secretsFilePath)) {
        secrets = fs_2.readFileAsJSON(secretsFilePath);
    }
    return secrets;
}
exports.loadSecrets = loadSecrets;
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
 * not defined, from process.env.
 * If an env var in the array expectedEnvVars
 * is not defined, an error is thrown.
 * Additional env vars in the .env file
 * are ignored and a warning is shown.
 * The resulting object can later on
 * be used by the WebpackDefinePlugin.
 * STAGE is always added as an env var
 * with the current stage as it's value.
 */
function loadAppEnvVars(_a) {
    var appRootDir = _a.appRootDir, currentStage = _a.currentStage, expectedEnvVars = _a.expectedEnvVars;
    var envVarsToReturn = { STAGE: currentStage };
    if (expectedEnvVars.length === 0)
        return envVarsToReturn;
    var envFileName = ".env." + currentStage.toLowerCase();
    var currentStageEnvFile = path.join(appRootDir, envFileName);
    var envFileContent = parseEnvFile(currentStageEnvFile);
    for (var _i = 0, expectedEnvVars_1 = expectedEnvVars; _i < expectedEnvVars_1.length; _i++) {
        var expectedEnvVarName = expectedEnvVars_1[_i];
        var envVarValue = envFileContent[expectedEnvVarName] || process.env[expectedEnvVarName];
        if (envVarValue === undefined || envVarValue === null) {
            throw new Error("File " + envFileName + " contains no variable named \"" + expectedEnvVarName + "\" and it is not defined in the current environment. It is marked as required in crana.config.js");
        }
        envVarsToReturn[expectedEnvVarName] = envVarValue;
    }
    // Warnings for ignored env vars in .env file
    var allEnvVarsInEnvFile = Object.keys(envFileContent);
    var ignoredEnvVars = allEnvVarsInEnvFile.filter(function (envName) { return !expectedEnvVars.includes(envName); });
    if (ignoredEnvVars.length > 0) {
        console.warn("The following environment variables are ignored, because they are not present in the crana.config.js file:\n\t" + ignoredEnvVars.join('\n\t'));
    }
    return envVarsToReturn;
}
