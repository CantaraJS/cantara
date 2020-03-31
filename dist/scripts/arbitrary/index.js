"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cantara_config_1 = require("../../cantara-config");
const exec_1 = __importDefault(require("../../util/exec"));
const npmCommands_1 = __importDefault(require("./npmCommands"));
/**
 * This function is executed if no cantara command
 * was matched. First, look if it is an NPM command.
 * If not, try to execute it as an arbitrary command
 * with the package's/app's root as the CWD.
 */
function executeArbitraryCmdWithinApp(originalCommand) {
    const [, , cmd, ...params] = originalCommand;
    const activeApp = cantara_config_1.getActiveApp();
    const isNpmCommand = npmCommands_1.default.includes(cmd);
    let cmdToExecute = '';
    if (isNpmCommand) {
        cmdToExecute = `npm ${cmd} ${params.join(' ')}`;
    }
    else {
        cmdToExecute = `${cmd} ${params.join(' ')}`;
    }
    exec_1.default(cmdToExecute, {
        workingDirectory: activeApp.paths.root,
        withSecrets: true,
        redirectIo: true,
    });
}
exports.default = executeArbitraryCmdWithinApp;
