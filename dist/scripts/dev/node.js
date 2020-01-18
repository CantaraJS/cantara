"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importDefault(require("webpack"));
var cantara_config_1 = __importDefault(require("../../cantara-config"));
var webpackNodeConfig_1 = __importDefault(require("../../util/config/webpackNodeConfig"));
function startNodeAppDevelopmentServer() {
    var _a = cantara_config_1.default(), _b = _a.runtime, activeApp = _b.currentCommand.app, projectDir = _b.projectDir, packageAliases = _a.aliases.packageAliases;
    var webpackConfig = webpackNodeConfig_1.default({
        app: activeApp,
        alias: packageAliases,
        projectDir: projectDir,
        env: activeApp.env,
    });
    var compiler = webpack_1.default(webpackConfig);
    compiler.watch({}, function (err, stats) {
        if (err) {
            throw new Error('Build error.');
        }
    });
}
exports.startNodeAppDevelopmentServer = startNodeAppDevelopmentServer;
