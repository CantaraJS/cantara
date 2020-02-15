"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var util_1 = __importStar(require("./util"));
var aliases_1 = __importStar(require("./aliases"));
var react_1 = require("./dependencies/react");
var types_1 = require("./dependencies/types");
var testing_1 = require("./dependencies/testing");
var common_1 = require("./dependencies/common");
var fs_1 = require("fs");
var EXPECTED_CANTARA_SECRETS = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
var globalConfig = undefined;
function getGlobalConfig() {
    if (!globalConfig)
        throw new Error("Cantara's global configuration was not set yet!");
    return globalConfig;
}
exports.default = getGlobalConfig;
/** Returns currently active application
 * or throws an error if there
 * is no active application.
 * Can be used by all scripts which
 * require an active application.
 */
function getActiveApp() {
    var activeApp = getGlobalConfig().runtime.currentCommand.app;
    if (!activeApp) {
        throw new Error('No active application in current Cantara runtime!');
    }
    return activeApp;
}
exports.getActiveApp = getActiveApp;
function configureCantara(config) {
    var staticFilesPath = path_1.default.join(config.packageRootDir, 'static');
    var tempFolder = path_1.default.join(staticFilesPath, '.temp');
    var projectDir = config.projectDir || process.cwd();
    // Some commands don't require an active app, e.g. 'init' or 'new'
    var isActiveAppRequired = !!config.currentCommand.appname;
    var allApps = isActiveAppRequired
        ? util_1.default({
            rootDir: projectDir,
            stage: config.stage,
            activeAppName: config.currentCommand.appname,
        })
        : [];
    var currentActiveApp = config.currentCommand.appname
        ? allApps.find(function (app) { return app.name === config.currentCommand.appname; })
        : undefined;
    if (config.currentCommand.appname && !currentActiveApp) {
        throw new Error("Application \"" + config.currentCommand.appname + "\" does not exist.");
    }
    var packageAliases = currentActiveApp
        ? aliases_1.default({
            allApps: allApps,
            activeApp: currentActiveApp,
        })
        : {};
    var appDependencyAliases = currentActiveApp
        ? aliases_1.getDependencyAliases(currentActiveApp)
        : {};
    var globalCantaraSettingsFilePath = path_1.default.join(projectDir, 'cantara.config.js');
    var globalCantaraUserSettings = fs_1.existsSync(globalCantaraSettingsFilePath)
        ? require(globalCantaraSettingsFilePath)
        : {};
    var globalCantaraSettings = {
        e2e: {
            executeBefore: globalCantaraUserSettings.e2e
                ? globalCantaraUserSettings.e2e.executeBefore || []
                : [],
            portsToWaitFor: globalCantaraUserSettings.e2e
                ? globalCantaraUserSettings.e2e.portsToWaitFor || []
                : [],
            testCommand: globalCantaraUserSettings.e2e
                ? globalCantaraUserSettings.e2e.testCommand || ''
                : '',
        },
    };
    var configToUse = {
        allApps: allApps,
        allPackages: {
            include: allApps
                .filter(function (app) { return app.type === 'js-package' || app.type === 'react-component'; })
                .map(function (app) { return app.paths.src; }),
        },
        dependencies: {
            react: react_1.reactDependencies,
            typescript: types_1.typescriptDependencies,
            testing: testing_1.testingDependencies,
            common: common_1.commonDependencies,
        },
        internalPaths: {
            root: config.packageRootDir,
            static: staticFilesPath,
            temp: tempFolder,
        },
        runtime: {
            projectDir: projectDir,
            globalCantaraSettings: globalCantaraSettings,
            stage: config.stage,
            currentCommand: {
                name: config.currentCommand.name,
                app: currentActiveApp,
                additionalCliOptions: config.additionalCliOptions || '',
            },
            secrets: util_1.loadSecrets({ projectDir: projectDir, secrets: EXPECTED_CANTARA_SECRETS }),
            aliases: {
                packageAliases: packageAliases,
                appDependencyAliases: appDependencyAliases,
            },
        },
    };
    globalConfig = configToUse;
    return globalConfig;
}
exports.configureCantara = configureCantara;
