import { CantaraApplication } from '../../util/types';
import getGlobalConfig from '../../cantara-config';
import createReactWebpackConfig from '../../util/config/webpackReactConfig';
import webpack from 'webpack';

export default async function buildReactApp(app: CantaraApplication) {
  const {
    allPackages: { include },
    runtime: {
      projectDir,
      aliases: { packageAliases },
    },
  } = getGlobalConfig();

  const webpackConfig = createReactWebpackConfig({
    alias: packageAliases,
    app,
    env: app.env,
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
