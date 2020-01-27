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
var webpack_1 = __importDefault(require("webpack"));
var webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
var cantara_config_1 = __importStar(require("../../cantara-config"));
var webpackReactConfig_1 = __importDefault(require("../../util/config/webpackReactConfig"));
var clearConsole_1 = __importDefault(require("../../util/clearConsole"));
function startReactAppDevelopmentServer() {
    var _a = cantara_config_1.default(), include = _a.allPackages.include, _b = _a.runtime, packageAliases = _b.aliases.packageAliases, projectDir = _b.projectDir;
    var activeApp = cantara_config_1.getActiveApp();
    var webpackConfig = webpackReactConfig_1.default({
        alias: packageAliases,
        app: activeApp,
        projectDir: projectDir,
        env: activeApp.env,
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
