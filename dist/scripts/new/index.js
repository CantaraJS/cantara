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
var ncp_1 = __importDefault(require("ncp"));
var del_1 = __importDefault(require("del"));
var util_1 = require("util");
var fs_1 = require("fs");
var string_manipulation_1 = require("../../util/string-manipulation");
var cantara_config_1 = __importDefault(require("../../cantara-config"));
var ncp = util_1.promisify(ncp_1.default);
function createReactComponent(_a) {
    var name = _a.name;
    return __awaiter(this, void 0, void 0, function () {
        var _b, projectDir, _c, staticFolderPath, tempFolderPath, destinationPath, origTemplateFolderPath, templateFolderPath, reactIndexFilePath, origReactIndexFileContent, newReactIndexFileContent;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _b = cantara_config_1.default(), projectDir = _b.runtime.projectDir, _c = _b.internalPaths, staticFolderPath = _c.static, tempFolderPath = _c.temp;
                    destinationPath = path_1.default.join(projectDir, 'packages', name);
                    origTemplateFolderPath = path_1.default.join(staticFolderPath, 'app-templates/react-component');
                    templateFolderPath = path_1.default.join(tempFolderPath, 'react-component-app-template');
                    if (!fs_1.existsSync(templateFolderPath)) return [3 /*break*/, 2];
                    return [4 /*yield*/, del_1.default(templateFolderPath)];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    fs_1.mkdirSync(templateFolderPath);
                    return [4 /*yield*/, ncp(origTemplateFolderPath, templateFolderPath)];
                case 3:
                    _d.sent();
                    reactIndexFilePath = path_1.default.join(templateFolderPath, 'src/index.tsx');
                    origReactIndexFileContent = fs_1.readFileSync(reactIndexFilePath).toString();
                    newReactIndexFileContent = origReactIndexFileContent.replace(new RegExp('Index', 'g'), string_manipulation_1.camalize(name));
                    fs_1.writeFileSync(reactIndexFilePath, newReactIndexFileContent);
                    return [2 /*return*/, { destinationPath: destinationPath, templateFolderPath: templateFolderPath }];
            }
        });
    });
}
function createNewAppOrPackage(_a) {
    var type = _a.type, name = _a.name;
    return __awaiter(this, void 0, void 0, function () {
        var _b, projectDir, staticFolderPath, templateFolderPath, destinationPath, resObj;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = cantara_config_1.default(), projectDir = _b.runtime.projectDir, staticFolderPath = _b.internalPaths.static;
                    templateFolderPath = '';
                    destinationPath = '';
                    if (type === 'react-app') {
                        destinationPath = path_1.default.join(projectDir, 'react-apps', name);
                        templateFolderPath = path_1.default.join(staticFolderPath, 'app-templates/react-app');
                    }
                    if (!(type === 'react-cmp' || type === 'react-component')) return [3 /*break*/, 2];
                    return [4 /*yield*/, createReactComponent({
                            name: name,
                        })];
                case 1:
                    resObj = _c.sent();
                    templateFolderPath = resObj.templateFolderPath;
                    destinationPath = resObj.destinationPath;
                    _c.label = 2;
                case 2:
                    if (type === 'node-app') {
                        destinationPath = path_1.default.join(projectDir, 'node-apps', name);
                        templateFolderPath = path_1.default.join(staticFolderPath, 'app-templates/node-app');
                    }
                    if (type === 'serverless') {
                        destinationPath = path_1.default.join(projectDir, 'node-apps', name);
                        templateFolderPath = path_1.default.join(staticFolderPath, 'app-templates/serverless');
                    }
                    if (type === 'package') {
                        destinationPath = path_1.default.join(projectDir, 'packages', name);
                        templateFolderPath = path_1.default.join(staticFolderPath, 'app-templates/js-package');
                    }
                    if (fs_1.existsSync(destinationPath)) {
                        throw new Error(destinationPath + " already exists! Delete the folder if you want to override it.");
                    }
                    return [4 /*yield*/, ncp(templateFolderPath, destinationPath)];
                case 3:
                    _c.sent();
                    console.log("Created new " + type + " at " + destinationPath + "!");
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = createNewAppOrPackage;
