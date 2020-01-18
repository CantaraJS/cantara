import path from 'path';
import { copyFileSync, existsSync, readFileSync, mkdirSync } from 'fs';

import getGlobalConfig from '../cantara-config';
import { CantaraApplication } from '../util/types';
import { createOrUpdatePackageJSON, createReactJestConfig } from './util';

/** Prepares React App Folder */
export default async function prepareReactApps(app: CantaraApplication) {
  const globalCantaraConfig = getGlobalConfig();
  // Copy index.html to asssets folder if not already there
  const defaultIndexHtmlTemplatePath = path.join(
    globalCantaraConfig.internalPaths.static,
    'default-index.html',
  );
  if (!app.paths.assets) return;
  if (!existsSync(app.paths.assets)) {
    mkdirSync(app.paths.assets);
  }
  const indexHtmlDestinationPath = path.join(app.paths.assets, 'index.html');
  if (!existsSync(indexHtmlDestinationPath)) {
    copyFileSync(defaultIndexHtmlTemplatePath, indexHtmlDestinationPath);
  }

  // Install/update dependencies
  await createOrUpdatePackageJSON({
    expectedDependencies: globalCantaraConfig.dependencies.react,
    // expectedDevDependencies: {
    //   ...globalCantaraConfig.dependencies.typescript,
    //   ...globalCantaraConfig.dependencies.testing,
    // },
    rootDir: app.paths.root,
  });

  // Create react Jest config file and copy to current project
  createReactJestConfig(app);
}
