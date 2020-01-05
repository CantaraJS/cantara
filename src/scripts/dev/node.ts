import webpack from 'webpack';

import getGlobalConfig from '../../config';
import createReactWebpackDevConfig from './webpack/reactDev.config';
import clearConsole from '../../util/clearConsole';
import createNodeWebpackDevConfig from './webpack/nodeDev.config';

export function startNodeAppDevelopmentServer() {
  const {
    runtime: {
      currentCommand: { app: activeApp },
      projectDir,
    },
  } = getGlobalConfig();
  const webpackConfig = createNodeWebpackDevConfig({
    app: activeApp,
    projectDir,
  });

  const compiler = webpack(webpackConfig);
  compiler.watch({}, (err, stats) => {
    if (err) {
      throw new Error('Build error.');
    }
  });
}
