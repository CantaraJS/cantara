import webpack, { Configuration } from 'webpack';
import { BundlerConfigParams } from './types';
import fs from 'fs';
import path from 'path';
import babelConfig from './babelNodeConfig';
import getAllWebpackExternals from '../externals';
import slash from 'slash';

const NodemonPlugin = require('nodemon-webpack-plugin');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

interface CreateNodeWebpackConfigOptions extends BundlerConfigParams {
  nodemonOptions?: string[];
}

export default function createNodeWebpackConfig({
  app,
  mode = 'development',
  alias,
  env = {},
  include = [],
  nodemonOptions = ['--inspect', '--enable-source-maps'],
  resolveModules,
}: CreateNodeWebpackConfigOptions): Configuration {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  const externals = getAllWebpackExternals(
    alias ? { ignore: Object.keys(alias) } : {},
  );

  const doesStaticFolderExist =
    app.paths.static && fs.existsSync(app.paths.static);

  return {
    entry: app.paths.src,
    output: { path: app.paths.build, clean: isProduction },
    node: { __dirname: false, __filename: false },
    target: 'node',
    devtool: isDevelopment
      ? 'eval-source-map'
      : app.meta.sourceMaps
      ? 'source-map'
      : undefined,
    mode,
    externals,
    resolve: {
      extensions: [
        '.web.js',
        '.mjs',
        '.js',
        '.json',
        '.web.jsx',
        '.ts',
        '.tsx',
        '.d.ts',
      ],
      alias: {
        ...alias,
        '~': app.paths.src,
      },
      modules: resolveModules,
    },
    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: [/\.js$/, /\.tsx?$/],
          include: [app.paths.src, ...include],
          exclude: [/node_modules/],
          use: {
            loader: 'babel-loader',
            options: babelConfig,
          },
        },
        {
          exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
          generator: {
            filename: 'static/media/[name].[contenthash:8].[ext]',
          },
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      isProduction ? new FriendlyErrorsWebpackPlugin() : undefined,
      new CaseSensitivePathsPlugin(),
      new webpack.EnvironmentPlugin(env),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: path.join(app.paths.root, 'tsconfig.json'),
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: 'write-references',
        },
        // watch: app.paths.src,
      }),
      isDevelopment
        ? new NodemonPlugin({
            ext: 'js,graphql,ts,ps1,json,yaml',
            nodeArgs: nodemonOptions,
            watch: [app.paths.build],
            restartable: 'true',
          })
        : undefined,
      doesStaticFolderExist
        ? new CopyPlugin({
            patterns: [
              {
                from: slash(app.paths.static || ''),
                to: app.paths.build,
                globOptions: {
                  dot: true,
                },
              },
            ],
          })
        : undefined,
    ].filter(Boolean),
  };
}
