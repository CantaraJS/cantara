"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const path_1 = __importDefault(require("path"));
const babelReactConfig_1 = __importDefault(require("../babelReactConfig"));
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
function createCommonReactWebpackConfig({ mode = 'development', app, env = {}, include = [], alwaysInlineImages, }) {
    const isProduction = mode === 'production';
    return {
        entry: path_1.default.join(app.paths.src, 'index.tsx'),
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
        },
        mode,
        plugins: [
            new CaseSensitivePathsPlugin(),
            new FriendlyErrorsWebpackPlugin(),
            new webpack_1.default.EnvironmentPlugin(env),
            isProduction
                ? new OptimizeCSSAssetsPlugin({
                    cssProcessor: cssnano,
                    cssProcessorOptions: {
                        discardComments: {
                            removeAll: true,
                        },
                        // Run cssnano in safe mode to avoid
                        // potentially unsafe transformations.
                        safe: true,
                    },
                    canPrint: false,
                })
                : undefined,
            isProduction
                ? new webpack_1.default.BannerPlugin({
                    banner: 'filename:[name]',
                })
                : false,
        ].filter(Boolean),
        module: {
            rules: [
                {
                    test: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
                    /** For some reason, using 'javascript/esm' causes ReactRefresh to fail */
                    // type: 'javascript/esm',
                    use: {
                        loader: 'babel-loader',
                        options: babelReactConfig_1.default(mode),
                    },
                    include: [app.paths.src, ...include],
                },
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                    loader: 'url-loader',
                    options: {
                        limit: alwaysInlineImages ? Number.MAX_VALUE : 15000,
                        name: 'static/media/[name].[hash:8].[ext]',
                    },
                },
            ],
        },
        node: {
            fs: 'empty',
            dns: 'empty',
            net: 'empty',
            tls: 'empty',
            module: 'empty',
        },
    };
}
exports.default = createCommonReactWebpackConfig;
