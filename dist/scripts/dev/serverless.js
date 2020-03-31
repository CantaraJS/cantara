"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cantara_config_1 = require("../../cantara-config");
const exec_1 = __importDefault(require("../../util/exec"));
function startServerlessEndpointDevelopmentServer() {
    const activeApp = cantara_config_1.getActiveApp();
    const { skipCacheInvalidation } = activeApp.meta;
    const serverlessParametersToAdd = skipCacheInvalidation
        ? '--webpack-no-watch --skipCacheInvalidation'
        : '';
    const serverlessCmd = `serverless offline start --stage dev --dontPrintOutput ${serverlessParametersToAdd}`;
    const nodemonCmd = `nodemon --exec "${serverlessCmd}" --watch ${activeApp.paths.root} --ext js,ts,json,graphql`;
    const cmdToExecute = skipCacheInvalidation ? nodemonCmd : serverlessCmd;
    exec_1.default(cmdToExecute, {
        workingDirectory: activeApp.paths.root,
        redirectIo: true,
    });
}
exports.default = startServerlessEndpointDevelopmentServer;
