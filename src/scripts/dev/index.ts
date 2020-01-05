import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import createReactWebpackDevConfig from './webpack/reactDev.config';
import getGlobalConfig from '../../config';
import clearConsole from '../../util/clearConsole';

// Look at this: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/scripts/start.js
export default function startDevelopmentServer() {
  const {
    runtime: {
      currentCommand: { app: activeApp },
    },
  } = getGlobalConfig();
  const webpackConfig = createReactWebpackDevConfig({
    app: activeApp,
  });

  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, {
    contentBase: activeApp.paths.build,
    historyApiFallback: true,
    quiet: true,
    hot: true,
    // Enable gzip compression of generated files.
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: 'none',
  });
  devServer.listen(8080, '::', err => {
    clearConsole();
    if (err) {
      console.log('Error starting webpack dev server:', err);
    }
  });
}
