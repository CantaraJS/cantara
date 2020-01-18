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
var babelReactConfig_1 = __importDefault(require("./babelReactConfig"));
var externals_1 = __importDefault(require("../externals"));
var WebpackNotifierPlugin = require('webpack-notifier');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
var path = require('path');
function camalize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, function (_, chr) { return chr.toUpperCase(); });
}
/**
 * Build React, isomorphic, node or browser libraries
 */
function createLibraryWebpackConfig(_a) {
    var app = _a.app, projectDir = _a.projectDir, _b = _a.include, include = _b === void 0 ? [] : _b, _c = _a.alias, alias = _c === void 0 ? {} : _c, libraryTarget = _a.libraryTarget, noChecks = _a.noChecks;
    var entryPath = app.type === 'react-component'
        ? path.join(app.paths.src, 'index.tsx')
        : path.join(app.paths.src, 'index.ts');
    // For UMD builds (CDN ready) only exclude peer deps
    var externals = externals_1.default({
        peerOnly: libraryTarget === 'umd',
    });
    return {
        entry: entryPath,
        resolve: {
            extensions: [
                '.web.js',
                '.mjs',
                '.js',
                '.json',
                '.web.jsx',
                '.jsx',
                '.ts',
                '.tsx',
            ],
            alias: alias,
        },
        externals: externals,
        mode: 'production',
        output: {
            // publicPath: '/',
            filename: libraryTarget === 'commonjs2' ? 'index.js' : app.name + ".umd.min.js",
            path: app.paths.build,
            library: camalize(app.name),
            /** For bundlers and NodeJS, CommonJS is used.
             * As soon webpack supports ESM as a libraryTarget,
             * ESMs are favoured
             */
            libraryTarget: libraryTarget,
        },
        plugins: [
            noChecks
                ? undefined
                : new ForkTsCheckerWebpackPlugin({
                    tsconfig: path.join(projectDir, 'tsconfig.json'),
                    watch: app.paths.src,
                }),
            noChecks
                ? new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns: [app.paths.build],
                    dangerouslyAllowCleanPatternsOutsideProject: true,
                    dry: false,
                })
                : undefined,
            noChecks ? undefined : new WebpackNotifierPlugin(),
            new CaseSensitivePathsPlugin(),
            new FriendlyErrorsWebpackPlugin(),
        ].filter(Boolean),
        module: {
            rules: [
                {
                    test: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
                    type: 'javascript/esm',
                    use: {
                        loader: 'babel-loader',
                        options: babelReactConfig_1.default('production'),
                    },
                    include: __spreadArrays([app.paths.src], include),
                    exclude: [/node_modules/],
                },
                {
                    test: /\.(jpg|png|svg|gif)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 15000,
                        },
                    },
                },
                {
                    test: /\.(ttf|eot|woff|woff2)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[hash:4].[ext]',
                        },
                    },
                },
            ],
        },
        performance: {
            hints: false,
        },
        optimization: {
            // Only minify for UMD
            minimize: libraryTarget === 'umd',
        },
    };
}
exports.default = createLibraryWebpackConfig;
