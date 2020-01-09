"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importDefault(require("webpack"));
var webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
var cantara_config_1 = __importDefault(require("../../cantara-config"));
var webpackReactConfig_1 = __importDefault(require("../../util/config/webpackReactConfig"));
var clearConsole_1 = __importDefault(require("../../util/clearConsole"));
function startReactAppDevelopmentServer() {
    var _a = cantara_config_1.default(), _b = _a.allPackages, aliases = _b.aliases, include = _b.include, _c = _a.runtime, activeApp = _c.currentCommand.app, projectDir = _c.projectDir;
    var webpackConfig = webpackReactConfig_1.default({
        alias: aliases,
        app: activeApp,
        projectDir: projectDir,
        include: include,
    });
    var compiler = webpack_1.default(webpackConfig);
    var devServer = new webpack_dev_server_1.default(compiler, {
        contentBase: activeApp.paths.build,
        historyApiFallback: true,
        quiet: true,
        hot: true,
        // Enable gzip compression of generated files.
        compress: true,
        // Silence WebpackDevServer's own logs since they're generally not useful.
        // It will still show compile warnings and errors with this setting.
        clientLogLevel: 'none',
    });
    devServer.listen(8080, '::', function (err) {
        clearConsole_1.default();
        if (err) {
            console.log('Error starting webpack dev server:', err);
        }
    });
}
exports.startReactAppDevelopmentServer = startReactAppDevelopmentServer;
