/** Serverless webpack will try to load babel/it's plugins from the local node_modules folder.
 * That's why we need to import all packages with their respective absolute path.
 * The string "C:/Users/maxim/DEV/cantara/node_modules/" will be replaces with Cantara's node_modules folder path.
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
    alias: {"places-auth":"C:/Users/maxim/DEV/cantare-example/packages/places-auth/src","places-auth-react":"C:/Users/maxim/DEV/cantare-example/packages/places-auth-react/src","places-suggestions":"C:/Users/maxim/DEV/cantare-example/packages/places-suggestions/src","@types/node":"C:\\Users\\maxim\\DEV\\cantare-example\\react-apps\\places\\node_modules\\@types\\node","@types/react":"C:\\Users\\maxim\\DEV\\cantare-example\\react-apps\\places\\node_modules\\@types\\react","@types/react-dom":"C:\\Users\\maxim\\DEV\\cantare-example\\react-apps\\places\\node_modules\\@types\\react-dom","react":"C:\\Users\\maxim\\DEV\\cantare-example\\react-apps\\places\\node_modules\\react","react-dom":"C:\\Users\\maxim\\DEV\\cantare-example\\react-apps\\places\\node_modules\\react-dom","typescript":"C:\\Users\\maxim\\DEV\\cantare-example\\react-apps\\places\\node_modules\\typescript"},
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
        include: 'C:\\Users\\maxim\\DEV\\cantare-example\\node-apps\\places-api\\src',
        use: {
          loader: 'C:/Users/maxim/DEV/cantara/node_modules/babel-loader',
          options: babelConfig,
        },
      },
      {
        test: /\.graphql?$/,
        loader: 'C:/Users/maxim/DEV/cantara/node_modules/webpack-graphql-loader',
        include: 'C:\\Users\\maxim\\DEV\\cantare-example\\node-apps\\places-api\\src',
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({"STAGE":"development","SECRET_API_KEY":"1234"}),
    new CaseSensitivePathsPlugin(),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: 'C:/Users/maxim/DEV/cantare-example/tsconfig.json',
    }),
  ],
};
