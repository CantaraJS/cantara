"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cantara_config_1 = require("../../cantara-config");
var exec_1 = __importDefault(require("../../util/exec"));
function startServerlessEndpointDevelopmentServer() {
    var activeApp = cantara_config_1.getActiveApp();
    var skipCacheInvalidation = activeApp.meta.skipCacheInvalidation;
    var serverlessParametersToAdd = skipCacheInvalidation
        ? '--webpack-no-watch --skipCacheInvalidation'
        : '';
    var serverlessCmd = "serverless offline start --stage dev --dontPrintOutput " + serverlessParametersToAdd;
    var nodemonCmd = "nodemon --exec \"" + serverlessCmd + "\" --watch " + activeApp.paths.root + " --ext js,ts,json,graphql";
    var cmdToExecute = skipCacheInvalidation ? nodemonCmd : serverlessCmd;
    exec_1.default(cmdToExecute, {
        workingDirectory: activeApp.paths.root,
        redirectIo: true,
    });
}
exports.default = startServerlessEndpointDevelopmentServer;
