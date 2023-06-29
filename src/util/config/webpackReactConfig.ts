import webpack, { Configuration } from 'webpack';
import { existsSync } from 'fs';
import path from 'path';

import { BundlerConfigParams } from './types';
import createCommonReactWebpackConfig from './common/webpackCommonReactConfig';
import getCssLoaders from './common/cssLoaders';
import slash from 'slash';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import WebpackNotifierPlugin from 'webpack-notifier';
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge: webpackMerge } = require('webpack-merge');

const { InjectManifest } = require('workbox-webpack-plugin');

class WatchRunPlugin {
  apply(compiler: any) {
    compiler.hooks.watchRun.tap('WatchRun', (comp: any) => {
      const logger = comp.getInfrastructureLogger('WatchRun');
      if (comp.modifiedFiles) {
        const changedFiles = Array.from(
          comp.modifiedFiles,
          (file) => `\n  ${file}`,
        ).join('');
        console.log('===============================');
        console.log('FILES CHANGED:', changedFiles);
        console.log('===============================');
      }
    });
  }
}

export default function createReactWebpackConfig({
  app,
  alias = {},
  mode = 'development',
  env = {},
  include = [],
  projectDir,
  resolveModules,
  pathToTailwindCss,
  enableBundleAnalyzer,
  publicPath = '/',
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
      filename: '[name].[contenthash:8].js',
      path: app.paths.build,
      chunkFilename: '[name].[chunkhash:8].js',
      publicPath,
      clean: isProduction,
    },
    plugins: [
      //    new WatchRunPlugin(),     // for debugging
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
            maximumFileSizeToCacheInBytes: isProduction
              ? undefined
              : Number.MAX_VALUE,
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
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[name].[chunkhash:8].css',
          })
        : undefined,
      isProduction && enableBundleAnalyzer
        ? new BundleAnalyzerPlugin({ analyzerMode: 'static' })
        : undefined,
    ].filter(Boolean),
    watchOptions: {
      ignored: /node_modules/,
    },
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
            chunks: 'all',
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
    enableBundleAnalyzer,
  });
  const mergedConfig = webpackMerge(
    webpackReactAppConfig,
    commonConfig,
  ) as Configuration;

  return mergedConfig;
}
