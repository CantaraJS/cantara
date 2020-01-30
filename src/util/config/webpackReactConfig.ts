import webpack, { Configuration } from 'webpack';
import { existsSync } from 'fs';

import { CreateWebpackConfigParams } from './types';
import getBabelConfig from './babelReactConfig';
import getAllWebpackExternals from '../externals';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');

export default function createReactWebpackConfig({
  app,
  projectDir,
  alias = {},
  include = [],
  mode = 'development',
  env = {},
}: CreateWebpackConfigParams): Configuration {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';
  let iconPathToUse = undefined;
  const appIconPathPng = path.join(app.paths.assets, 'app_icon.png');
  const appIconPathSvg = path.join(app.paths.assets, 'app_icon.svg');
  const doesServiceWorkerExist = existsSync(path.join(app.paths.root, 'sw.js'));
  const externals = getAllWebpackExternals();

  if (existsSync(appIconPathPng)) {
    iconPathToUse = appIconPathPng;
  } else if (existsSync(appIconPathSvg)) {
    iconPathToUse = appIconPathSvg;
  }

  const cssLoaders = (modules: boolean) => [
    ...(isDevelopment ? ['style-loader'] : [MiniCssExtractPlugin.loader]),
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
        plugins: () => [postcssPresetEnv()],
      },
    },
  ];

  const reactDependencyAliases: { [key: string]: string } =
    app.type === 'react'
      ? {
          react: path.join(app.paths.root, 'node_modules', 'react'),
          'react-dom': path.join(app.paths.root, 'node_modules', 'react-dom'),
        }
      : {};

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
      alias: {
        ...alias,
        ...reactDependencyAliases,
      },
    },
    mode,
    externals: app.type === 'react' ? [] : externals,
    devtool: isDevelopment ? 'eval-source-map' : undefined,
    output: {
      // publicPath: '/',
      filename: '[name].[hash:4].js',
      path: app.paths.build,
      chunkFilename: '[name].[chunkhash:4].js',
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.join(app.paths.root, 'tsconfig.local.json'),
        watch: app.paths.src,
      }),
      new CaseSensitivePathsPlugin(),
      isDevelopment ? new webpack.HotModuleReplacementPlugin() : undefined,
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
      new webpack.EnvironmentPlugin(env),
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
        ? new webpack.BannerPlugin({
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
            options: getBabelConfig(mode),
          },
          include: [app.paths.src, ...include],
          // exclude: [/node_modules/],
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
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: 'url-loader',
          options: {
            limit: 15000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          loader: 'file-loader',
          exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
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
