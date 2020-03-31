"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const cantara_config_1 = __importDefault(require("../../cantara-config"));
const webpackNodeConfig_1 = __importDefault(require("../../util/config/webpackNodeConfig"));
async function buildNodeApp(app) {
    const { allPackages: { include }, runtime: { projectDir, aliases: { packageAliases }, currentCommand: { additionalCliOptions }, }, } = cantara_config_1.default();
    const webpackConfig = webpackNodeConfig_1.default({
        alias: packageAliases,
        app,
        env: app.env,
        mode: 'production',
        projectDir,
        include,
        nodemonOptions: additionalCliOptions,
    });
    const compiler = webpack_1.default(webpackConfig);
    compiler.run(err => {
        if (err) {
            throw new Error('Error while compiling.');
        }
        console.log('Successfully compiled!');
    });
}
exports.default = buildNodeApp;
