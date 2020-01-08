import { Configuration } from 'webpack';
import { CreateWebpackConfigParams } from './types';
import path from 'path';
import babelConfig from './babel.node.config';

const NodemonPlugin = require('nodemon-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export default function createNodeWebpackDevConfig({
  app,
  projectDir,
}: CreateWebpackConfigParams): Configuration {
  return {
    entry: app.paths.src,
    output: { path: app.paths.build },
    node: { __dirname: true },
    target: 'node',
    mode: 'development',
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
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          type: 'javascript/auto',
        },
        {
          test: [/\.js$/, /\.tsx?$/],
          include: app.paths.src,
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
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.join(projectDir, 'tsconfig.json'),
      }),
      new NodemonPlugin({
        ext: 'js,graphql,ts,ps1,yaml,json',
        nodeArgs: ['--inspect'],
        watch: app.paths.root,
      }),
    ],
  };
}
