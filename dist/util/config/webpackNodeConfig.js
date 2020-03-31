"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const babelNodeConfig_1 = __importDefault(require("./babelNodeConfig"));
const externals_1 = __importDefault(require("../externals"));
const slash_1 = __importDefault(require("slash"));
const NodemonPlugin = require('nodemon-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
function createNodeWebpackConfig({ app, mode = 'development', alias, env = {}, include = [], nodemonOptions = '--inspect', }) {
    const isDevelopment = mode === 'development';
    const isProduction = mode === 'production';
    const externals = externals_1.default();
    const doesStaticFolderExist = app.paths.static && fs_1.default.existsSync(app.paths.static);
    return {
        entry: app.paths.src,
        output: { path: app.paths.build },
        node: { __dirname: false, __filename: false },
        target: 'node',
        devtool: mode === 'development' ? 'eval-source-map' : undefined,
        mode,
        externals,
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
            alias,
        },
        module: {
            rules: [
                {
                    test: [/\.js$/, /\.tsx?$/],
                    include: [app.paths.src, ...include],
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
