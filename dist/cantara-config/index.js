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
/** Config can only be set once */
function configureCantara(config) {
    var staticFilesPath = path_1.default.join(config.packageRootDir, 'static');
    var tempFolder = path_1.default.join(staticFilesPath, '.temp');
    var projectDir = config.projectDir || process.cwd();
    var allApps = util_1.default({ rootDir: projectDir, stage: config.stage });
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
            currentCommand: {
                name: config.currentCommand.name,
                app: currentActiveApp,
                additionalCliOptions: config.additionalCliOptions || '',
            },
            secrets: util_1.loadSecrets(projectDir),
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
