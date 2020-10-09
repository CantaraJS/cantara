import { CantaraApplication } from './types';
import execCmd from './exec';
import getGlobalConfig from '../cantara-config/global-config';
import path from 'path';
const babelMerge = require('babel-merge');

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
  const sourceMap = app.meta.sourceMaps ? '--source-maps' : '';

  // clean build dir
  await execCmd(`rm -rf ${app.paths.build}`);

  const cmdRes = (
    await execCmd(
      `npx babel --config-file ${babelConfigPath} --extensions [.js,.ts,.tsx,.jsx] ${sourceMap} --out-dir ${outputPath} --copy-files ${app.paths.src}`,
    )
  ).toString();

  console.log(cmdRes);
}

export function merge(app: CantaraApplication, config: { [k: string]: any }) {
  if (!app.meta.customBabelConfig) {
    return config;
  }
  const customConfig = require(path.join(
    app.paths.root,
    app.meta.customBabelConfig,
  ));
  const merged = babelMerge(config, customConfig);
  console.log(merged);
  return merged;
}
