import { CreateWebpackConfigParams } from './types';

import { Configuration } from 'webpack';
import getBabelConfig from './babelReactConfig';
import { readFileAsJSON } from '../fs';

const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');

function camalize(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

interface GetLibraryExternalsOptions {
  packageJsonPath: string;
  peerOnly?: boolean;
}

export function getLibraryExternals({
  packageJsonPath,
  peerOnly,
}: GetLibraryExternalsOptions) {
  const { dependencies = {}, peerDependencies = {} } = readFileAsJSON(
    packageJsonPath,
  );
  if (peerOnly) return Object.keys(peerDependencies);
  return [...Object.keys(dependencies), ...Object.keys(peerDependencies)];
}

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
}: CreateWebpackConfigParams): Configuration {
  const entryPath =
    app.type === 'react-component'
      ? path.join(app.paths.src, 'index.tsx')
      : path.join(app.paths.src, 'index.ts');

  // For UMD builds (CDN ready) only exclude peer deps
  const externals = getLibraryExternals({
    packageJsonPath: path.join(app.paths.root, 'package.json'),
    peerOnly: libraryTarget === 'umd',
  });

  return {
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
      path: app.paths.build,
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
            tsconfig: path.join(projectDir, 'tsconfig.json'),
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
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
          use: {
            loader: 'babel-loader',
            options: getBabelConfig('production'),
          },
          include: [app.paths.src, ...include],
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
      hints: false,
    },
    optimization: {
      // Only minify for UMD
      minimize: libraryTarget === 'umd',
    },
    // node: {
    //   fs: 'empty',
    //   dns: 'empty',
    //   net: 'empty',
    //   tls: 'empty',
    //   module: 'empty',
    // },
  };
}
