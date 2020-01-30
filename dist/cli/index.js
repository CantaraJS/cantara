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
var cli_tools_1 = require("./cli-tools");
var arbitrary_1 = __importDefault(require("../scripts/arbitrary"));
var dev_1 = __importDefault(require("../scripts/dev"));
var deploy_1 = __importDefault(require("../scripts/deploy"));
var build_1 = __importDefault(require("../scripts/build"));
var test_1 = __importDefault(require("../scripts/test"));
var publish_1 = __importDefault(require("../scripts/publish"));
var new_1 = __importDefault(require("../scripts/new"));
var init_1 = __importDefault(require("../scripts/init"));
var exec_changed_1 = __importDefault(require("../scripts/exec-changed"));
var allCantaraCommands = [
    {
        actionName: 'dev',
        parameters: [{ name: 'appname', required: true }],
        exec: function () {
            return dev_1.default();
        },
    },
    {
        actionName: 'deploy',
        parameters: [{ name: 'appname', required: true }],
        exec: function () {
            return deploy_1.default();
        },
    },
    {
        actionName: 'build',
        parameters: [{ name: 'appname', required: true }],
        exec: function () {
            return build_1.default();
        },
    },
    {
        actionName: 'test',
        parameters: [{ name: 'appname', required: true }],
        exec: function () {
            return test_1.default();
        },
    },
    {
        actionName: 'publish',
        parameters: [{ name: 'appname', required: true }],
        exec: function () {
            return publish_1.default();
        },
    },
    {
        actionName: 'run',
        parameters: [{ name: 'appname', required: true }],
        exec: function (_a) {
            var originalCommand = _a.originalCommand;
            return arbitrary_1.default(originalCommand);
        },
    },
    {
        actionName: 'new',
        parameters: [
            { name: 'type', required: true },
            { name: 'name', required: true },
        ],
        exec: function (_a) {
            var _b = _a.parameters, name = _b[0], type = _b[1];
            return new_1.default({ type: type, name: name });
        },
    },
    {
        actionName: 'init',
        parameters: [{ name: 'path' }, { name: 'template' }],
        exec: function (_a) {
            var _b = _a.parameters, userPath = _b[0], template = _b[1];
            var templateToUse = template ? template : 'cantara-simple-starter';
            var pathToUse = userPath ? path_1.default.resolve(userPath) : process.cwd();
            return init_1.default({
                projectDir: pathToUse,
                templateName: templateToUse,
            });
        },
    },
    {
        actionName: 'build-changed',
        exec: function (_a) {
            var stage = _a.stage;
            return exec_changed_1.default(function (appname) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, cli_tools_1.prepareCantara({
                                cmdName: 'build',
                                additionalCliOptions: '',
                                appname: appname,
                                stage: stage,
                            })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, build_1.default()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        },
    },
];
function setupCliInterface() {
    var TEST_CMD = 'run demo install -S react-icons'.split(' ');
    var cmdToUse = process.env.NODE_ENV === 'development' ? TEST_CMD : process.argv.slice(2);
    var parsedCommand = cli_tools_1.parseCliCommand(cmdToUse);
    cli_tools_1.execCantaraCommand({
        allCantaraCommands: allCantaraCommands,
        parsedCommand: parsedCommand,
        originalCommand: cmdToUse,
    });
}
exports.default = setupCliInterface;
