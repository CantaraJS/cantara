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
var cantara_config_1 = __importStar(require("../../cantara-config"));
var webpackNodeConfig_1 = __importDefault(require("../../util/config/webpackNodeConfig"));
function startNodeAppDevelopmentServer() {
    var _a = cantara_config_1.default(), include = _a.allPackages.include, _b = _a.runtime, projectDir = _b.projectDir, packageAliases = _b.aliases.packageAliases;
    var activeApp = cantara_config_1.getActiveApp();
    var webpackConfig = webpackNodeConfig_1.default({
        app: activeApp,
        alias: packageAliases,
        projectDir: projectDir,
        env: activeApp.env,
        include: include,
    });
    var compiler = webpack_1.default(webpackConfig);
    compiler.watch({}, function (err, stats) {
        if (err) {
            throw new Error('Build error.');
        }
    });
}
exports.startNodeAppDevelopmentServer = startNodeAppDevelopmentServer;
