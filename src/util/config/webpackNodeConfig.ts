import webpack, { Configuration } from 'webpack';
import { CreateWebpackConfigParams } from './types';
import path from 'path';
import babelConfig from './babelNodeConfig';

const NodemonPlugin = require('nodemon-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

export default function createNodeWebpackConfig({
  app,
  projectDir,
  mode = 'development',
  alias,
  env = {},
}: CreateWebpackConfigParams): Configuration {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';
  return {
    entry: app.paths.src,
    output: { path: app.paths.build },
    node: { __dirname: true },
    target: 'node',
    mode,
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
          include: app.paths.src,
          type: 'javascript/esm',
          exclude: [/node_modules/],
          use: {
            loader: 'babel-loader',
            options: babelConfig,
          },
        },
      ],
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      new webpack.EnvironmentPlugin(env),
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.join(projectDir, 'tsconfig.json'),
        watch: app.paths.src,
      }),
      new FriendlyErrorsWebpackPlugin(),
      isDevelopment
        ? new NodemonPlugin({
            ext: 'js,graphql,ts,ps1,yaml,json',
            nodeArgs: ['--inspect'],
            watch: app.paths.root,
          })
        : undefined,
      isProduction
        ? new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [app.paths.build],
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false,
          })
        : undefined,
    ].filter(Boolean),
  };
}
