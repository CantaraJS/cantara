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
var globalConfig = undefined;
function getGlobalConfig() {
    if (!globalConfig)
        throw new Error("Cantara's global configuration was not set yet!");
    return globalConfig;
}
exports.default = getGlobalConfig;
/** Config can only be set once */
function configureCantara(config) {
    var staticFilesPath = path_1.default.join(config.packageRootDir, 'static');
    var tempFolder = path_1.default.join(staticFilesPath, '.temp');
    var projectDir = config.projectDir || process.cwd();
    var allApps = util_1.default({ rootDir: projectDir, stage: config.stage });
    var currentActiveApp = allApps.find(function (app) { return app.name === config.currentCommand.appname; });
    if (!currentActiveApp) {
        throw new Error("The app \"" + config.currentCommand.appname + "\" does not exist.");
    }
    var configToUse = {
        allApps: allApps,
        allPackages: {
            include: allApps
                .filter(function (app) { return app.type === 'js-package' || app.type === 'react-component'; })
                .map(function (app) { return app.paths.src; }),
        },
        aliases: {
            packageAliases: aliases_1.default({
                allApps: allApps,
                activeApp: currentActiveApp,
            }),
            appDependencyAliases: aliases_1.getDependencyAliases(currentActiveApp),
        },
        dependencies: {
            react: react_1.reactDependencies,
            typescript: types_1.typescriptDependencies,
            testing: testing_1.testingDependencies,
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
        },
    };
    globalConfig = Object.freeze(configToUse);
}
exports.configureCantara = configureCantara;
