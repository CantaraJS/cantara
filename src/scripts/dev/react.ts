import webpack from 'webpack';

import WebpackDevServer from 'webpack-dev-server';

import createReactWebpackConfig from '../../util/config/webpackReactConfig';
import clearConsole from '../../util/clearConsole';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';

export function startReactAppDevelopmentServer() {
  const {
    includes: { internalPackages },
    aliases: { packageAliases },
    projectDir,
    tailwind,
  } = getGlobalConfig();

  const {
    aliases: { linkedPackageAliases, otherAliases },
    includes: { linkedPackages },
  } = getRuntimeConfig();

  const {
    env,
    currentCommand: { app: activeApp },
    resolveModulesInDevelopment,
  } = getRuntimeConfig();
  const webpackConfig = createReactWebpackConfig({
    alias: {
      ...packageAliases,
      ...linkedPackageAliases,
      ...otherAliases,
    },
    app: activeApp,
    projectDir,
    env,
    include: [...internalPackages, ...linkedPackages],
    resolveModules: resolveModulesInDevelopment,
    pathToTailwindCss: tailwind ? tailwind.pathToTailwindCss : undefined,
  });

  const compiler = webpack({
    ...webpackConfig,
    stats: 'minimal',
  });
  const devServerConfig = activeApp.meta.devServer || { port: 8080 };
  const devServer = new WebpackDevServer(
    {
      static: activeApp.paths.build,
      // publicPath: '/',

      historyApiFallback: true,
      // quiet: true,
      hot: true,
      // Enable gzip compression of generated files.
      compress: true,
      open: true,
      client: {
        logging: 'none',
        overlay: {
          warnings: false,
        },
      },

      // Silence WebpackDevServer's own logs since they're generally not useful.
      // It will still show compile warnings and errors with this setting.
      // clientLogLevel: 'none',
      ...devServerConfig,
    },
    compiler,
  );
  devServer.startCallback(() => {
    //   clearConsole();
  });
}
