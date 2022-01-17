import webpack from 'webpack';

import createNodeWebpackConfig from '../../util/config/webpackNodeConfig';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';

export function startNodeAppDevelopmentServer() {
  const {
    includes: { internalPackages },
    projectDir,
    additionalCliOptions,
    aliases: { packageAliases },
  } = getGlobalConfig();

  const {
    env,
    currentCommand: { app: activeApp },
    includes: { linkedPackages },
    aliases: { linkedPackageAliases, otherAliases },
    resolveModulesInDevelopment,
  } = getRuntimeConfig();

  const webpackConfig = createNodeWebpackConfig({
    app: activeApp,
    alias: {
      ...packageAliases,
      ...linkedPackageAliases,
      ...otherAliases,
    },
    projectDir,
    env,
    include: [...internalPackages, ...linkedPackages],
    nodemonOptions: additionalCliOptions ? [additionalCliOptions] : undefined,
    resolveModules: resolveModulesInDevelopment,
  });

  const compiler = webpack(webpackConfig);
  compiler.watch({}, (err, stats) => {
    if (err) {
      console.error(err.stack);
      if ((err as any).details) {
        console.error((err as any).details);
      }
      return;
    }

    console.log(
      stats?.toString({
        chunks: false,
        colors: true,
      }),
    );
  });
}
