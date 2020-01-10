import { CantaraApplication } from '../../util/types';
import getGlobalConfig from '../../cantara-config';
import createReactWebpackConfig from '../../util/config/webpackReactConfig';
import webpack from 'webpack';

export default function buildReactApp(app: CantaraApplication) {
  const {
    allPackages: { aliases, include },
    runtime: { projectDir },
  } = getGlobalConfig();

  const webpackConfig = createReactWebpackConfig({
    alias: aliases,
    app,
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
