import { Configuration } from 'webpack';
import path from 'path';

import { getBabelReactConfig } from './babelReactConfig';
import getAllWebpackExternals from '../externals';
import { camalize } from '../string-manipulation';
import createCommonReactWebpackConfig from './common/webpackCommonReactConfig';
import { BundlerConfigParams } from './types';
import getCssLoaders from './common/cssLoaders';
import getSourceMapLoader from './common/soureMapLoader';

const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { merge: webpackMerge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * Build React, isomorphic, node or browser libraries
 */
export default function createLibraryWebpackConfig({
  app,
  projectDir,
  include = [],
  alias = {},
  libraryTarget,
  noChecks,
  env,
}: BundlerConfigParams): Configuration {
  const isReactComponent = app.type === 'react-component';

  const entryPath = isReactComponent
    ? path.join(app.paths.src, 'index.tsx')
    : path.join(app.paths.src, 'index.ts');

  let externals: any = {};

  if (libraryTarget === 'umd') {
    const customExternals = app.meta.externalDependencies
      ? app.meta.externalDependencies.umd
      : {};
    externals = {
      react: 'React',
      'react-dom': 'ReactDOM',
      ...customExternals,
      ...externals,
    };
  } else {
    throw new Error(`${libraryTarget} builds need to be done using Rollup.`);
  }

  const commonLibraryConfig: Configuration = {
    entry: entryPath,
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
        '.ttf',
        '.html',
        '.htm',
      ],
      alias,
    },
    externals,
    mode: 'production',
    devtool: app.meta.sourceMaps ? 'source-map' : undefined,
    output: {
      // publicPath: '/',
      filename: `${path.basename(app.name)}.umd.min.js`,
      path: path.join(app.paths.build, 'umd'),
      library: camalize(app.name),
      /** For bundlers and NodeJS, CommonJS is used.
       * As soon webpack supports ESM as a libraryTarget,
       * ESMs are favoured
       */
      // libraryTarget,
      clean: noChecks,
    },
    plugins: [
      noChecks ? undefined : new WebpackNotifierPlugin(),
      new CaseSensitivePathsPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ].filter(Boolean),
    module: {
      rules: [...getCssLoaders({ useExtractLoader: false })],
    },
    performance: {
      hints: false,
    },
    optimization: {
      minimize: true,
    },
    stats: {
      warningsFilter: [/Failed to parse source map/],
    },
  };

  // Webpack config for non-React JS packages
  const jsPackageConfig: Configuration = {
    module: {
      rules: [
        {
          test: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
          // type: 'javascript/esm',
          use: {
            loader: 'babel-loader',
            options: getBabelReactConfig('production'),
          },
          include: [app.paths.src, ...include],
          exclude: [/node_modules/],
        },
        ...getSourceMapLoader({ sourceMaps: app.meta.sourceMaps }),
        {
          test: /\.html?$/,
          exclude: /node_modules/,
          use: { loader: 'html-loader' },
        },
        {
          exclude: [/\.(js|jsx|ts|tsx)$/, /\.html?$/, /\.json$/, /\.css$/],
          type: 'asset/inline',
        },
      ],
    },
    stats: {
      warningsFilter: [/Failed to parse source map/],
    },
  };

  let configToMerge: Configuration = jsPackageConfig;

  if (isReactComponent) {
    configToMerge = createCommonReactWebpackConfig({
      mode: 'production',
      app,
      env,
      include,
      projectDir,
      alwaysInlineImages: true,
    });
  }

  return webpackMerge(commonLibraryConfig, configToMerge);
}
