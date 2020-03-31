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
const cantara_config_1 = __importStar(require("../../cantara-config"));
const exec_1 = __importDefault(require("../../util/exec"));
/** Deploys the currently selected application.
 */
function deployActiveApp() {
    const { runtime: { secrets, stage }, } = cantara_config_1.default();
    const activeApp = cantara_config_1.getActiveApp();
    if (activeApp.type !== 'serverless') {
        throw new Error('Currently, only the deployment of serverless endpoints is provided by Cantara.');
    }
    if (!secrets.AWS_ACCESS_KEY_ID || !secrets.AWS_SECRET_ACCESS_KEY) {
        throw new Error('Please define "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" in the .secrets.json file on the root of your project!');
    }
    const serverlessCmd = `serverless deploy --stage ${stage}`;
    exec_1.default(serverlessCmd, {
        workingDirectory: activeApp.paths.root,
        redirectIo: true,
        withSecrets: true,
    });
}
exports.default = deployActiveApp;
