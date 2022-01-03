import { CantaraApplication } from '../../util/types';
import createReactWebpackConfig from '../../util/config/webpackReactConfig';
import webpack from 'webpack';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import { logBuildTime } from './util';

function compile(config: webpack.Configuration): Promise<void> {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err) => {
      if (err) {
        console.log('Error::::::', err);
        reject(new Error('Error while compiling.'));
        return;
      }
      console.log('Successfully compiled!');
      compiler.close(() => {});

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

  const onComplete = logBuildTime({
    stepName: 'Compiling optimized bundle',
    toolName: 'Webpack',
  });

  await compile({
    ...webpackConfig,
    stats: 'normal',
  });

  onComplete();
}
