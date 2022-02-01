import { CantaraApplication } from '../../util/types';
import createReactWebpackConfig from '../../util/config/webpackReactConfig';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import { compile } from './util';

export default async function buildReactApp(app: CantaraApplication) {
  console.log('Build react app', app.type);
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

  await compile(webpackConfig);
}
