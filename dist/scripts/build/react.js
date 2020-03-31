"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cantara_config_1 = __importDefault(require("../../cantara-config"));
const webpackReactConfig_1 = __importDefault(require("../../util/config/webpackReactConfig"));
const webpack_1 = __importDefault(require("webpack"));
async function buildReactApp(app) {
    const { allPackages: { include }, runtime: { projectDir, aliases: { packageAliases }, }, } = cantara_config_1.default();
    const webpackConfig = webpackReactConfig_1.default({
        alias: packageAliases,
        app,
        env: app.env,
        mode: 'production',
        projectDir,
        include,
    });
    const compiler = webpack_1.default(webpackConfig);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                console.log('Compile error', err);
                reject(new Error('Error while compiling.'));
            }
            else {
                console.log('Successfully compiled!');
            }
        });
    });
}
exports.default = buildReactApp;
