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
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const util_1 = __importStar(require("./util"));
const aliases_1 = __importStar(require("./aliases"));
const react_1 = require("./dependencies/react");
const types_1 = require("./dependencies/types");
const testing_1 = require("./dependencies/testing");
const common_1 = require("./dependencies/common");
const EXPECTED_CANTARA_SECRETS = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
let globalConfig = undefined;
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
    const { runtime: { currentCommand: { app: activeApp }, }, } = getGlobalConfig();
    if (!activeApp) {
        throw new Error('No active application in current Cantara runtime!');
    }
    return activeApp;
}
exports.getActiveApp = getActiveApp;
async function configureCantara(config) {
    const staticFilesPath = path_1.default.join(config.packageRootDir, 'static');
    const tempFolder = path_1.default.join(staticFilesPath, '.temp');
    const projectDir = config.projectDir || process.cwd();
    const allApps = config.currentCommand.appname
        ? await util_1.default({
            rootDir: projectDir,
            stage: config.stage,
            activeAppName: config.currentCommand.appname,
        })
        : [];
    const currentActiveApp = config.currentCommand.appname
        ? allApps.find(app => app.name === config.currentCommand.appname)
        : undefined;
    if (config.currentCommand.appname && !currentActiveApp) {
        throw new Error(`Application "${config.currentCommand.appname}" does not exist.`);
    }
    const packageAliases = currentActiveApp
        ? aliases_1.default({
            allApps,
            activeApp: currentActiveApp,
        })
        : {};
    const appDependencyAliases = currentActiveApp
        ? aliases_1.getDependencyAliases(currentActiveApp)
        : {};
    const globalCantaraSettingsFilePath = path_1.default.join(projectDir, 'cantara.config.js');
    const globalCantaraUserSettings = fs_1.existsSync(globalCantaraSettingsFilePath)
        ? require(globalCantaraSettingsFilePath)
        : {};
    const globalCantaraSettings = {
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
    const nodeModulesPath = util_1.getCantaraDepenciesInstallationPath();
    const configToUse = {
        allApps,
        allPackages: {
            include: allApps
                .filter(app => app.type === 'js-package' || app.type === 'react-component')
                .map(app => app.paths.src),
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
            nodeModules: nodeModulesPath,
        },
        runtime: {
            projectDir,
            globalCantaraSettings,
            stage: config.stage,
            currentCommand: {
                name: config.currentCommand.name,
                app: currentActiveApp,
                additionalCliOptions: config.additionalCliOptions || '',
            },
            secrets: util_1.loadSecrets({ projectDir, secrets: EXPECTED_CANTARA_SECRETS }),
            aliases: {
                packageAliases,
                appDependencyAliases,
            },
        },
    };
    globalConfig = configToUse;
    return globalConfig;
}
exports.configureCantara = configureCantara;
