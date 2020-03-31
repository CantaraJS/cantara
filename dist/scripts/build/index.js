"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("./node"));
const react_1 = __importDefault(require("./react"));
const packages_1 = __importDefault(require("./packages"));
const cantara_config_1 = require("../../cantara-config");
/** Creates a production build
 * of the currently active app/package */
async function buildActiveApp() {
    const activeApp = cantara_config_1.getActiveApp();
    if (activeApp.type === 'react') {
        await react_1.default(activeApp);
    }
    else if (activeApp.type === 'node') {
        await node_1.default(activeApp);
    }
    else if (activeApp.type === 'js-package' ||
        activeApp.type === 'react-component') {
        await packages_1.default(activeApp);
    }
    else {
        console.log(`Apps of type ${activeApp.type} can't be built.`);
    }
}
exports.default = buildActiveApp;
