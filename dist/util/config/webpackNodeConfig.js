"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var babelNodeConfig_1 = __importDefault(require("./babelNodeConfig"));
var NodemonPlugin = require('nodemon-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
function createNodeWebpackConfig(_a) {
    var app = _a.app, projectDir = _a.projectDir;
    return {
        entry: app.paths.src,
        output: { path: app.paths.build },
        node: { __dirname: true },
        target: 'node',
        mode: 'development',
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
        },
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    type: 'javascript/auto',
                },
                {
                    test: [/\.js$/, /\.tsx?$/],
                    include: app.paths.src,
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
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path_1.default.join(projectDir, 'tsconfig.json'),
            }),
            new NodemonPlugin({
                ext: 'js,graphql,ts,ps1,yaml,json',
                nodeArgs: ['--inspect'],
                watch: app.paths.root,
            }),
        ],
    };
}
exports.default = createNodeWebpackConfig;
