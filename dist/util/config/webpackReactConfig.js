"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const webpackCommonReactConfig_1 = __importDefault(require("./common/webpackCommonReactConfig"));
const cssLoaders_1 = __importDefault(require("./common/cssLoaders"));
const slash_1 = __importDefault(require("slash"));
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackMerge = require('webpack-merge');
function createReactWebpackConfig({ app, alias = {}, mode = 'development', env = {}, include, projectDir, }) {
    const isDevelopment = mode === 'development';
    const isProduction = mode === 'production';
    let iconPathToUse = undefined;
    const appIconPathPng = path_1.default.join(app.paths.assets, 'app_icon.png');
    const appIconPathSvg = path_1.default.join(app.paths.assets, 'app_icon.svg');
    const serviceWorkerPath = path_1.default.join(app.paths.src, 'sw.js');
    const doesServiceWorkerExist = fs_1.existsSync(serviceWorkerPath);
    if (fs_1.existsSync(appIconPathPng)) {
        iconPathToUse = appIconPathPng;
    }
    else if (fs_1.existsSync(appIconPathSvg)) {
        iconPathToUse = appIconPathSvg;
    }
    const reactDependencyAliases = app.type === 'react'
        ? {
            react: path_1.default.join(app.paths.root, 'node_modules', 'react'),
            'react-dom': path_1.default.join(app.paths.root, 'node_modules', 'react-dom'),
        }
        : {};
    const doesStaticFolderExist = app.paths.static && fs_1.existsSync(app.paths.static);
    const webpackReactAppConfig = {
        resolve: {
            alias: {
                ...alias,
                ...reactDependencyAliases,
            },
        },
        mode,
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
                ? new WebpackPwaManifest({
                    // gcm_sender_id,
                    theme_color: app.meta.themeColor,
                    background_color: app.meta.themeColor,
                    name: app.meta.displayName,
                    short_name: app.meta.displayName,
                    ios: true,
                    icons: iconPathToUse
                        ? [
                            {
                                src: iconPathToUse,
                                sizes: [192, 512],
                            },
                        ]
                        : [],
                    ...app.meta.pwaManifest,
                })
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
            rules: [...cssLoaders_1.default({ useExtractLoader: isProduction })],
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
    const commonConfig = webpackCommonReactConfig_1.default({
        mode,
        app,
        alias,
        env,
        include,
        projectDir,
    });
    const mergedConfig = webpackMerge(commonConfig, webpackReactAppConfig);
    return mergedConfig;
}
exports.default = createReactWebpackConfig;
