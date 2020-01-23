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
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var util_1 = require("./util");
var cantara_config_1 = __importDefault(require("../cantara-config"));
var fs_1 = require("../util/fs");
var configTemplates_1 = __importDefault(require("../util/configTemplates"));
var fs_2 = require("fs");
function addPeerDeps(packageJsonPath, deps) {
    var packageJson = fs_1.readFileAsJSON(packageJsonPath);
    var newPackageJson = __assign(__assign({}, packageJson), { peerDependencies: deps });
    fs_1.writeJson(packageJsonPath, newPackageJson);
}
/** Prepares a JavaScript package or React Component */
function prepareJsPackage(app) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, reactDeps, testingDeps, staticFilesFolder, indexFileName, isReactComponent, expectedDevDependencies, packageTsConfigTemplate, renderedTsConfig, packageTsConfigPath, npmignorePath, npmignoreDestPath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = cantara_config_1.default(), _b = _a.dependencies, reactDeps = _b.react, testingDeps = _b.testing, staticFilesFolder = _a.internalPaths.static;
                    indexFileName = 'index.ts';
                    isReactComponent = app.type === 'react-component';
                    expectedDevDependencies = isReactComponent
                        ? __assign(__assign({}, reactDeps), testingDeps) : {};
                    // Create package.json if none exists
                    return [4 /*yield*/, util_1.createOrUpdatePackageJSON({
                            rootDir: app.paths.root,
                            expectedDevDependencies: expectedDevDependencies,
                            expectedDependencies: {},
                        })];
                case 1:
                    // Create package.json if none exists
                    _c.sent();
                    if (isReactComponent) {
                        // For React Components, add react and react-dom to the peer dependencies
                        addPeerDeps(path_1.default.join(app.paths.root, 'package.json'), reactDeps);
                        // Create jest config files
                        util_1.createReactJestConfig(app);
                        indexFileName = 'index.tsx';
                    }
                    else {
                        util_1.createNodeJestConfig(app);
                    }
                    packageTsConfigTemplate = fs_2.readFileSync(path_1.default.join(staticFilesFolder, 'packageTsConfigTemplate.json')).toString();
                    renderedTsConfig = configTemplates_1.default({
                        template: packageTsConfigTemplate,
                        variables: {
                            INDEX_FILE_NAME: indexFileName,
                            JEST_SETUP_FILE: './jest.setup.ts',
                        },
                    });
                    packageTsConfigPath = path_1.default.join(app.paths.root, 'tsconfig.build.json');
                    fs_1.writeJson(packageTsConfigPath, JSON.parse(renderedTsConfig));
                    npmignorePath = path_1.default.join(staticFilesFolder, '.npmignore');
                    npmignoreDestPath = path_1.default.join(app.paths.root, '.npmignore');
                    fs_2.copyFileSync(npmignorePath, npmignoreDestPath);
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = prepareJsPackage;
