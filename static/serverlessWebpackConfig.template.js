/** Serverless webpack will try to load babel/it's plugins from the local node_modules folder.
 * That's why we need to import all packages with their respective absolute path.
 * The string "<--MODULES_PATH-->" will be replaces with Cantara's node_modules folder path.
 * All loaders need to be prefixed with it.
 */

const path = require('path');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const webpack = require("webpack")

const babelConfig = require('./serverlessBabelConfig');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
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
    alias: <--ALIASES-->,
  },
  externals: [
    nodeExternals({
      modulesDir: path.resolve('node_modules'),
    }),
  ],
  module: {
    rules: [
      {
        test: [/\.js$/, /\.tsx?$/],
        // include: app.paths.src,
        exclude: [/node_modules/],
        include: '<--ROOT_PATH-->',
        use: {
          loader: '<--MODULES_PATH-->babel-loader',
          options: babelConfig,
        },
      },
      {
        test: /\.graphql?$/,
        loader: '<--MODULES_PATH-->webpack-graphql-loader',
        include: '<--ROOT_PATH-->',
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(<--ENV_VARS-->),
    new CaseSensitivePathsPlugin(),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: '<--TSCONFIG_PATH-->',
    }),
  ],
};
