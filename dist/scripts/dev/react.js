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
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const cantara_config_1 = __importStar(require("../../cantara-config"));
const webpackReactConfig_1 = __importDefault(require("../../util/config/webpackReactConfig"));
const clearConsole_1 = __importDefault(require("../../util/clearConsole"));
function startReactAppDevelopmentServer() {
    const { allPackages: { include }, runtime: { aliases: { packageAliases, appDependencyAliases }, projectDir, }, } = cantara_config_1.default();
    const activeApp = cantara_config_1.getActiveApp();
    const webpackConfig = webpackReactConfig_1.default({
        alias: { ...packageAliases, ...appDependencyAliases },
        app: activeApp,
        projectDir,
        env: activeApp.env,
        include,
    });
    const compiler = webpack_1.default(webpackConfig);
    const devServer = new webpack_dev_server_1.default(compiler, {
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
    devServer.listen(8080, '::', err => {
        clearConsole_1.default();
        if (err) {
            console.log('Error starting webpack dev server:', err);
        }
    });
}
exports.startReactAppDevelopmentServer = startReactAppDevelopmentServer;
