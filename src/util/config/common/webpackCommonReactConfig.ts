import webpack, { Configuration } from 'webpack';
import path from 'path';

import { CreateWebpackConfigParams } from '../types';
import { getBabelReactConfig } from '../babelReactConfig';
import getSourceMapLoader from './soureMapLoader';

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
        '.html',
        '.htm',
      ],
      fallback: {
        fs: false,
        dns: false,
        net: false,
        tls: false,
        module: false,
      },
    },
    mode,
    plugins: [
      new CaseSensitivePathsPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new webpack.EnvironmentPlugin({
        ...env,
        WEBPACK_BUILD_TIMESTAMP: Date.now(),
      }),
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
            options: getBabelReactConfig(mode),
          },
          include: [app.paths.src, ...include],
          // exclude: [/node_modules/],
        },
        ...getSourceMapLoader({
          sourceMaps: app.meta.sourceMaps || !isProduction,
        }),
        {
          test: /\.html?$/,
          exclude: [/node_modules/, app.paths.assets || ''],
          use: { loader: 'html-loader' },
        },
        alwaysInlineImages
          ? {
              test: /\.(?:ico|gif|png|jpg|jpeg|svg|woff(2)?|eot|ttf|otf)$/i,
              type: 'asset/inline',
            }
          : {
              test: /\.(?:ico|gif|png|jpg|jpeg|svg|woff(2)?|eot|ttf|otf)$/i,
              type: 'asset',
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
    stats: {
      warningsFilter: [/Failed to parse source map/],
    },
  };
}
