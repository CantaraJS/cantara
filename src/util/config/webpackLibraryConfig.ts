import { Configuration } from 'webpack';
import path from 'path';

import getBabelConfig from './babelReactConfig';
import getAllWebpackExternals from '../externals';
import { camalize } from '../string-manipulation';
import createCommonReactWebpackConfig from './common/webpackCommonReactConfig';
import { CreateWebpackConfigParams } from './types';
import getCssLoaders from './common/cssLoaders';

const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackMerge = require('webpack-merge');
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
}: CreateWebpackConfigParams): Configuration {
  const isReactComponent = app.type === 'react-component';

  const entryPath = isReactComponent
    ? path.join(app.paths.src, 'index.tsx')
    : path.join(app.paths.src, 'index.ts');

  // For UMD builds (CDN ready) only exclude peer deps
  const externals = getAllWebpackExternals({
    peerOnly: libraryTarget === 'umd',
  });

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
      ],
      alias,
    },
    externals,
    mode: 'production',
    output: {
      // publicPath: '/',
      filename:
        libraryTarget === 'commonjs2' ? 'index.js' : `${app.name}.umd.min.js`,
      path:
        libraryTarget === 'commonjs2'
          ? path.join(app.paths.build, app.name, 'src')
          : app.paths.build,
      library: camalize(app.name),
      /** For bundlers and NodeJS, CommonJS is used.
       * As soon webpack supports ESM as a libraryTarget,
       * ESMs are favoured
       */
      libraryTarget,
    },
    plugins: [
      noChecks
        ? undefined
        : new ForkTsCheckerWebpackPlugin({
            tsconfig: path.join(app.paths.root, '.tsconfig.local.json'),
            watch: app.paths.src,
          }),
      noChecks
        ? new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [app.paths.build],
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false,
          })
        : undefined,
      noChecks ? undefined : new WebpackNotifierPlugin(),
      new CaseSensitivePathsPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      libraryTarget === 'commonjs2'
        ? new BundleAnalyzerPlugin({ analyzerMode: 'static' })
        : undefined,
    ].filter(Boolean),
    module: {
      rules: [...getCssLoaders({ useExtractLoader: false })],
    },
    performance: {
      hints: false,
    },
    optimization: {
      // Only minify for UMD
      minimize: libraryTarget === 'umd',
    },
  };

  // Webpack config for non-React JS packages
  const jsPackageConfig: Configuration = {
    module: {
      rules: [
        {
          test: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
          type: 'javascript/esm',
          use: {
            loader: 'babel-loader',
            options: getBabelConfig('production'),
          },
          include: [app.paths.src, ...include],
          exclude: [/node_modules/],
        },
      ],
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
    });
  }

  return webpackMerge(commonLibraryConfig, configToMerge);
}
