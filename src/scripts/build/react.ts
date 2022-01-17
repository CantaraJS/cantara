import { CantaraApplication } from '../../util/types';
import createReactWebpackConfig from '../../util/config/webpackReactConfig';
import webpack from 'webpack';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import { logBuildTime } from './util';

function compile(config: webpack.Configuration): Promise<void> {
  const onComplete = logBuildTime({
    stepName: 'Compiling optimized bundle',
    toolName: 'Webpack',
  });
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack);
        if ((err as any).details) {
          console.error((err as any).details);
        }
        reject(new Error('Error while compiling.'));
        return;
      }

      console.log(
        stats?.toString({
          chunks: false,
          colors: true,
        }),
      );
      compiler.close(() => {});
      onComplete();
      if (stats?.hasErrors()) {
        reject(new Error('Error while compiling.'));
        return;
      }
      resolve();
    });
  });
}

export default async function buildReactApp(app: CantaraApplication) {
  const {
    includes: { internalPackages },
    projectDir,
    aliases: { packageAliases },
    tailwind,
    globalCantaraSettings,
  } = getGlobalConfig();

  const {
    env,
    aliases: { otherAliases },
    // resolveModulesInDevelopment,
  } = getRuntimeConfig();

  // This needs to be set so that PurgeCSS runs when tailwind is enabled
  process.env.NODE_ENV = 'production';

  const webpackConfig = createReactWebpackConfig({
    alias: {
      ...packageAliases,
      ...otherAliases,
    },
    app,
    env: env,
    mode: 'production',
    projectDir,
    include: internalPackages,
    // TODO: Evaluate if this should also be set for prod builds
    // resolveModules: resolveModulesInDevelopment,
    pathToTailwindCss: tailwind ? tailwind.pathToTailwindCss : undefined,
    enableBundleAnalyzer: globalCantaraSettings.bundleAnalyzer,
  });

  await compile({
    ...webpackConfig,
    stats: 'normal',
  });
}
