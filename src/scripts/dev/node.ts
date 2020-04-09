import webpack from 'webpack';

import createNodeWebpackConfig from '../../util/config/webpackNodeConfig';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';

export function startNodeAppDevelopmentServer() {
  const {
    allPackages: { include },
    projectDir,
    aliases: { packageAliases },
  } = getGlobalConfig();

  const {
    env,
    currentCommand: { additionalCliOptions, app: activeApp },
  } = getRuntimeConfig();

  const webpackConfig = createNodeWebpackConfig({
    app: activeApp,
    alias: packageAliases,
    projectDir,
    env,
    include,
    nodemonOptions: additionalCliOptions,
  });

  const compiler = webpack(webpackConfig);
  compiler.watch({}, (err, stats) => {
    if (err) {
      throw new Error('Build error.');
    }
  });
}
