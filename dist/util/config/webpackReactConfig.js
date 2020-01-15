"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var fs_1 = require("fs");
var babelReactConfig_1 = __importDefault(require("./babelReactConfig"));
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackPwaManifest = require('webpack-pwa-manifest');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InjectManifest = require('workbox-webpack-plugin').InjectManifest;
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var cssnano = require('cssnano');
var postcssPresetEnv = require('postcss-preset-env');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var path = require('path');
function createReactWebpackConfig(_a) {
    var app = _a.app, projectDir = _a.projectDir, _b = _a.alias, alias = _b === void 0 ? {} : _b, _c = _a.include, include = _c === void 0 ? [] : _c, _d = _a.mode, mode = _d === void 0 ? 'development' : _d, _e = _a.env, env = _e === void 0 ? {} : _e;
    var isDevelopment = mode === 'development';
    var isProduction = mode === 'production';
    var iconPathToUse = undefined;
    var appIconPathPng = path.join(app.paths.assets, 'app_icon.png');
    var appIconPathSvg = path.join(app.paths.assets, 'app_icon.svg');
    var doesServiceWorkerExist = fs_1.existsSync(path.join(app.paths.root, 'sw.js'));
    if (fs_1.existsSync(appIconPathPng)) {
        iconPathToUse = appIconPathPng;
    }
    else if (fs_1.existsSync(appIconPathSvg)) {
        iconPathToUse = appIconPathSvg;
    }
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
        entry: path.join(app.paths.src, 'index.tsx'),
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
        mode: mode,
        devtool: isDevelopment ? 'eval-source-map' : undefined,
        output: {
            // publicPath: '/',
            filename: '[name].[hash:4].js',
            path: app.paths.build,
            chunkFilename: '[name].[chunkhash:4].js',
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path.join(projectDir, 'tsconfig.json'),
                watch: app.paths.src,
            }),
            new CaseSensitivePathsPlugin(),
            isDevelopment ? new webpack_1.default.HotModuleReplacementPlugin() : undefined,
            new WebpackNotifierPlugin({
                excludeWarnings: true,
                title: app.meta.displayName,
            }),
            new FriendlyErrorsWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: app.meta.displayName,
                template: path.join(app.paths.assets, 'index.html'),
                favicon: '',
            }),
            iconPathToUse
                ? new FaviconsWebpackPlugin({
                    logo: iconPathToUse,
                    inject: true,
                })
                : undefined,
            // disableRefreshCheck: true needs to be set because of https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/15
            isDevelopment
                ? new ReactRefreshWebpackPlugin({
                    disableRefreshCheck: true,
                })
                : undefined,
            iconPathToUse
                ? new WebpackPwaManifest(__assign({ 
                    // gcm_sender_id,
                    theme_color: app.meta.themeColor, background_color: app.meta.themeColor, name: app.meta.displayName, short_name: app.meta.displayName, ios: true, icons: [
                        {
                            src: iconPathToUse,
                            sizes: [192, 512],
                        },
                    ] }, app.meta.pwaManifest))
                : undefined,
            new webpack_1.default.EnvironmentPlugin(env),
            doesServiceWorkerExist && isProduction
                ? new InjectManifest({
                    swSrc: path.join(app.paths.src, 'sw.js'),
                })
                : undefined,
            isProduction
                ? new CleanWebpackPlugin({
                    cleanOnceBeforeBuildPatterns: [app.paths.build],
                    dangerouslyAllowCleanPatternsOutsideProject: true,
                    dry: false,
                })
                : undefined,
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
                    include: __spreadArrays([app.paths.src], include),
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
            ],
        },
        performance: {
            hints: false,
        },
        optimization: isProduction
            ? {
                splitChunks: {
                    chunks: 'initial',
                },
                runtimeChunk: {
                    name: 'manifest',
                },
            }
            : undefined,
        node: {
            fs: 'empty',
            dns: 'empty',
            net: 'empty',
            tls: 'empty',
            module: 'empty',
        },
    };
}
exports.default = createReactWebpackConfig;
