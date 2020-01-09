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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var path_1 = __importDefault(require("path"));
var cantara_config_1 = __importDefault(require("../cantara-config"));
/** Execute commands in different contexts and
 * with different folders in PATH.
 */
function execCmd(cmd, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.workingDirectory, workingDirectory = _c === void 0 ? process.cwd() : _c, redirectIo = _b.redirectIo;
    var globalCantaraConfig = cantara_config_1.default();
    return new Promise(function (resolve, reject) {
        var localNodeModulesBinPath = globalCantaraConfig.internalPaths.root +
            path_1.default.sep +
            'node_modules' +
            path_1.default.sep +
            '.bin';
        var localNodeModulesAlreadyInPath = (process.env.PATH || '').includes(localNodeModulesBinPath);
        var NEW_PATH_ENV = localNodeModulesAlreadyInPath
            ? process.env.PATH
            : process.env.PATH + path_1.default.delimiter + localNodeModulesBinPath;
        var newProcess = child_process_1.exec(cmd, { cwd: workingDirectory, env: __assign(__assign({}, process.env), { PATH: NEW_PATH_ENV }) }, function (err, stdout, stderr) {
            if (err) {
                reject(stderr);
            }
            else {
                resolve(stdout);
            }
        });
        if (redirectIo && newProcess.stdout && newProcess.stderr) {
            newProcess.stdout.pipe(process.stdout);
            newProcess.stderr.pipe(process.stderr);
        }
    });
}
exports.default = execCmd;
