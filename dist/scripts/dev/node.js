"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const cantara_config_1 = __importStar(require("../../cantara-config"));
const webpackNodeConfig_1 = __importDefault(require("../../util/config/webpackNodeConfig"));
function startNodeAppDevelopmentServer() {
    const { allPackages: { include }, runtime: { projectDir, aliases: { packageAliases }, currentCommand: { additionalCliOptions }, }, } = cantara_config_1.default();
    const activeApp = cantara_config_1.getActiveApp();
    const webpackConfig = webpackNodeConfig_1.default({
        app: activeApp,
        alias: packageAliases,
        projectDir,
        env: activeApp.env,
        include,
        nodemonOptions: additionalCliOptions,
    });
    const compiler = webpack_1.default(webpackConfig);
    compiler.watch({}, (err, stats) => {
        if (err) {
            throw new Error('Build error.');
        }
    });
}
exports.startNodeAppDevelopmentServer = startNodeAppDevelopmentServer;
