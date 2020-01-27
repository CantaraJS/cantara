"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cantara_config_1 = __importStar(require("../../cantara-config"));
var exec_1 = __importDefault(require("../../util/exec"));
function executeTests() {
    var additionalCliOptions = cantara_config_1.default().runtime.currentCommand.additionalCliOptions;
    var activeApp = cantara_config_1.getActiveApp();
    var cmdToExecute = "jest " + additionalCliOptions;
    exec_1.default(cmdToExecute, {
        workingDirectory: activeApp.paths.root,
        redirectIo: true,
    });
}
exports.default = executeTests;
