import webpack, { Configuration } from 'webpack';
import path from 'path';

import { BundlerConfigParams } from '../types';
import { getBabelReactConfig } from '../babelReactConfig';
import getSourceMapLoader from './soureMapLoader';
import TerserPlugin from 'terser-webpack-plugin';

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

interface CreateCommonReactWebpackConfigParams extends BundlerConfigParams {
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

  let i18n = app.meta.i18n;
  if (i18n) {
    i18n = {
      ...i18n,
      outputPath: path.join(app.paths.src, i18n.outputPath || 'locales'),
    };
  }

  const babelConfig = getBabelReactConfig(mode, {
    i18n,
    projectDir: app.paths.root,
  });

  return {
    entry: path.join(app.paths.src, 'index.tsx'),
    resolve: {
      fallback: {
        fs: false,
        dns: false,
        net: false,
        tls: false,
        module: false,
      },
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
    },
    mode,
    plugins: [
      new NodePolyfillPlugin(),
      new CaseSensitivePathsPlugin(),
      new webpack.EnvironmentPlugin({
        ...env,
        WEBPACK_BUILD_TIMESTAMP: Date.now(),
      }),

      isProduction
        ? new webpack.BannerPlugin({
            banner: 'filename:[name]',
          })
        : false,
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
          /** For some reason, using 'javascript/esm' causes ReactRefresh to fail */
          // type: 'javascript/esm',
          use: {
            loader: 'babel-loader',
            options: babelConfig,
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
        {
          exclude: [
            /\.(js|jsx|ts|tsx|mjs)$/,
            /\.html?$/,
            /\.json$/,
            /\.css$/,
            app.paths.assets || '',
          ],
          parser: {
            dataUrlCondition: {
              maxSize: alwaysInlineImages ? Number.MAX_VALUE : 15000,
            },
          },
          generator: {
            filename: 'static/media/[name].[contenthash:8].[ext]',
          },
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
    optimization: isProduction
      ? {
          minimizer: [
            new CssMinimizerPlugin({
              minimizerOptions: {
                discardComments: {
                  removeAll: true,
                },
                // Run cssnano in safe mode to avoid
                // potentially unsafe transformations.
                safe: true,
              },
            }),
            new TerserPlugin({
              terserOptions: {
                //tersers sometimes minifies functionnames of size 1 (alredy minified) to size 0
                // keep_fnames: /./,
              },
            }),
          ],
        }
      : undefined,
    stats: {
      warningsFilter: [/Failed to parse source map/],
    },
  };
}
