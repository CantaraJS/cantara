import { Configuration } from 'webpack';

import babelConfig from './babel.react.config';
import { existsSync } from 'fs';
import { CreateWebpackConfigParams } from './types';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const path = require('path');

export default function createReactWebpackDevConfig({
  app,
  projectDir,
}: CreateWebpackConfigParams): Configuration {
  let iconPathToUse = undefined;
  const appIconPathPng = path.join(app.paths.assets, 'app_icon.png');
  const appIconPathSvg = path.join(app.paths.assets, 'app_icon.svg');
  const doesServiceWorkerExist = existsSync(path.join(app.paths.root, 'sw.js'));

  if (existsSync(appIconPathPng)) {
    iconPathToUse = appIconPathPng;
  } else if (existsSync(appIconPathSvg)) {
    iconPathToUse = appIconPathSvg;
  }

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
      alias: {},
    },
    mode: 'development',
    devtool: 'eval-source-map',
    output: {
      // publicPath: '/',
      filename: '[name].[hash:4].js',
      path: app.paths.build,
      chunkFilename: '[name].[chunkhash:4].js',
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.join(projectDir, 'tsconfig.json'),
      }),
      new CaseSensitivePathsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
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
      new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }),
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
      // new webpack.EnvironmentPlugin({
      //   ...envVars,
      //   STAGE: process.env.STAGE,
      //   IS_INTEGRATION_TEST: process.env.IS_INTEGRATION_TEST || false,
      // }),
      doesServiceWorkerExist
        ? new InjectManifest({
            swSrc: path.join(app.paths.src, 'sw.js'),
          })
        : undefined,
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
          use: {
            loader: 'babel-loader',
            options: babelConfig,
          },
          include: [app.paths.src],
          exclude: [/node_modules/],
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
      ],
    },
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
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
