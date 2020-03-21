"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importDefault(require("webpack"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var babelNodeConfig_1 = __importDefault(require("./babelNodeConfig"));
var externals_1 = __importDefault(require("../externals"));
var slash_1 = __importDefault(require("slash"));
var NodemonPlugin = require('nodemon-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
var CopyPlugin = require('copy-webpack-plugin');
function createNodeWebpackConfig(_a) {
    var app = _a.app, _b = _a.mode, mode = _b === void 0 ? 'development' : _b, alias = _a.alias, _c = _a.env, env = _c === void 0 ? {} : _c, _d = _a.include, include = _d === void 0 ? [] : _d, _e = _a.nodemonOptions, nodemonOptions = _e === void 0 ? '--inspect' : _e;
    var isDevelopment = mode === 'development';
    var isProduction = mode === 'production';
    var externals = externals_1.default();
    var doesStaticFolderExist = app.paths.static && fs_1.default.existsSync(app.paths.static);
    return {
        entry: app.paths.src,
        output: { path: app.paths.build },
        node: { __dirname: false, __filename: false },
        target: 'node',
        devtool: mode === 'development' ? 'eval-source-map' : undefined,
        mode: mode,
        externals: externals,
        resolve: {
            extensions: [
                '.web.js',
                '.mjs',
                '.js',
                '.json',
                '.web.jsx',
                '.ts',
                '.tsx',
                '.d.ts',
            ],
            alias: alias,
        },
        module: {
            rules: [
                {
                    test: [/\.js$/, /\.tsx?$/],
                    include: __spreadArrays([app.paths.src], include),
                    exclude: [/node_modules/],
                    use: {
                        loader: 'babel-loader',
                        options: babelNodeConfig_1.default,
                    },
                },
                {
                    loader: 'file-loader',
                    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                    options: {
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
            ],
        },
        plugins: [
            new CaseSensitivePathsPlugin(),
            new webpack_1.default.EnvironmentPlugin(env),
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path_1.default.join(app.paths.root, '.tsconfig.local.json'),
                watch: app.paths.src,
            }),
            new FriendlyErrorsWebpackPlugin(),
            isDevelopment
                ? new NodemonPlugin({
                    ext: 'js,graphql,ts,ps1,json,yaml',
                    nodeArgs: [nodemonOptions],
                    watch: app.paths.build,
                })
                : undefined,
            isProduction
                ? new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns: [app.paths.build],
                    dangerouslyAllowCleanPatternsOutsideProject: true,
                    dry: false,
                })
                : undefined,
            doesStaticFolderExist
                ? new CopyPlugin([
                    {
                        from: slash_1.default(app.paths.static || ''),
                        to: slash_1.default(app.paths.build),
                    },
                ])
                : undefined,
        ].filter(Boolean),
    };
}
exports.default = createNodeWebpackConfig;
