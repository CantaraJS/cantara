"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cantara_config_1 = require("../../cantara-config");
var react_1 = require("./react");
var node_1 = require("./node");
var serverless_1 = __importDefault(require("./serverless"));
function startDevelopmentServer() {
    var activeApp = cantara_config_1.getActiveApp();
    switch (activeApp.type) {
        case 'react':
            react_1.startReactAppDevelopmentServer();
            break;
        case 'node':
            node_1.startNodeAppDevelopmentServer();
            break;
        case 'serverless':
            serverless_1.default();
            break;
        default:
            throw new Error("\"" + activeApp.meta.displayName + "\" cannot be started in development mode. This is only possible for React Apps, NodeJS Apps and Serverless Endpoints!");
    }
}
exports.default = startDevelopmentServer;
