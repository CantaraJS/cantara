import webpack from 'webpack';

import getGlobalConfig, { getActiveApp } from '../../cantara-config';
import createNodeWebpackConfig from '../../util/config/webpackNodeConfig';

export function startNodeAppDevelopmentServer() {
  const {
    runtime: {
      projectDir,
      aliases: { packageAliases },
    },
  } = getGlobalConfig();

  const activeApp = getActiveApp();

  const webpackConfig = createNodeWebpackConfig({
    app: activeApp,
    alias: packageAliases,
    projectDir,
    env: activeApp.env,
  });

  const compiler = webpack(webpackConfig);
  compiler.watch({}, (err, stats) => {
    if (err) {
      throw new Error('Build error.');
    }
  });
}
