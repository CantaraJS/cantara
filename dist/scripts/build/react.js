"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cantara_config_1 = __importDefault(require("../../cantara-config"));
var webpackReactConfig_1 = __importDefault(require("../../util/config/webpackReactConfig"));
var webpack_1 = __importDefault(require("webpack"));
function buildReactApp(app) {
    var _a = cantara_config_1.default(), include = _a.allPackages.include, _b = _a.runtime, projectDir = _b.projectDir, packageAliases = _b.aliases.packageAliases;
    var webpackConfig = webpackReactConfig_1.default({
        alias: packageAliases,
        app: app,
        env: app.env,
        mode: 'production',
        projectDir: projectDir,
        include: include,
    });
    var compiler = webpack_1.default(webpackConfig);
    compiler.run(function (err, stats) {
        if (err) {
            throw new Error('Error while compiling.');
        }
        console.log('Successfully compiled!');
    });
}
exports.default = buildReactApp;
