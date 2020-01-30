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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var util_1 = require("../util");
var init_1 = __importDefault(require("../../bootstrap/init"));
if (process.env.NODE_ENV === 'development') {
    dotenv_1.default.config();
}
var userProjectPath = process.env.NODE_ENV === 'development'
    ? process.env.DEV_PROJECT_PATH
    : process.cwd();
if (!userProjectPath) {
    throw new Error("No project path was set. Set DEV_PROJECT_PATH in .env file to continue development!");
}
/** Execute this function before each command */
function prepareCantara(_a) {
    var appname = _a.appname, cmdName = _a.cmdName, additionalCliOptions = _a.additionalCliOptions, stage = _a.stage;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    util_1.setupCliContext();
                    return [4 /*yield*/, init_1.default({
                            additionalCliOptions: additionalCliOptions,
                            appname: appname,
                            cmdName: cmdName,
                            stage: stage,
                            userProjectPath: userProjectPath,
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.prepareCantara = prepareCantara;
function execCantaraCommand(_a) {
    var allCantaraCommands = _a.allCantaraCommands, parsedCommand = _a.parsedCommand, originalCommand = _a.originalCommand;
    return __awaiter(this, void 0, void 0, function () {
        var userDefinedStage, stage, _b, actionName, parameters, foundAction, additionalCliOptionsUnsanitized, additionalCliOptions, actionParameters;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (parsedCommand.commands.length === 0) {
                        throw new Error("You must specify an action, e.g.: cantara e2e");
                    }
                    userDefinedStage = parsedCommand.flags.find(function (flag) { return flag.name === 'stage'; });
                    stage = userDefinedStage ? userDefinedStage.value : 'not_set';
                    _b = parsedCommand.commands, actionName = _b[0], parameters = _b.slice(1);
                    foundAction = allCantaraCommands.find(function (cmd) { return cmd.actionName === actionName; });
                    if (!foundAction) {
                        throw new Error("There is no command named '" + actionName + "'.");
                    }
                    additionalCliOptionsUnsanitized = originalCommand.slice(2);
                    additionalCliOptions = additionalCliOptionsUnsanitized
                        .join(' ')
                        .replace(/--stage [^\s\\]*/, '');
                    actionParameters = parsedCommand.commands
                        .slice(1)
                        .reduce(function (obj, cmd, i) {
                        var _a;
                        var foundParam = foundAction.parameters && foundAction.parameters[i];
                        if (foundParam) {
                            return __assign(__assign({}, obj), (_a = {}, _a[foundParam.name] = cmd, _a));
                        }
                        return obj;
                    }, {});
                    return [4 /*yield*/, prepareCantara({
                            appname: actionParameters.appname,
                            cmdName: actionName,
                            stage: stage.toString(),
                            additionalCliOptions: additionalCliOptions,
                        })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, Promise.resolve(foundAction.exec({ parameters: parameters, originalCommand: originalCommand, stage: stage.toString() }))];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.execCantaraCommand = execCantaraCommand;
function parseCliCommand(command) {
    var parsed = command.reduce(function (acc, str, i) {
        var wasStringPartAlreadyHandled = acc.commands.includes(str) ||
            !!acc.flags.find(function (flag) { return str.startsWith("--" + flag.name) || str === flag.value; });
        if (wasStringPartAlreadyHandled) {
            return acc;
        }
        var isFlag = str.startsWith('--');
        if (isFlag) {
            var flagValue = true;
            var flagName = str.replace('--', '');
            var hasFlagValue = command[i + 1] !== undefined && command[i + 1] !== null;
            if (hasFlagValue) {
                flagValue = command[i + 1];
                if (flagValue === 'false') {
                    flagValue = false;
                }
            }
            return __assign(__assign({}, acc), { flags: __spreadArrays(acc.flags, [{ name: flagName, value: flagValue }]) });
        }
        return __assign(__assign({}, acc), { commands: __spreadArrays(acc.commands, [str]) });
    }, { commands: [], flags: [] });
    return parsed;
}
exports.parseCliCommand = parseCliCommand;
