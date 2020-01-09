"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var util_1 = __importDefault(require("./util"));
var aliases_1 = __importDefault(require("./aliases"));
var fs_1 = require("../util/fs");
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
    var reactDependecies = fs_1.readFileAsJSON(path_1.default.join(staticFilesPath, 'react-dependencies.json'));
    var typescriptDependencies = fs_1.readFileAsJSON(path_1.default.join(staticFilesPath, 'ts-dependencies.json'));
    var projectDir = config.projectDir || process.cwd();
    var allApps = util_1.default(projectDir);
    var currentActiveApp = allApps.find(function (app) { return app.name === config.currentCommand.appname; });
    if (!currentActiveApp) {
        throw new Error("The app \"" + config.currentCommand.appname + "\" does not exist.");
    }
    var configToUse = {
        allApps: allApps,
        allPackages: {
            aliases: aliases_1.default(allApps),
            include: allApps
                .filter(function (app) { return app.type === 'js-package' || app.type === 'react-component'; })
                .map(function (app) { return app.paths.src; }),
        },
        dependencies: {
            react: reactDependecies,
            typescript: typescriptDependencies,
        },
        internalPaths: {
            root: config.packageRootDir,
            static: staticFilesPath,
        },
        runtime: {
            projectDir: projectDir,
            currentCommand: {
                name: config.currentCommand.name,
                app: currentActiveApp,
            },
        },
    };
    globalConfig = Object.freeze(configToUse);
}
exports.configureCantara = configureCantara;
