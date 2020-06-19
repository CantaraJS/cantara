import { Configuration } from 'webpack';
import path from 'path';

import getBabelConfig from './babelReactConfig';
import getAllWebpackExternals from '../externals';
import { camalize } from '../string-manipulation';
import createCommonReactWebpackConfig from './common/webpackCommonReactConfig';
import { CreateWebpackConfigParams } from './types';
import getCssLoaders from './common/cssLoaders';
import getSourceMapLoader from './common/soureMapLoader';

const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
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
  let externals : any = getAllWebpackExternals();

  // TODO: Make this mapping extendable vai the cantara config
  if(libraryTarget === 'umd') {
    externals = {
      'react': 'React',
      'react-dom': 'ReactDOM'
    }
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
        '.ttf'
      ],
      alias,
    },
    externals,
    mode: 'production',
    devtool:  app.meta.sourceMaps ? 'source-map' : undefined,
    output: {
      // publicPath: '/',
      filename:
        libraryTarget === 'commonjs2'
          ? 'index.js'
          : `${path.basename(app.name)}.umd.min.js`,
      path:
        libraryTarget === 'commonjs2'
          ? path.join(app.paths.build, path.basename(app.name), 'src')
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
          // type: 'javascript/esm',
          use: {
            loader: 'babel-loader',
            options: getBabelConfig('production'),
          },
          include: [app.paths.src, ...include],
          exclude: [/node_modules/],
        },
        ...getSourceMapLoader({sourceMaps: app.meta.sourceMaps}),
        {
          exclude: [/\.(js|jsx|ts|tsx)$/, /\.html$/, /\.json$/, /\.css$/],
          loader: 'url-loader',
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
