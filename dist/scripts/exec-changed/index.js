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
var exec_1 = __importDefault(require("../../util/exec"));
var parseDiffSummary_1 = __importDefault(require("./parseDiffSummary"));
var cantara_config_1 = __importDefault(require("../../cantara-config"));
/** Executes a function for all
 * applications/packages whose code
 * has changed since the last commit.
 * Accepts a function as a parameter
 * which gets executed with the name
 * of the app that changed as it's first
 * parameter
 */
function executeForChangedApps(cb) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, projectDir, allApps, res, diffSum, changedAppNames, _i, changedAppNames_1, changedAppName;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = cantara_config_1.default(), projectDir = _a.runtime.projectDir, allApps = _a.allApps;
                    return [4 /*yield*/, exec_1.default('git diff HEAD HEAD~1 --stat', {
                            workingDirectory: projectDir,
                        })];
                case 1:
                    res = _b.sent();
                    diffSum = parseDiffSummary_1.default(res.toString(), projectDir);
                    console.log({ diffSum: diffSum });
                    changedAppNames = diffSum
                        .map(function (changeObj) {
                        if (!changeObj)
                            return false;
                        var srcIndex = changeObj.file.indexOf('src');
                        var rootPath = changeObj.file.slice(0, srcIndex);
                        var name = path_1.default.basename(rootPath);
                        // Only include apps that exist
                        var foundApp = allApps.find(function (app) { return app.name === name; });
                        if (!foundApp)
                            return false;
                        return name;
                    })
                        .filter(Boolean);
                    console.log({ changedAppNames: changedAppNames });
                    _i = 0, changedAppNames_1 = changedAppNames;
                    _b.label = 2;
                case 2:
                    if (!(_i < changedAppNames_1.length)) return [3 /*break*/, 5];
                    changedAppName = changedAppNames_1[_i];
                    return [4 /*yield*/, cb(changedAppName)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.default = executeForChangedApps;
/**
 * Executes an arbitrary command if the specified
 * application changed
 */
function execUserCmdForChangedApp(_a) {
    var _this = this;
    var appname = _a.appname, userCmd = _a.userCmd;
    var projectDir = cantara_config_1.default().runtime.projectDir;
    return executeForChangedApps(function (changedAppName) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(appname === changedAppName)) return [3 /*break*/, 2];
                    // Exec cmd
                    console.log("\"" + appname + "\" changed.\nExecuting \"" + userCmd + "\"");
                    return [4 /*yield*/, exec_1.default(userCmd, {
                            workingDirectory: projectDir,
                            redirectIo: true,
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
}
exports.execUserCmdForChangedApp = execUserCmdForChangedApp;
