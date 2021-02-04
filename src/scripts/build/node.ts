import webpack from 'webpack';
import { CantaraApplication } from '../../util/types';
import createNodeWebpackConfig from '../../util/config/webpackNodeConfig';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import { logBuildTime } from './util';

export default async function buildNodeApp(app: CantaraApplication) {
  const {
    projectDir,
    aliases: { packageAliases },
    additionalCliOptions,
    includes: { internalPackages },
  } = getGlobalConfig();
  const {
    env,
    aliases: { otherAliases },
  } = getRuntimeConfig();

  const webpackConfig = createNodeWebpackConfig({
    alias: {
      ...packageAliases,
      ...otherAliases,
    },
    app,
    env,
    mode: 'production',
    projectDir,
    include: internalPackages,
    nodemonOptions: additionalCliOptions ? [additionalCliOptions] : undefined,
  });

  const onComplete = logBuildTime({
    stepName: 'Bundling',
    toolName: 'Webpack',
  });

  const compiler = webpack(webpackConfig);
  compiler.run((err) => {
    if (err) {
      throw new Error('Error while compiling.');
    }
    compiler.close(() => {
      if (err) {
        console.error('Error while compiling.');
      } else {
        onComplete();
      }
    });
  });
}
