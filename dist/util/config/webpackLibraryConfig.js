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
var path_1 = __importDefault(require("path"));
var babelReactConfig_1 = __importDefault(require("./babelReactConfig"));
var externals_1 = __importDefault(require("../externals"));
var string_manipulation_1 = require("../string-manipulation");
var webpackCommonReactConfig_1 = __importDefault(require("./common/webpackCommonReactConfig"));
var cssLoaders_1 = __importDefault(require("./common/cssLoaders"));
var WebpackNotifierPlugin = require('webpack-notifier');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
var webpackMerge = require('webpack-merge');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/**
 * Build React, isomorphic, node or browser libraries
 */
function createLibraryWebpackConfig(_a) {
    var app = _a.app, projectDir = _a.projectDir, _b = _a.include, include = _b === void 0 ? [] : _b, _c = _a.alias, alias = _c === void 0 ? {} : _c, libraryTarget = _a.libraryTarget, noChecks = _a.noChecks, env = _a.env;
    var isReactComponent = app.type === 'react-component';
    var entryPath = isReactComponent
        ? path_1.default.join(app.paths.src, 'index.tsx')
        : path_1.default.join(app.paths.src, 'index.ts');
    // For UMD builds (CDN ready) only exclude peer deps
    var externals = externals_1.default({
        peerOnly: libraryTarget === 'umd',
    });
    var commonLibraryConfig = {
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
            path: libraryTarget === 'commonjs2'
                ? path_1.default.join(app.paths.build, app.name, 'src')
                : app.paths.build,
            library: string_manipulation_1.camalize(app.name),
            /** For bundlers and NodeJS, CommonJS is used.
             * As soon webpack supports ESM as a libraryTarget,
             * ESMs are favoured
             */
            libraryTarget: libraryTarget,
        },
        plugins: [
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
            libraryTarget === 'commonjs2'
                ? new BundleAnalyzerPlugin({ analyzerMode: 'static' })
                : undefined,
        ].filter(Boolean),
        module: {
            rules: __spreadArrays(cssLoaders_1.default({ useExtractLoader: false })),
        },
        performance: {
            hints: false,
        },
        optimization: {
            // Only minify for UMD
            minimize: libraryTarget === 'umd',
        },
    };
    // Webpack config for non-React JS packages
    var jsPackageConfig = {
        module: {
            rules: [
                {
                    test: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
                    // type: 'javascript/esm',
                    use: {
                        loader: 'babel-loader',
                        options: babelReactConfig_1.default('production'),
                    },
                    include: __spreadArrays([app.paths.src], include),
                    exclude: [/node_modules/],
                },
            ],
        },
    };
    var configToMerge = jsPackageConfig;
    if (isReactComponent) {
        configToMerge = webpackCommonReactConfig_1.default({
            mode: 'production',
            app: app,
            env: env,
            include: include,
            projectDir: projectDir,
            alwaysInlineImages: true,
        });
    }
    return webpackMerge(commonLibraryConfig, configToMerge);
}
exports.default = createLibraryWebpackConfig;
