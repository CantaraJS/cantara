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
var path_1 = __importDefault(require("path"));
var babelReactConfig_1 = __importDefault(require("../babelReactConfig"));
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var cssnano = require('cssnano');
var postcssPresetEnv = require('postcss-preset-env');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
function createCommonReactWebpackConfig(_a) {
    var _b = _a.mode, mode = _b === void 0 ? 'development' : _b, app = _a.app, _c = _a.env, env = _c === void 0 ? {} : _c, _d = _a.include, include = _d === void 0 ? [] : _d;
    var isDevelopment = mode === 'development';
    var isProduction = mode === 'production';
    var cssLoaders = function (modules) { return __spreadArrays((isDevelopment ? ['style-loader'] : [MiniCssExtractPlugin.loader]), [
        {
            loader: 'css-loader',
            options: modules
                ? {
                    modules: isDevelopment
                        ? {
                            localIdentName: '[path][name]__[local]--[hash:base64:5]',
                        }
                        : true,
                    localsConvention: 'camelCase',
                    importLoaders: 1,
                }
                : {},
        },
        {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: function () { return [postcssPresetEnv()]; },
            },
        },
    ]); };
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
        mode: mode,
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
            isProduction ? new MiniCssExtractPlugin() : undefined,
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
                    include: __spreadArrays([app.paths.src], include),
                },
                {
                    test: /\.css$/,
                    include: /\.module\.css$/,
                    use: cssLoaders(true),
                },
                {
                    test: /\.css$/,
                    exclude: /\.module\.css$/,
                    use: cssLoaders(false),
                },
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
                    loader: 'url-loader',
                    options: {
                        limit: 15000,
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
