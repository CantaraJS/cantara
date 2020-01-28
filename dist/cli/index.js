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
var commander_1 = __importDefault(require("commander"));
var path_1 = __importDefault(require("path"));
var dev_1 = __importDefault(require("../scripts/dev"));
var build_1 = __importDefault(require("../scripts/build"));
var deploy_1 = __importDefault(require("../scripts/deploy"));
var arbitrary_1 = __importDefault(require("../scripts/arbitrary"));
var test_1 = __importDefault(require("../scripts/test"));
var publish_1 = __importDefault(require("../scripts/publish"));
var new_1 = __importDefault(require("../scripts/new"));
var init_1 = __importDefault(require("../scripts/init"));
var exec_changed_1 = __importDefault(require("../scripts/exec-changed"));
var init_2 = __importDefault(require("../bootstrap/init"));
var util_1 = require("./util");
var packageJSON = require('../../package.json');
var TEST_CMD = 'deploy greeting-api --stage staging';
var userProjectPath = process.env.NODE_ENV === 'development'
    ? 'C:\\Users\\maxim\\DEV\\new-cantara'
    : process.cwd();
var cmdArr = process.env.NODE_ENV === 'development'
    ? __spreadArrays(['', ''], TEST_CMD.split(' ')) : process.argv;
var _a = util_1.prepareCmdForCommander(cmdArr, commander_1.default), cmdToParse = _a.cmd, additionalCliOptions = _a.unknownParams;
/** Is set to true if any Cantara command was executed.
 * If no cantara command was matched,
 * the tool tries to execute the npm command
 * for the specified app/package. If no NPM command with this name
 * exists, it tries to execute it as an arbitrary
 * command with the specified app/package as the CWD.
 */
var wasCantaraCommandExecuted = false;
/** Execute this function before each command */
function prepareCantara(_a) {
    var appname = _a.appname, cmdName = _a.cmdName, additionalCliOptions = _a.additionalCliOptions;
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    wasCantaraCommandExecuted = true;
                    util_1.setupCliContext();
                    return [4 /*yield*/, init_2.default({
                            additionalCliOptions: additionalCliOptions,
                            appname: appname,
                            cmdName: cmdName,
                            stage: commander_1.default.stage,
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
commander_1.default.version(packageJSON.version);
/** Stage can be configured externally via --stage
 * parameter. If not defined, the current stage is
 * derived from the current command as follows:
 * - dev: development
 * - build: production
 * - test: test
 */
commander_1.default.option('-s, --stage <stageName>', 'This parameter affects which environment variables are used.', 'not_set');
commander_1.default
    .command('dev <appname>')
    .description('Start the specified app in development mode.')
    .action(function (appname) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prepareCantara({ appname: appname, cmdName: 'dev', additionalCliOptions: additionalCliOptions })];
            case 1:
                _a.sent();
                dev_1.default();
                return [2 /*return*/];
        }
    });
}); });
commander_1.default
    .command('build <appname>')
    .description('Create a production build for the specified app or package.')
    .action(function (appname) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prepareCantara({ appname: appname, cmdName: 'build', additionalCliOptions: additionalCliOptions })];
            case 1:
                _a.sent();
                return [4 /*yield*/, build_1.default()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
commander_1.default
    .command('deploy <appname>')
    .description('Deploy an application.')
    .action(function (appname) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prepareCantara({ appname: appname, cmdName: 'deploy', additionalCliOptions: additionalCliOptions })];
            case 1:
                _a.sent();
                deploy_1.default();
                return [2 /*return*/];
        }
    });
}); });
commander_1.default
    .command('test <appname>')
    .description('Execute Jest tests for the specified application. Jest parameters can be appended at the end of the command.')
    .action(function (appname) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prepareCantara({ appname: appname, cmdName: 'test', additionalCliOptions: additionalCliOptions })];
            case 1:
                _a.sent();
                test_1.default();
                return [2 /*return*/];
        }
    });
}); });
commander_1.default
    .command('publish <package-name>')
    .description('Publish a package to npm. Make sure to execute tests yourself before publishing.')
    .action(function (packageName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prepareCantara({
                    appname: packageName,
                    cmdName: 'publish',
                    additionalCliOptions: additionalCliOptions,
                })];
            case 1:
                _a.sent();
                publish_1.default();
                return [2 /*return*/];
        }
    });
}); });
commander_1.default
    .command('new <react-app|node-app|serverless|package|react-component|react-cmp> <name>')
    .action(function (type, name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prepareCantara({
                    cmdName: 'new',
                    additionalCliOptions: additionalCliOptions,
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, new_1.default({
                        type: type,
                        name: name,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
commander_1.default
    .command('init [path] [template]')
    .description("Initialize a new project from a template.\n    If no path is specified, the current working directory is used (if empty).\n    If no template is specified, cantara-simple-starter is used.")
    .action(function (userPath, template) { return __awaiter(void 0, void 0, void 0, function () {
    var templateToUse, pathToUse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wasCantaraCommandExecuted = true;
                templateToUse = template ? template : 'cantara-simple-starter';
                pathToUse = userPath ? path_1.default.resolve(userPath) : process.cwd();
                return [4 /*yield*/, init_1.default({
                        projectDir: pathToUse,
                        templateName: templateToUse,
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
commander_1.default
    .command('build-changed')
    .description('Creates a production build of all apps/packages that changed since the last commit.')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prepareCantara({ cmdName: 'build-changed', additionalCliOptions: additionalCliOptions })];
            case 1:
                _a.sent();
                return [4 /*yield*/, exec_changed_1.default(function (appname) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prepareCantara({ cmdName: 'build', additionalCliOptions: additionalCliOptions, appname: appname })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, build_1.default()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
/** Execute npm commands in the scope of a package/app */
commander_1.default
    .command('<appname> <command> [parameters...]')
    .description('Execute npm commands for the specified app or package. If you want to e.g. install a package from npm for your React Component named "button", you can execute: "cantara button install @emotion/core".')
    .action(function (appname, command) {
    var parameters = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        parameters[_i - 2] = arguments[_i];
    }
    // console.log({ appname, command, parameters });
});
commander_1.default.parse(cmdToParse);
if (!wasCantaraCommandExecuted) {
    if (commander_1.default.args.length <= 1) {
        commander_1.default.help();
    }
    prepareCantara({
        appname: commander_1.default.args[0],
        cmdName: commander_1.default.args[1],
        additionalCliOptions: additionalCliOptions,
    }).then(function () {
        var allCmds = cmdToParse.slice(2);
        arbitrary_1.default(allCmds);
    });
}
