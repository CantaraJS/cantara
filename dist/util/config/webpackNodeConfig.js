"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importDefault(require("webpack"));
var path_1 = __importDefault(require("path"));
var babelNodeConfig_1 = __importDefault(require("./babelNodeConfig"));
var externals_1 = __importDefault(require("../externals"));
var NodemonPlugin = require('nodemon-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
function createNodeWebpackConfig(_a) {
    var app = _a.app, projectDir = _a.projectDir, _b = _a.mode, mode = _b === void 0 ? 'development' : _b, alias = _a.alias, _c = _a.env, env = _c === void 0 ? {} : _c;
    var isDevelopment = mode === 'development';
    var isProduction = mode === 'production';
    var externals = externals_1.default();
    return {
        entry: app.paths.src,
        output: { path: app.paths.build },
        node: { __dirname: true },
        target: 'node',
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
                    include: app.paths.src,
                    type: 'javascript/esm',
                    exclude: [/node_modules/],
                    use: {
                        loader: 'babel-loader',
                        options: babelNodeConfig_1.default,
                    },
                },
            ],
        },
        plugins: [
            new CaseSensitivePathsPlugin(),
            new webpack_1.default.EnvironmentPlugin(env),
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path_1.default.join(projectDir, 'tsconfig.json'),
                watch: app.paths.src,
            }),
            new FriendlyErrorsWebpackPlugin(),
            isDevelopment
                ? new NodemonPlugin({
                    ext: 'js,graphql,ts,ps1,yaml,json',
                    nodeArgs: ['--inspect'],
                    watch: app.paths.root,
                })
                : undefined,
            isProduction
                ? new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns: [app.paths.build],
                    dangerouslyAllowCleanPatternsOutsideProject: true,
                    dry: false,
                })
                : undefined,
        ].filter(Boolean),
    };
}
exports.default = createNodeWebpackConfig;
