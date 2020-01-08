import path from 'path';
import ncpCb from 'ncp';
import { copyFileSync, existsSync, readFileSync } from 'fs';
import { promisify } from 'util';

import getGlobalConfig from '../config';
import { CantaraApplication } from '../util/types';
import execCmd from '../util/exec';
import prepareReactApps from './react';
import { createOrUpdatePackageJSON } from './util';
import prepareServerlessApp from './serverless';

const ncp = promisify(ncpCb);

/** Prepares user's project */
async function prepareCantaraProject() {
  const globalCantaraConfig = getGlobalConfig();
  const rootDir = globalCantaraConfig.runtime.projectDir;
  // Static files/folders to copy to the project's root
  const STATIC_PATHS_TO_COPY = [
    '.vscode',
    '.gitignore',
    '.prettierrc',
    'tsconfig.json',
  ];
  for (const pathToCopy of STATIC_PATHS_TO_COPY) {
    const fullPath = path.join(rootDir, pathToCopy);
    if (!existsSync(fullPath)) {
      await ncp(
        path.join(globalCantaraConfig.internalPaths.static, pathToCopy),
        fullPath,
      );
    }
  }
  // Install React dependencies globally for project
  await createOrUpdatePackageJSON({
    rootDir,
    expectedDependencies: globalCantaraConfig.dependencies.react,
  });
}

/**
 * Prepares the application folders if not done already.
 */
export default async function onPreBootstrap() {
  const globalCantaraConfig = getGlobalConfig();

  await prepareCantaraProject();

  for (const app of globalCantaraConfig.allApps) {
    // Each app type is bootstrapped slightly different
    if (app.type === 'react') {
      await prepareReactApps(app);
    }
    if (app.type === 'serverless') {
      await prepareServerlessApp(app);
    }
  }
}
