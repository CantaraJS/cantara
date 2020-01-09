import createReactWebpackConfig from '../../util/config/webpackReactConfig';
import getGlobalConfig from '../../cantara-config';
import webpack = require('webpack');
import createNodeWebpackConfig from '../../util/config/webpackNodeConfig';

/** Creates a production build of the currently active app/package */
export default function buildActiveApp() {
  const {
    allPackages: { aliases, include },
    runtime: {
      currentCommand: { app: activeApp },
      projectDir,
    },
  } = getGlobalConfig();
  let webpackConfig: webpack.Configuration | undefined = undefined;

  if (activeApp.type === 'react') {
    webpackConfig = createReactWebpackConfig({
      alias: aliases,
      app: activeApp,
      mode: 'production',
      projectDir,
      include,
    });
  }

  if (activeApp.type === 'node') {
    webpackConfig = createNodeWebpackConfig({
      alias: aliases,
      app: activeApp,
      mode: 'production',
      projectDir,
      include,
    });
  }

  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (err) {
      throw new Error('Error while compiling.');
    }
    console.log('Successfully compiled!');
  });
}
