"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cantara_config_1 = __importDefault(require("../../cantara-config"));
var node_1 = __importDefault(require("./node"));
var react_1 = __importDefault(require("./react"));
var packages_1 = __importDefault(require("./packages"));
/** Creates a production build of the currently active app/package */
function buildActiveApp() {
    var activeApp = cantara_config_1.default().runtime.currentCommand.app;
    if (activeApp.type === 'react') {
        react_1.default(activeApp);
    }
    if (activeApp.type === 'node') {
        node_1.default(activeApp);
    }
    if (activeApp.type === 'js-package' || activeApp.type === 'react-component') {
        packages_1.default(activeApp);
    }
}
exports.default = buildActiveApp;
