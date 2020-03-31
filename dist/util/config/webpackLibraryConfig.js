"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const babelReactConfig_1 = __importDefault(require("./babelReactConfig"));
const externals_1 = __importDefault(require("../externals"));
const string_manipulation_1 = require("../string-manipulation");
const webpackCommonReactConfig_1 = __importDefault(require("./common/webpackCommonReactConfig"));
const cssLoaders_1 = __importDefault(require("./common/cssLoaders"));
const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackMerge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
/**
 * Build React, isomorphic, node or browser libraries
 */
function createLibraryWebpackConfig({ app, projectDir, include = [], alias = {}, libraryTarget, noChecks, env, }) {
    const isReactComponent = app.type === 'react-component';
    const entryPath = isReactComponent
        ? path_1.default.join(app.paths.src, 'index.tsx')
        : path_1.default.join(app.paths.src, 'index.ts');
    // For UMD builds (CDN ready) only exclude peer deps
    const externals = externals_1.default({
        peerOnly: libraryTarget === 'umd',
    });
    const commonLibraryConfig = {
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
            alias,
        },
        externals,
        mode: 'production',
        output: {
            // publicPath: '/',
            filename: libraryTarget === 'commonjs2'
                ? 'index.js'
                : `${path_1.default.basename(app.name)}.umd.min.js`,
            path: libraryTarget === 'commonjs2'
                ? path_1.default.join(app.paths.build, path_1.default.basename(app.name), 'src')
                : app.paths.build,
            library: string_manipulation_1.camalize(app.name),
            /** For bundlers and NodeJS, CommonJS is used.
             * As soon webpack supports ESM as a libraryTarget,
             * ESMs are favoured
             */
            libraryTarget,
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
            rules: [...cssLoaders_1.default({ useExtractLoader: false })],
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
    const jsPackageConfig = {
        module: {
            rules: [
                {
                    test: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
                    // type: 'javascript/esm',
                    use: {
                        loader: 'babel-loader',
                        options: babelReactConfig_1.default('production'),
                    },
                    include: [app.paths.src, ...include],
                    exclude: [/node_modules/],
                },
            ],
        },
    };
    let configToMerge = jsPackageConfig;
    if (isReactComponent) {
        configToMerge = webpackCommonReactConfig_1.default({
            mode: 'production',
            app,
            env,
            include,
            projectDir,
            alwaysInlineImages: true,
        });
    }
    return webpackMerge(commonLibraryConfig, configToMerge);
}
exports.default = createLibraryWebpackConfig;
