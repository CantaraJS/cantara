/** Serverless webpack will try to load babel/it's plugins from the local node_modules folder.
 * That's why we need to import all packages with their respective absolute path.
 * The string "<--MODULES_PATH-->" will be replaces with Cantara's node_modules folder path.
 * All loaders need to be prefixed with it.
 */

const path = require('path');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const slsw = require('serverless-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require("webpack")

const babelConfig = require('./serverlessBabelConfig');

function getModuleName(request) {
  var scopedModuleRegex = new RegExp(
    '@[a-zA-Z0-9][\\w-.]+/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9./]+)?',
    'g',
  );
  var req = request;
  var delimiter = '/';

  // check if scoped module
  if (scopedModuleRegex.test(req)) {
    // reset regexp
    scopedModuleRegex.lastIndex = 0;
    return req.split(delimiter, 2).join(delimiter);
  }
  return req.split(delimiter)[0];
}

function shouldExternalize(_, request, callback) {
  const moduleName = getModuleName(request);
    if (<--EXTERNALS_ARRAY-->.includes(moduleName)) {
      // mark this module as external
      // https://webpack.js.org/configuration/externals/
      return callback(null, 'commonjs ' + request);
    }
    callback();
}

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
  externals: shouldExternalize,
  module: {
    rules: [
      {
        test: [/\.js$/, /\.tsx?$/],
        // include: app.paths.src,
        exclude: [/node_modules/],
        include: <--INCLUDES-->,
        use: {
          loader: '<--MODULES_PATH-->babel-loader',
          options: babelConfig,
        },
      },
      {
        test: /\.graphql?$/,
        loader: '<--MODULES_PATH-->webpack-graphql-loader',
        include: <--INCLUDES-->,
      },
      {
        loader: '<--MODULES_PATH-->file-loader',
        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      }
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(<--ENV_VARS-->),
    new CaseSensitivePathsPlugin(),
    <--ENABLE_TYPECHECKING--> ? new ForkTsCheckerWebpackPlugin({
      tsconfig: '<--TSCONFIG_PATH-->',
    }) : undefined,
    new CopyPlugin([`<--APP_STATIC_PATH-->/**`])
  ].filter(Boolean),
  // Use a custom terser setup which keeps classnames.
  // This way libraries which depend on class names
  // (e.g. typegoose) don't break in production
  // which is a nightmare to debug and find out 
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        // sourceMap: true,
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  }
};
