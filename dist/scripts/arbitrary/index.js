"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cantara_config_1 = __importDefault(require("../../cantara-config"));
var exec_1 = __importDefault(require("../../util/exec"));
var npmCommands_1 = __importDefault(require("./npmCommands"));
/**
 * This function is executed if no cantara command
 * was matched. First, look if it is an NPM command.
 * If not, try to execute it as an arbitrary command
 * with the package's/app's root as the CWD.
 */
function executeArbitraryCmdWithinApp(args) {
    var allApps = cantara_config_1.default().allApps;
    var appName = args[0], cmd = args[1], params = args.slice(2);
    var foundApp = allApps.find(function (app) { return app.name === appName; });
    if (!foundApp)
        throw new Error("App/package \"" + foundApp + "\" does not exist!");
    var isNpmCommand = npmCommands_1.default.includes(cmd);
    var cmdToExecute = '';
    if (isNpmCommand) {
        cmdToExecute = "npm " + cmd + " " + params.join(' ') + " --color always";
    }
    else {
        cmdToExecute = cmd + " " + params.join(' ');
    }
    exec_1.default(cmdToExecute, {
        workingDirectory: foundApp.paths.root,
        withSecrets: true,
        redirectIo: true,
    });
}
exports.default = executeArbitraryCmdWithinApp;
