"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importDefault(require("webpack"));
var cantara_config_1 = __importDefault(require("../../cantara-config"));
var webpackNodeConfig_1 = __importDefault(require("../../util/config/webpackNodeConfig"));
function startNodeAppDevelopmentServer() {
    var _a = cantara_config_1.default().runtime, activeApp = _a.currentCommand.app, projectDir = _a.projectDir;
    var webpackConfig = webpackNodeConfig_1.default({
        app: activeApp,
        projectDir: projectDir,
    });
    var compiler = webpack_1.default(webpackConfig);
    compiler.watch({}, function (err, stats) {
        if (err) {
            throw new Error('Build error.');
        }
    });
}
exports.startNodeAppDevelopmentServer = startNodeAppDevelopmentServer;
