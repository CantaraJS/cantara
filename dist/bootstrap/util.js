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
const exec_1 = __importDefault(require("../util/exec"));
const cantara_config_1 = __importStar(require("../cantara-config"));
const slash_1 = __importDefault(require("slash"));
const configTemplates_1 = __importDefault(require("../util/configTemplates"));
const fs_2 = require("../util/fs");
/**
 * Returns installed dependencies
 * in the specified directory.
 * It first looks up the dependencies
 * which *should* be installed
 * in the package.json and then
 * looks if they are *actually*
 * installed by looking them up
 * in node_modules
 */
function getInstalledDependencies({ rootDir, }) {
    const localPackageJsonPath = path_1.default.join(rootDir, 'package.json');
    const getActuallyInstalledDeps = (dependencies) => {
        const actualDependencies = Object.keys(dependencies).reduce((obj, depName) => {
            const version = dependencies[depName];
            // If found in node_modules folder, keep it
            const depPath = path_1.default.join(rootDir, 'node_modules', depName);
            if (fs_1.existsSync(depPath)) {
                return {
                    ...obj,
                    [depName]: version,
                };
            }
            // If not, exclude it. Needs to be installed.
            return obj;
        }, {});
        return actualDependencies;
    };
    if (fs_1.existsSync(localPackageJsonPath)) {
        const { dependencies = {}, devDependencies = {}, } = JSON.parse(fs_1.readFileSync(localPackageJsonPath).toString());
        return {
            dependencies: getActuallyInstalledDeps(dependencies),
            devDependencies: getActuallyInstalledDeps(devDependencies),
        };
    }
    return { dependencies: {}, devDependencies: {} };
}
/** Create new package.json
 * where none exists.
 */
async function createPackageJson({ folderPath }) {
    await exec_1.default(`npm init -y`, {
        workingDirectory: folderPath,
    });
    // Set private to true
    const packageJsonPath = path_1.default.join(folderPath, 'package.json');
    const packageJsonContent = fs_2.readFileAsJSON(packageJsonPath);
    const newPackageJsonContent = {
        ...packageJsonContent,
        private: true,
        main: 'build/index.js',
    };
    fs_2.writeJson(packageJsonPath, newPackageJsonContent);
}
/** Returns a string of dependecies that
 * need to be installed in the form of:
 * "react@16.0.0 react-dom@16.0.0"
 */
function getDependenciesInstallationString({ expectedDependencies, actualDependencies, }) {
    const dependenciesToInstall = Object.keys(expectedDependencies)
        .reduce((depsStr, depName) => {
        const appDependencyVersion = actualDependencies[depName];
        const expectedVersion = expectedDependencies[depName];
        if (expectedVersion && expectedVersion !== appDependencyVersion) {
            return `${depName}@${expectedVersion} ${depsStr}`;
        }
        return depsStr;
    }, '')
        .trim();
    return dependenciesToInstall;
}
/** Updates/installs the specified dependecies in the
 * specified folder. Creates a package.json if none exists.
 */
async function createOrUpdatePackageJSON({ rootDir, expectedDependencies, expectedDevDependencies, }) {
    // Install/update dependencies
    // Add dependencies
    const localPackageJsonPath = path_1.default.join(rootDir, 'package.json');
    const nodeModulesPath = path_1.default.join(rootDir, 'node_modules');
    if (fs_1.existsSync(localPackageJsonPath)) {
        // If no node_modules folder exists, run "npm install"
        if (!fs_1.existsSync(nodeModulesPath)) {
            await exec_1.default(`npm i`, {
                workingDirectory: rootDir,
                redirectIo: true,
            });
            // If it still doesn't exist,
            // dependencies/devDependencies is empty
            // in package.json
            // Therefore create node_modules folder ourselves
            // so that "npm i" isn't called every time
            // this function is executed
            if (!fs_1.existsSync(nodeModulesPath)) {
                fs_1.mkdirSync(nodeModulesPath);
            }
        }
        // Look if dependencies need to be updated
        const { dependencies = {}, devDependencies = {}, } = getInstalledDependencies({ rootDir });
        if (expectedDependencies) {
            const dependenciesToInstall = getDependenciesInstallationString({
                expectedDependencies,
                actualDependencies: dependencies,
            });
            if (dependenciesToInstall) {
                await exec_1.default(`npm install -S ${dependenciesToInstall}`, {
                    workingDirectory: rootDir,
                    redirectIo: true,
                });
            }
        }
        if (expectedDevDependencies) {
            const devDependenciesToInstall = getDependenciesInstallationString({
                expectedDependencies: expectedDevDependencies,
                actualDependencies: devDependencies,
            });
            if (devDependenciesToInstall) {
                await exec_1.default(`npm install -D ${devDependenciesToInstall}`, {
                    workingDirectory: rootDir,
                    redirectIo: true,
                });
            }
        }
    }
    else {
        // Create new packageJSON and install dependencies
        await createPackageJson({ folderPath: rootDir });
        await createOrUpdatePackageJSON({
            rootDir,
            expectedDependencies,
            expectedDevDependencies,
        });
    }
}
exports.createOrUpdatePackageJSON = createOrUpdatePackageJSON;
/** Converts webpack compatible aliases
 * into Jest's `moduleNameMapper` aliases
 */
function getJestAliases() {
    const { runtime: { aliases: { packageAliases }, }, } = cantara_config_1.default();
    try {
        const activeApp = cantara_config_1.getActiveApp();
        const jestAliases = Object.keys(packageAliases).reduce((aliasObj, packageName) => {
            const packageAbsolutePath = packageAliases[packageName];
            const relativePathToPackage = path_1.default.relative(activeApp.paths.root, packageAbsolutePath);
            return {
                ...aliasObj,
                [`^${packageName}$`]: `<rootDir>/${slash_1.default(relativePathToPackage)}`,
            };
        }, {});
        return jestAliases;
    }
    catch {
        // No active app, skipping...
        return {};
    }
}
function createJestConfig({ dir, configTemplateFileName, setupScriptImports = [], }) {
    const globalCantaraConfig = cantara_config_1.default();
    const jestAliases = getJestAliases();
    // Copy setup file to project root
    const setupFileTemplatePath = path_1.default.join(globalCantaraConfig.internalPaths.static, 'jestSetup.template.ts');
    const renderedSetupFile = configTemplates_1.default({
        template: fs_1.readFileSync(setupFileTemplatePath).toString(),
        variables: {
            ENV_FILE_PATH: slash_1.default(path_1.default.join(globalCantaraConfig.internalPaths.temp, '.env.json')),
            IMPORTS: setupScriptImports.reduce((importStr, importName) => {
                return `${importStr}import '${importName}'\n`;
            }, ''),
        },
    });
    const setupFileDestination = path_1.default.join(dir, 'jest.setup.ts');
    fs_1.writeFileSync(setupFileDestination, renderedSetupFile);
    // create jest.config.js
    const jestConfigTemplate = fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, configTemplateFileName)).toString();
    // Map all package aliases and mock all possible import file types
    const styleMockFilePath = path_1.default.join(globalCantaraConfig.internalPaths.static, 'jestStyleMock.js');
    const fileMockFilePath = path_1.default.join(globalCantaraConfig.internalPaths.static, 'jestFileMock.js');
    const moduleNameMapper = {
        ...jestAliases,
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': fileMockFilePath,
        '\\.(css|less)$': styleMockFilePath,
    };
    const templateVariables = {
        MODULES_PATH: slash_1.default(globalCantaraConfig.internalPaths.nodeModules) + '/',
        MODULE_NAME_MAPPER: JSON.stringify(moduleNameMapper, null, 2),
    };
    const newJestConfig = configTemplates_1.default({
        template: jestConfigTemplate,
        variables: templateVariables,
    });
    const newJestConfigPath = path_1.default.join(dir, 'jest.config.js');
    fs_1.writeFileSync(newJestConfigPath, newJestConfig);
}
exports.createJestConfig = createJestConfig;
function createNodeJestConfig(app) {
    createJestConfig({
        dir: app.paths.root,
        configTemplateFileName: 'jestNodeConfig.template.js',
    });
}
exports.createNodeJestConfig = createNodeJestConfig;
function createReactJestConfig(app) {
    createJestConfig({
        dir: app.paths.root,
        configTemplateFileName: 'jestReactConfig.template.js',
        setupScriptImports: [
            '@testing-library/jest-dom',
            '@testing-library/jest-dom/extend-expect',
        ],
    });
}
exports.createReactJestConfig = createReactJestConfig;
/** Takes all env vars defined
 * for the current stage and writes them
 * to 'static/.temp/.env.json'
 * so that parts of the application
 * which don't have access to the runtime
 * can read them, e.g. the Jest setup file
 * in the user's project
 */
function createTempEnvJsonFile() {
    const { internalPaths: { temp }, } = cantara_config_1.default();
    try {
        const { env } = cantara_config_1.getActiveApp();
        const jsonFilePath = path_1.default.join(temp, '.env.json');
        fs_2.writeJson(jsonFilePath, env || {});
    }
    catch {
        // No app active, skipping this step...
    }
}
exports.createTempEnvJsonFile = createTempEnvJsonFile;
/**
 * Create local tsconfig which extends from global one.
 * Needed to correctly generate types
 */
function createLocalAppTsConfig({ indexFileName, app, }) {
    const globalCantaraConfig = cantara_config_1.default();
    const appLocalTsConfigTemplate = fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, 'appLocalTsConfigTemplate.json')).toString();
    const renderedTsConfig = configTemplates_1.default({
        template: appLocalTsConfigTemplate,
        variables: {
            INDEX_FILE_NAME: indexFileName,
        },
    });
    const appLocalTsConfigPath = path_1.default.join(app.paths.root, '.tsconfig.local.json');
    fs_2.writeJson(appLocalTsConfigPath, JSON.parse(renderedTsConfig));
}
exports.createLocalAppTsConfig = createLocalAppTsConfig;
