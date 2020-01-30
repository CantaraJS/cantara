"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cantara_config_1 = require("../../cantara-config");
var exec_1 = __importDefault(require("../../util/exec"));
var npmCommands_1 = __importDefault(require("./npmCommands"));
/**
 * This function is executed if no cantara command
 * was matched. First, look if it is an NPM command.
 * If not, try to execute it as an arbitrary command
 * with the package's/app's root as the CWD.
 */
function executeArbitraryCmdWithinApp(originalCommand) {
    var cmd = originalCommand[2], params = originalCommand.slice(3);
    var activeApp = cantara_config_1.getActiveApp();
    var isNpmCommand = npmCommands_1.default.includes(cmd);
    var cmdToExecute = '';
    if (isNpmCommand) {
        cmdToExecute = "npm " + cmd + " " + params.join(' ');
    }
    else {
        cmdToExecute = cmd + " " + params.join(' ');
    }
    console.log({ cmdToExecute: cmdToExecute, cwd: activeApp.paths.root });
    exec_1.default(cmdToExecute, {
        workingDirectory: activeApp.paths.root,
        withSecrets: true,
        redirectIo: true,
    });
}
exports.default = executeArbitraryCmdWithinApp;
