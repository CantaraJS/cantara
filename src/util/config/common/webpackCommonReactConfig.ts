import webpack, { Configuration } from 'webpack';
import path from 'path';

import { CreateWebpackConfigParams } from '../types';
import getBabelConfig from '../babelReactConfig';

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

interface CreateCommonReactWebpackConfigParams
  extends CreateWebpackConfigParams {
  /** Set to true for NPM packages */
  alwaysInlineImages?: boolean;
}

export default function createCommonReactWebpackConfig({
  mode = 'development',
  app,
  env = {},
  include = [],
  alwaysInlineImages,
}: CreateCommonReactWebpackConfigParams): Configuration {
  const isProduction = mode === 'production';

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
    },
    mode,
    plugins: [
      new CaseSensitivePathsPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new webpack.EnvironmentPlugin(env),
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
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
          loader: 'url-loader',
          options: {
            limit: alwaysInlineImages ? Number.MAX_VALUE : 15000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        // {
        //   loader: 'file-loader',
        //   exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
        //   options: {
        //     name: 'static/media/[name].[hash:8].[ext]',
        //   },
        // },
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
