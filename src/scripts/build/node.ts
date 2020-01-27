import webpack from 'webpack';
import { CantaraApplication } from '../../util/types';
import getGlobalConfig from '../../cantara-config';
import createNodeWebpackConfig from '../../util/config/webpackNodeConfig';

export default function buildNodeApp(app: CantaraApplication) {
  const {
    allPackages: { include },
    runtime: {
      projectDir,
      aliases: { packageAliases },
    },
  } = getGlobalConfig();

  const webpackConfig = createNodeWebpackConfig({
    alias: packageAliases,
    app,
    env: app.env,
    mode: 'production',
    projectDir,
    include,
  });

  const compiler = webpack(webpackConfig);
  compiler.run(err => {
    if (err) {
      throw new Error('Error while compiling.');
    }
    console.log('Successfully compiled!');
  });
}
