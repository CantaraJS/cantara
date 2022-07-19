import getCssLoaders from '../../../../util/config/common/cssLoaders';

// development config
const { merge } = require('webpack-merge');
const commonConfig = require('./common');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

export default function (projectDir = '') {
  return merge(commonConfig(projectDir), {
    mode: 'development',
    module: {
      rules: [
        ...getCssLoaders({
          useExtractLoader: false,
        }),
      ],
    },
    devServer: {
      hot: true, // enable HMR on the server
      historyApiFallback: true, // fixes error 404-ish errors when using react router :see this SO question: https://stackoverflow.com/questions/43209666/react-router-v4-cannot-get-url
    },
    devtool: 'cheap-module-source-map',
    plugins: [new ReactRefreshPlugin()],
  });
}
