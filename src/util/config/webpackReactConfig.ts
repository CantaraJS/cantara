import webpack, { Configuration } from 'webpack';
import { existsSync } from 'fs';
import path from 'path';

import { BundlerConfigParams } from './types';
import createCommonReactWebpackConfig from './common/webpackCommonReactConfig';
import getCssLoaders from './common/cssLoaders';
import slash from 'slash';

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge: webpackMerge } = require('webpack-merge');

export default function createReactWebpackConfig({
  app,
  alias = {},
  mode = 'development',
  env = {},
  include = [],
  projectDir,
  resolveModules,
  pathToTailwindCss,
}: BundlerConfigParams): Configuration {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';
  let iconPathToUse = undefined;
  const appIconPathPng = path.join(app.paths.assets!, 'app_icon.png');
  const appIconPathSvg = path.join(app.paths.assets!, 'app_icon.svg');
  const serviceWorkerPath = path.join(app.paths.src, 'sw.js');
  const doesServiceWorkerExist = existsSync(serviceWorkerPath);
  const enableServiceWorker =
    doesServiceWorkerExist &&
    (isProduction || app.meta.generateServiceWorkerInDev);
  const generateManifest = enableServiceWorker && !app.meta.disableManifest;

  if (existsSync(appIconPathPng)) {
    iconPathToUse = appIconPathPng;
  } else if (existsSync(appIconPathSvg)) {
    iconPathToUse = appIconPathSvg;
  }

  const doesStaticFolderExist =
    app.paths.static && existsSync(app.paths.static);

  const externals = app.meta.externalDependencies
    ? app.meta.externalDependencies.commonjs
    : {};

  const webpackReactAppConfig: Configuration = {
    resolve: {
      alias: {
        ...alias,
        '~': app.paths.src,
      },
      modules: resolveModules,
    },
    externals,
    mode,
    devtool:
      isDevelopment || app.meta.sourceMaps ? 'eval-source-map' : undefined,
    output: {
      filename: '[name].[hash:4].js',
      path: app.paths.build,
      chunkFilename: '[name].[chunkhash:4].js',
      publicPath: '/',
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.join(app.paths.root, 'tsconfig.json'),
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: 'write-references',
        },
        // watch: app.paths.src,
      }),
      isDevelopment ? new webpack.HotModuleReplacementPlugin() : undefined,
      new WebpackNotifierPlugin({
        excludeWarnings: true,
        title: app.meta.displayName,
      }),
      new HtmlWebpackPlugin({
        title: app.meta.displayName,
        template: path.join(app.paths.assets!, 'index.html'),
        favicon: iconPathToUse,
        templateParameters: env,
      }),
      // iconPathToUse
      //   ? new FaviconsWebpackPlugin({
      //       logo: iconPathToUse,
      //       inject: true,
      //     })
      //   : undefined,
      isDevelopment ? new ReactRefreshWebpackPlugin() : undefined,
      generateManifest
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
      enableServiceWorker
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
        ? new CopyPlugin({
            patterns: [
              {
                from: slash(app.paths.static || ''),
                to: slash(app.paths.build),
                globOptions: {
                  dot: true,
                },
              },
            ],
          })
        : undefined,
      isProduction
        ? new MiniCssExtractPlugin({
            filename: '[name].[hash:4].css',
            chunkFilename: '[name].[chunkhash:4].css',
          })
        : undefined,
    ].filter(Boolean),
    module: {
      rules: [
        ...getCssLoaders({
          useExtractLoader: isProduction,
          pathToTailwindCss,
        }),
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
  };

  const commonConfig = createCommonReactWebpackConfig({
    mode,
    app,
    alias,
    env,
    include,
    projectDir,
  });
  const mergedConfig = webpackMerge(
    webpackReactAppConfig,
    commonConfig,
  ) as Configuration;

  return mergedConfig;
}
