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
var path_1 = __importDefault(require("path"));
var webpackCommonReactConfig_1 = __importDefault(require("./common/webpackCommonReactConfig"));
var cssLoaders_1 = __importDefault(require("./common/cssLoaders"));
var slash_1 = __importDefault(require("slash"));
var CopyPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackPwaManifest = require('webpack-pwa-manifest');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
var ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
var InjectManifest = require('workbox-webpack-plugin').InjectManifest;
var CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
var webpackMerge = require('webpack-merge');
function createReactWebpackConfig(_a) {
    var app = _a.app, _b = _a.alias, alias = _b === void 0 ? {} : _b, _c = _a.mode, mode = _c === void 0 ? 'development' : _c, _d = _a.env, env = _d === void 0 ? {} : _d, include = _a.include, projectDir = _a.projectDir;
    var isDevelopment = mode === 'development';
    var isProduction = mode === 'production';
    var iconPathToUse = undefined;
    var appIconPathPng = path_1.default.join(app.paths.assets, 'app_icon.png');
    var appIconPathSvg = path_1.default.join(app.paths.assets, 'app_icon.svg');
    var serviceWorkerPath = path_1.default.join(app.paths.src, 'sw.js');
    var doesServiceWorkerExist = fs_1.existsSync(serviceWorkerPath);
    if (fs_1.existsSync(appIconPathPng)) {
        iconPathToUse = appIconPathPng;
    }
    else if (fs_1.existsSync(appIconPathSvg)) {
        iconPathToUse = appIconPathSvg;
    }
    var reactDependencyAliases = app.type === 'react'
        ? {
            react: path_1.default.join(app.paths.root, 'node_modules', 'react'),
            'react-dom': path_1.default.join(app.paths.root, 'node_modules', 'react-dom'),
        }
        : {};
    var doesStaticFolderExist = app.paths.static && fs_1.existsSync(app.paths.static);
    var webpackReactAppConfig = {
        resolve: {
            alias: __assign(__assign({}, alias), reactDependencyAliases),
        },
        mode: mode,
        devtool: isDevelopment ? 'eval-source-map' : undefined,
        output: {
            publicPath: '/',
            filename: '[name].[hash:4].js',
            path: app.paths.build,
            chunkFilename: '[name].[chunkhash:4].js',
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path_1.default.join(app.paths.root, '.tsconfig.local.json'),
                watch: app.paths.src,
            }),
            isDevelopment ? new webpack_1.default.HotModuleReplacementPlugin() : undefined,
            new WebpackNotifierPlugin({
                excludeWarnings: true,
                title: app.meta.displayName,
            }),
            new HtmlWebpackPlugin({
                title: app.meta.displayName,
                template: path_1.default.join(app.paths.assets, 'index.html'),
                favicon: '',
            }),
            // iconPathToUse
            //   ? new FaviconsWebpackPlugin({
            //       logo: iconPathToUse,
            //       inject: true,
            //     })
            //   : undefined,
            // disableRefreshCheck: true needs to be set because of https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/15
            isDevelopment
                ? new ReactRefreshWebpackPlugin({
                    disableRefreshCheck: true,
                })
                : undefined,
            doesServiceWorkerExist
                ? new WebpackPwaManifest(__assign({ 
                    // gcm_sender_id,
                    theme_color: app.meta.themeColor, background_color: app.meta.themeColor, name: app.meta.displayName, short_name: app.meta.displayName, ios: true, icons: iconPathToUse
                        ? [
                            {
                                src: iconPathToUse,
                                sizes: [192, 512],
                            },
                        ]
                        : [] }, app.meta.pwaManifest))
                : undefined,
            doesServiceWorkerExist
                ? new InjectManifest({
                    swSrc: serviceWorkerPath,
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
        module: {
            rules: __spreadArrays(cssLoaders_1.default({ useExtractLoader: isProduction })),
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
    };
    var commonConfig = webpackCommonReactConfig_1.default({
        mode: mode,
        app: app,
        alias: alias,
        env: env,
        include: include,
        projectDir: projectDir,
    });
    var mergedConfig = webpackMerge(commonConfig, webpackReactAppConfig);
    return mergedConfig;
}
exports.default = createReactWebpackConfig;
