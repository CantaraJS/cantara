import { CantaraApplication } from '../../util/types';
import getGlobalConfig from '../../cantara-config';
import createReactWebpackConfig from '../../util/config/webpackReactConfig';
import webpack from 'webpack';

export default function buildReactApp(app: CantaraApplication) {
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
  compiler.run((err, stats) => {
    if (err) {
      throw new Error('Error while compiling.');
    }
    console.log('Successfully compiled!');
  });
}
