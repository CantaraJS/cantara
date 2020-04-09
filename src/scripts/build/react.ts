import { CantaraApplication } from '../../util/types';
import createReactWebpackConfig from '../../util/config/webpackReactConfig';
import webpack from 'webpack';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';

export default async function buildReactApp(app: CantaraApplication) {
  const {
    allPackages: { include },
    projectDir,
    aliases: { packageAliases },
  } = getGlobalConfig();

  const { env } = getRuntimeConfig();

  const webpackConfig = createReactWebpackConfig({
    alias: packageAliases,
    app,
    env: env,
    mode: 'production',
    projectDir,
    include,
  });

  const compiler = webpack(webpackConfig);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log('Compile error', err);
        reject(new Error('Error while compiling.'));
      } else {
        console.log('Successfully compiled!');
      }
    });
  });
}
