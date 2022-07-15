import getGlobalConfig from '../../cantara-config/global-config';
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

  const webpackProdConfig = createWebpackProdConfig(projectDir);

  await compile(webpackProdConfig);
}
