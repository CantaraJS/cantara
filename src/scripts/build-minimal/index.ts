import path from 'path';
import getGlobalConfig from '../../cantara-config/global-config';
import createReactWebpackConfig from '../../util/config/webpackReactConfig';
import { CantaraApplication } from '../../util/types';
import { compile } from '../build/util';

import createWebpackProdConfig from './configs/webpack/prod';

export async function buildMinimal() {
  const {
    includes: { internalPackages },
    projectDir,
    aliases: { packageAliases },
    tailwind,
    globalCantaraSettings,
  } = getGlobalConfig();

  // const appDir = path.join(projectDir, 'minimal-app');
  const appDir = path.join(projectDir, 'react-apps/app');
  const srcDir = path.join(appDir, 'src');

  const app: CantaraApplication = {
    aliases: {},
    meta: { displayName: 'Minimal App' },
    name: 'minimal-app',
    paths: {
      build: path.join(appDir, 'dist'),
      root: appDir,
      runtimePresetEntry: path.join(srcDir, 'app-preset/index.ts'),
      runtimePresets: path.join(srcDir, 'presets'),
      assets: path.join(appDir, 'assets'),
      static: path.join(appDir, 'static'),
      src: srcDir,
    },
    type: 'react',
  };

  const webpackProdConfig = createReactWebpackConfig({
    projectDir,
    app,
    publicPath: '/standard',
  });

  // const webpackProdConfig = createWebpackProdConfig(projectDir);

  await compile(webpackProdConfig);
}
