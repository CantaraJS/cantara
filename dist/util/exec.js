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
var child_process_1 = require("child_process");
var path_1 = __importDefault(require("path"));
var cantara_config_1 = __importDefault(require("../cantara-config"));
function spawnCmd(cmd, _a) {
    var _b = _a === void 0 ? {} : _a, workingDirectory = _b.workingDirectory, redirectIo = _b.redirectIo, _c = _b.env, env = _c === void 0 ? {} : _c;
    return new Promise(function (resolve, reject) {
        var options = {
            cwd: workingDirectory,
            env: __assign(__assign({}, process.env), env),
        };
        if (process.env.NODE_ENV === 'development' &&
            (cmd.startsWith('cantara') || cmd.startsWith('ctra'))) {
            // If Cantara calls itself in development mode
            // it always uses the the TEST_CMD. Therefore,
            // explicitly delete it
            delete options.env.NODE_ENV;
        }
        var _a = cmd.split(' '), programCmd = _a[0], params = _a.slice(1);
        var retData = '';
        var newProcess = child_process_1.spawn(programCmd, params, __assign(__assign({}, options), { shell: true, stdio: redirectIo ? 'inherit' : undefined }));
        function onExit(exitCode) {
            if (exitCode === 0) {
                resolve(retData);
            }
            else {
                reject("Command \"" + cmd + "\" failed.");
            }
        }
        newProcess.stdio.forEach(function (io) {
            return io &&
                io.on('data', function (data) {
                    retData += "\n" + data.toString();
                });
        });
        // newProcess.on('close', onExit);
        newProcess.on('exit', onExit);
        newProcess.on('error', function (e) {
            reject(e);
        });
        // newProcess.on('disconnect', onExit);
    });
}
exports.spawnCmd = spawnCmd;
/**
 * Retrieved paths of folder which should
 * be added to PATH during this session.
 * Like this, commands can be executed
 * directly from the node_modules folder.
 * Same technique as npm run-scripts uses.
 * Add the following node_modules/.bin
 * folders to PATH:
 * - Cantara's node_modules
 * - The user's project node_modules
 */
function getCurrentPATH() {
    var globalCantaraConfig = cantara_config_1.default();
    var getNodeModulesBinPath = function (folderWithNodeModules) {
        return (folderWithNodeModules + path_1.default.sep + 'node_modules' + path_1.default.sep + '.bin');
    };
    var localNodeModulesBinPath = getNodeModulesBinPath(globalCantaraConfig.internalPaths.root);
    var userProjectNodeModulesBinPath = getNodeModulesBinPath(globalCantaraConfig.runtime.projectDir);
    var newPathEnv = process.env.PATH || '';
    var pathsToAdd = [localNodeModulesBinPath, userProjectNodeModulesBinPath];
    for (var _i = 0, pathsToAdd_1 = pathsToAdd; _i < pathsToAdd_1.length; _i++) {
        var pathToAdd = pathsToAdd_1[_i];
        if (!newPathEnv.includes(pathToAdd)) {
            newPathEnv += path_1.default.delimiter + pathToAdd;
        }
    }
    return newPathEnv;
}
/** Execute commands in different contexts and
 * with different folders in PATH.
 */
function execCmd(cmd, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.workingDirectory, workingDirectory = _c === void 0 ? process.cwd() : _c, redirectIo = _b.redirectIo, withSecrets = _b.withSecrets;
    return __awaiter(this, void 0, void 0, function () {
        var globalCantaraConfig, NEW_PATH_ENV, secretsEnvVars, options;
        return __generator(this, function (_d) {
            globalCantaraConfig = cantara_config_1.default();
            NEW_PATH_ENV = getCurrentPATH();
            secretsEnvVars = withSecrets ? globalCantaraConfig.runtime.secrets : {};
            options = {
                workingDirectory: workingDirectory,
                env: __assign(__assign({}, secretsEnvVars), { PATH: NEW_PATH_ENV || '' }),
                redirectIo: redirectIo,
            };
            return [2 /*return*/, spawnCmd(cmd, options)];
        });
    });
}
exports.default = execCmd;
