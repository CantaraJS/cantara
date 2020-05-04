import webpack, { Configuration } from 'webpack';
import { CreateWebpackConfigParams } from './types';
import fs from 'fs';
import path from 'path';
import babelConfig from './babelNodeConfig';
import getAllWebpackExternals from '../externals';
import slash from 'slash';

const NodemonPlugin = require('nodemon-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

interface CreateNodeWebpackConfigOptions extends CreateWebpackConfigParams {
  nodemonOptions?: string;
}

export default function createNodeWebpackConfig({
  app,
  mode = 'development',
  alias,
  env = {},
  include = [],
  nodemonOptions = '--inspect',
}: CreateNodeWebpackConfigOptions): Configuration {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  const externals = getAllWebpackExternals();

  const doesStaticFolderExist =
    app.paths.static && fs.existsSync(app.paths.static);

  return {
    entry: app.paths.src,
    output: { path: app.paths.build },
    node: { __dirname: false, __filename: false },
    target: 'node',
    devtool: mode === 'development' ? 'eval-source-map' : undefined,
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
      alias,
    },
    module: {
      rules: [
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
          loader: 'file-loader',
          exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      new webpack.EnvironmentPlugin(env),
      new FriendlyErrorsWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.join(app.paths.root, '.tsconfig.local.json'),
        watch: app.paths.src,
      }),
      isDevelopment
        ? new NodemonPlugin({
            ext: 'js,graphql,ts,ps1,json,yaml',
            nodeArgs: [nodemonOptions],
            watch: app.paths.build,
            restartable: true,
          })
        : undefined,
      isProduction
        ? new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [app.paths.build],
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false,
          })
        : undefined,
      doesStaticFolderExist
        ? new CopyPlugin([
            {
              from: slash(app.paths.static || ''),
              to: slash(app.paths.build),
            },
          ])
        : undefined,
    ].filter(Boolean),
  };
}
