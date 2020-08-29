import { CantaraApplication } from './types';
import execCmd from './exec';
import getGlobalConfig from '../cantara-config/global-config';
import path from 'path';

export async function transpile(app: CantaraApplication) {
  const {
    internalPaths: { root: cantaraRoot },
  } = getGlobalConfig();

  const babelConfigFile =
    app.type == 'js-package' ? 'babelNodeConfig.js' : 'babelReactConfig.js';
  const babelConfigPath = path.join(
    cantaraRoot,
    `dist/util/config/${babelConfigFile}`,
  );
  const outputPath = path.join(app.paths.build, path.basename(app.name), 'src');

  const cmdRes = (
    await execCmd(
      `npx babel --config-file ${babelConfigPath} --extensions [.js,.ts,.tsx,.jsx] --source-maps --out-dir ${outputPath} --copy-files ${app.paths.src}`,
    )
  ).toString();

  console.log(cmdRes);
}
