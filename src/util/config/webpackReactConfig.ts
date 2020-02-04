import webpack, { Configuration } from 'webpack';
import { existsSync } from 'fs';
import path from 'path';

import { CreateWebpackConfigParams } from './types';
import createCommonReactWebpackConfig from './common/webpackCommonReactConfig';
import getCssLoaders from './common/cssLoaders';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackMerge = require('webpack-merge');

export default function createReactWebpackConfig({
  app,
  alias = {},
  mode = 'development',
  env,
  include,
  projectDir,
}: CreateWebpackConfigParams): Configuration {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';
  let iconPathToUse = undefined;
  const appIconPathPng = path.join(app.paths.assets!, 'app_icon.png');
  const appIconPathSvg = path.join(app.paths.assets!, 'app_icon.svg');
  const doesServiceWorkerExist = existsSync(path.join(app.paths.root, 'sw.js'));

  if (existsSync(appIconPathPng)) {
    iconPathToUse = appIconPathPng;
  } else if (existsSync(appIconPathSvg)) {
    iconPathToUse = appIconPathSvg;
  }

  const reactDependencyAliases: { [key: string]: string } =
    app.type === 'react'
      ? {
          react: path.join(app.paths.root, 'node_modules', 'react'),
          'react-dom': path.join(app.paths.root, 'node_modules', 'react-dom'),
        }
      : {};

  const webpackReactAppConfig: Configuration = {
    resolve: {
      alias: {
        ...alias,
        ...reactDependencyAliases,
      },
    },
    mode,
    devtool: isDevelopment ? 'eval-source-map' : undefined,
    output: {
      // publicPath: '/',
      filename: '[name].[hash:4].js',
      path: app.paths.build,
      chunkFilename: '[name].[chunkhash:4].js',
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.join(app.paths.root, '.tsconfig.local.json'),
        watch: app.paths.src,
      }),
      isDevelopment ? new webpack.HotModuleReplacementPlugin() : undefined,
      new WebpackNotifierPlugin({
        excludeWarnings: true,
        title: app.meta.displayName,
      }),
      new HtmlWebpackPlugin({
        title: app.meta.displayName,
        template: path.join(app.paths.assets!, 'index.html'),
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
        ? new WebpackPwaManifest({
            // gcm_sender_id,
            theme_color: app.meta.themeColor,
            background_color: app.meta.themeColor,
            name: app.meta.displayName,
            short_name: app.meta.displayName,
            ios: true,
            icons: [
              {
                src: iconPathToUse,
                sizes: [192, 512],
              },
            ],
            ...app.meta.pwaManifest,
          })
        : undefined,
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
    ].filter(Boolean),
    module: {
      rules: [...getCssLoaders({ useExtractLoader: isProduction })],
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
  const mergedConfig = webpackMerge(commonConfig, webpackReactAppConfig);
  return mergedConfig;
}
