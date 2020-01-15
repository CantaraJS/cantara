"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cantara_config_1 = __importDefault(require("../../cantara-config"));
var exec_1 = __importDefault(require("../../util/exec"));
function executeTests() {
    var activeApp = cantara_config_1.default().runtime.currentCommand.app;
    exec_1.default('jest --watch', {
        workingDirectory: activeApp.paths.root,
        redirectIo: true,
    });
}
exports.default = executeTests;
