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

  const minimalAppDir = path.join(projectDir, 'minimal-app');
  const srcDir = path.join(minimalAppDir, 'src');

  const app: CantaraApplication = {
    aliases: {},
    meta: { displayName: 'Minimal App' },
    name: 'minimal-app',
    paths: {
      build: path.join(minimalAppDir, 'dist'),
      root: minimalAppDir,
      runtimePresetEntry: path.join(srcDir, 'app-preset/index.ts'),
      runtimePresets: path.join(srcDir, 'presets'),
      assets: path.join(minimalAppDir, 'assets'),
      static: path.join(minimalAppDir, 'static'),
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
