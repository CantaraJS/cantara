"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpackReactConfig_1 = __importDefault(require("../../util/config/webpackReactConfig"));
var cantara_config_1 = __importDefault(require("../../cantara-config"));
var webpack = require("webpack");
/** Creates a production build of the currently active app/package */
function buildActiveApp() {
    var _a = cantara_config_1.default(), _b = _a.allPackages, aliases = _b.aliases, include = _b.include, _c = _a.runtime, activeApp = _c.currentCommand.app, projectDir = _c.projectDir;
    var webpackConfig = webpackReactConfig_1.default({
        alias: aliases,
        app: activeApp,
        mode: 'production',
        projectDir: projectDir,
        include: include,
    });
    var compiler = webpack(webpackConfig);
    compiler.run(function (err, stats) {
        if (err) {
            throw new Error('Error while compiling.');
        }
        console.log('Successfully compiled!');
    });
}
exports.default = buildActiveApp;
