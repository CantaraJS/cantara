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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var fs_1 = require("fs");
var exec_1 = __importDefault(require("../util/exec"));
var cantara_config_1 = __importStar(require("../cantara-config"));
var slash_1 = __importDefault(require("slash"));
var configTemplates_1 = __importDefault(require("../util/configTemplates"));
var fs_2 = require("../util/fs");
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
function getInstalledDependencies(_a) {
    var rootDir = _a.rootDir;
    var localPackageJsonPath = path_1.default.join(rootDir, 'package.json');
    var getActuallyInstalledDeps = function (dependencies) {
        var actualDependencies = Object.keys(dependencies).reduce(function (obj, depName) {
            var _a;
            var version = dependencies[depName];
            // If found in node_modules folder, keep it
            var depPath = path_1.default.join(rootDir, 'node_modules', depName);
            if (fs_1.existsSync(depPath)) {
                return __assign(__assign({}, obj), (_a = {}, _a[depName] = version, _a));
            }
            // If not, exclude it. Needs to be installed.
            return obj;
        }, {});
        return actualDependencies;
    };
    if (fs_1.existsSync(localPackageJsonPath)) {
        var _b = JSON.parse(fs_1.readFileSync(localPackageJsonPath).toString()), _c = _b.dependencies, dependencies = _c === void 0 ? {} : _c, _d = _b.devDependencies, devDependencies = _d === void 0 ? {} : _d;
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
function createPackageJson(_a) {
    var folderPath = _a.folderPath;
    return __awaiter(this, void 0, void 0, function () {
        var packageJsonPath, packageJsonContent, newPackageJsonContent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, exec_1.default("npm init -y", {
                        workingDirectory: folderPath,
                    })];
                case 1:
                    _b.sent();
                    packageJsonPath = path_1.default.join(folderPath, 'package.json');
                    packageJsonContent = fs_2.readFileAsJSON(packageJsonPath);
                    newPackageJsonContent = __assign(__assign({}, packageJsonContent), { private: true, main: 'build/index.js' });
                    fs_2.writeJson(packageJsonPath, newPackageJsonContent);
                    return [2 /*return*/];
            }
        });
    });
}
/** Returns a string of dependecies that
 * need to be installed in the form of:
 * "react@16.0.0 react-dom@16.0.0"
 */
function getDependenciesInstallationString(_a) {
    var expectedDependencies = _a.expectedDependencies, actualDependencies = _a.actualDependencies;
    var dependenciesToInstall = Object.keys(expectedDependencies)
        .reduce(function (depsStr, depName) {
        var appDependencyVersion = actualDependencies[depName];
        var expectedVersion = expectedDependencies[depName];
        if (expectedVersion && expectedVersion !== appDependencyVersion) {
            return depName + "@" + expectedVersion + " " + depsStr;
        }
        return depsStr;
    }, '')
        .trim();
    return dependenciesToInstall;
}
/** Updates/installs the specified dependecies in the
 * specified folder. Creates a package.json if none exists.
 */
function createOrUpdatePackageJSON(_a) {
    var rootDir = _a.rootDir, expectedDependencies = _a.expectedDependencies, expectedDevDependencies = _a.expectedDevDependencies;
    return __awaiter(this, void 0, void 0, function () {
        var localPackageJsonPath, nodeModulesPath, _b, _c, dependencies, _d, devDependencies, dependenciesToInstall, devDependenciesToInstall;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    localPackageJsonPath = path_1.default.join(rootDir, 'package.json');
                    nodeModulesPath = path_1.default.join(rootDir, 'node_modules');
                    if (!fs_1.existsSync(localPackageJsonPath)) return [3 /*break*/, 7];
                    if (!!fs_1.existsSync(nodeModulesPath)) return [3 /*break*/, 2];
                    return [4 /*yield*/, exec_1.default("npm i", {
                            workingDirectory: rootDir,
                            redirectIo: true,
                        })];
                case 1:
                    _e.sent();
                    // If it still doesn't exist,
                    // dependencies/devDependencies is empty
                    // in package.json
                    // Therefore create node_modules folder ourselves
                    // so that "npm i" isn't called every time
                    // this function is executed
                    if (!fs_1.existsSync(nodeModulesPath)) {
                        fs_1.mkdirSync(nodeModulesPath);
                    }
                    _e.label = 2;
                case 2:
                    _b = getInstalledDependencies({ rootDir: rootDir }), _c = _b.dependencies, dependencies = _c === void 0 ? {} : _c, _d = _b.devDependencies, devDependencies = _d === void 0 ? {} : _d;
                    if (!expectedDependencies) return [3 /*break*/, 4];
                    dependenciesToInstall = getDependenciesInstallationString({
                        expectedDependencies: expectedDependencies,
                        actualDependencies: dependencies,
                    });
                    if (!dependenciesToInstall) return [3 /*break*/, 4];
                    return [4 /*yield*/, exec_1.default("npm install -S " + dependenciesToInstall, {
                            workingDirectory: rootDir,
                            redirectIo: true,
                        })];
                case 3:
                    _e.sent();
                    _e.label = 4;
                case 4:
                    if (!expectedDevDependencies) return [3 /*break*/, 6];
                    devDependenciesToInstall = getDependenciesInstallationString({
                        expectedDependencies: expectedDevDependencies,
                        actualDependencies: devDependencies,
                    });
                    if (!devDependenciesToInstall) return [3 /*break*/, 6];
                    return [4 /*yield*/, exec_1.default("npm install -D " + devDependenciesToInstall, {
                            workingDirectory: rootDir,
                            redirectIo: true,
                        })];
                case 5:
                    _e.sent();
                    _e.label = 6;
                case 6: return [3 /*break*/, 10];
                case 7: 
                // Create new packageJSON and install dependencies
                return [4 /*yield*/, createPackageJson({ folderPath: rootDir })];
                case 8:
                    // Create new packageJSON and install dependencies
                    _e.sent();
                    return [4 /*yield*/, createOrUpdatePackageJSON({
                            rootDir: rootDir,
                            expectedDependencies: expectedDependencies,
                            expectedDevDependencies: expectedDevDependencies,
                        })];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.createOrUpdatePackageJSON = createOrUpdatePackageJSON;
/** Converts webpack compatible aliases
 * into Jest's `moduleNameMapper` aliases
 */
function getJestAliases() {
    var packageAliases = cantara_config_1.default().runtime.aliases.packageAliases;
    try {
        var activeApp_1 = cantara_config_1.getActiveApp();
        var jestAliases = Object.keys(packageAliases).reduce(function (aliasObj, packageName) {
            var _a;
            var packageAbsolutePath = packageAliases[packageName];
            var relativePathToPackage = path_1.default.relative(activeApp_1.paths.root, packageAbsolutePath);
            return __assign(__assign({}, aliasObj), (_a = {}, _a["^" + packageName + "$"] = "<rootDir>/" + slash_1.default(relativePathToPackage), _a));
        }, {});
        return jestAliases;
    }
    catch (_a) {
        // No active app, skipping...
        return {};
    }
}
function createJestConfig(_a) {
    var dir = _a.dir, configTemplateFileName = _a.configTemplateFileName, _b = _a.setupScriptImports, setupScriptImports = _b === void 0 ? [] : _b;
    var globalCantaraConfig = cantara_config_1.default();
    var jestAliases = getJestAliases();
    // Copy setup file to project root
    var setupFileTemplatePath = path_1.default.join(globalCantaraConfig.internalPaths.static, 'jestSetup.template.ts');
    var renderedSetupFile = configTemplates_1.default({
        template: fs_1.readFileSync(setupFileTemplatePath).toString(),
        variables: {
            ENV_FILE_PATH: slash_1.default(path_1.default.join(globalCantaraConfig.internalPaths.temp, '.env.json')),
            IMPORTS: setupScriptImports.reduce(function (importStr, importName) {
                return importStr + "import '" + importName + "'\n";
            }, ''),
        },
    });
    var setupFileDestination = path_1.default.join(dir, 'jest.setup.ts');
    fs_1.writeFileSync(setupFileDestination, renderedSetupFile);
    // create jest.config.js
    var jestConfigTemplate = fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, configTemplateFileName)).toString();
    // Map all package aliases and mock all possible import file types
    var styleMockFilePath = path_1.default.join(globalCantaraConfig.internalPaths.static, 'jestStyleMock.js');
    var fileMockFilePath = path_1.default.join(globalCantaraConfig.internalPaths.static, 'jestFileMock.js');
    var moduleNameMapper = __assign(__assign({}, jestAliases), { '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': fileMockFilePath, '\\.(css|less)$': styleMockFilePath });
    var templateVariables = {
        MODULES_PATH: slash_1.default(path_1.default.join(globalCantaraConfig.internalPaths.root, 'node_modules')),
        MODULE_NAME_MAPPER: JSON.stringify(moduleNameMapper, null, 2),
    };
    var newJestConfig = configTemplates_1.default({
        template: jestConfigTemplate,
        variables: templateVariables,
    });
    var newJestConfigPath = path_1.default.join(dir, 'jest.config.js');
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
    var temp = cantara_config_1.default().internalPaths.temp;
    try {
        var env = cantara_config_1.getActiveApp().env;
        var jsonFilePath = path_1.default.join(temp, '.env.json');
        fs_2.writeJson(jsonFilePath, env || {});
    }
    catch (_a) {
        // No app active, skipping this step...
    }
}
exports.createTempEnvJsonFile = createTempEnvJsonFile;
/**
 * Create local tsconfig which extends from global one.
 * Needed to correctly generate types
 */
function createLocalAppTsConfig(_a) {
    var indexFileName = _a.indexFileName, app = _a.app;
    var globalCantaraConfig = cantara_config_1.default();
    var appLocalTsConfigTemplate = fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, 'appLocalTsConfigTemplate.json')).toString();
    var renderedTsConfig = configTemplates_1.default({
        template: appLocalTsConfigTemplate,
        variables: {
            INDEX_FILE_NAME: indexFileName,
        },
    });
    var appLocalTsConfigPath = path_1.default.join(app.paths.root, '.tsconfig.local.json');
    fs_2.writeJson(appLocalTsConfigPath, JSON.parse(renderedTsConfig));
}
exports.createLocalAppTsConfig = createLocalAppTsConfig;
