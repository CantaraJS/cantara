"use strict";
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
var fs_1 = require("fs");
var exec_1 = __importDefault(require("../util/exec"));
/** Updates/installs the specified dependecies in the
 * specified folder. Creates a package.json if none exists.
 */
function createOrUpdatePackageJSON(_a) {
    var rootDir = _a.rootDir, expectedDependencies = _a.expectedDependencies;
    return __awaiter(this, void 0, void 0, function () {
        var localPackageJsonPath, dependencies_1, dependenciesToInstall, dependenciesToInstall;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    localPackageJsonPath = path_1.default.join(rootDir, 'package.json');
                    if (!fs_1.existsSync(localPackageJsonPath)) return [3 /*break*/, 3];
                    dependencies_1 = JSON.parse(fs_1.readFileSync(localPackageJsonPath).toString()).dependencies;
                    dependenciesToInstall = Object.keys(expectedDependencies)
                        .reduce(function (depsStr, depName) {
                        var appDependencyVersion = dependencies_1[depName];
                        var expectedVersion = expectedDependencies[depName];
                        if (expectedVersion && expectedVersion !== appDependencyVersion) {
                            return depName + "@" + expectedVersion + " " + depsStr;
                        }
                        return depsStr;
                    }, '')
                        .trim();
                    if (!dependenciesToInstall) return [3 /*break*/, 2];
                    return [4 /*yield*/, exec_1.default("npm install -S " + dependenciesToInstall, {
                            workingDirectory: rootDir,
                            redirectIo: true,
                        })];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2: return [3 /*break*/, 6];
                case 3: 
                // Create new packageJSON and install dependencies
                return [4 /*yield*/, exec_1.default("npm init -y", {
                        workingDirectory: rootDir,
                    })];
                case 4:
                    // Create new packageJSON and install dependencies
                    _b.sent();
                    dependenciesToInstall = Object.keys(expectedDependencies)
                        .reduce(function (depsStr, depName) {
                        return depName + "@" + expectedDependencies[depName] + " " + depsStr;
                    }, '')
                        .trim();
                    return [4 /*yield*/, exec_1.default("npm install -S " + dependenciesToInstall, {
                            workingDirectory: rootDir,
                            redirectIo: true,
                        })];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.createOrUpdatePackageJSON = createOrUpdatePackageJSON;
/** Takes a template and variables in the form of "<--VARIABLE_NAME-->" and replaces
 * all variables with the values passed */
function renderTemplate(_a) {
    var template = _a.template, variables = _a.variables;
    var variablesNames = Object.keys(variables);
    var renderedTemplate = template;
    for (var _i = 0, variablesNames_1 = variablesNames; _i < variablesNames_1.length; _i++) {
        var varName = variablesNames_1[_i];
        var varValue = variables[varName];
        var replaceVal = "<--" + varName + "-->";
        renderedTemplate = renderedTemplate.replace(new RegExp(replaceVal, 'g'), varValue.toString());
    }
    return renderedTemplate;
}
exports.renderTemplate = renderTemplate;
