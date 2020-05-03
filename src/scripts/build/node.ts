import webpack from 'webpack';
import { CantaraApplication } from '../../util/types';
import createNodeWebpackConfig from '../../util/config/webpackNodeConfig';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';

export default async function buildNodeApp(app: CantaraApplication) {
  const {
    allPackages: { include },
    projectDir,
    aliases: { packageAliases },
    additionalCliOptions,
  } = getGlobalConfig();
  const { env } = getRuntimeConfig();

  const webpackConfig = createNodeWebpackConfig({
    alias: packageAliases,
    app,
    env,
    mode: 'production',
    projectDir,
    include,
    nodemonOptions: additionalCliOptions,
  });

  const compiler = webpack(webpackConfig);
  compiler.run(err => {
    if (err) {
      throw new Error('Error while compiling.');
    }
    console.log('Successfully compiled!');
  });
}
