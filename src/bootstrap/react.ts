import path from 'path';
import { copyFileSync, existsSync, readFileSync } from 'fs';

import getGlobalConfig from '../config';
import { CantaraApplication } from '../util/types';
import { createOrUpdatePackageJSON } from './util';

/** Prepares React App Folder */
export default async function prepareReactApps(app: CantaraApplication) {
  const globalCantaraConfig = getGlobalConfig();
  // Copy index.html to asssets folder if not already there
  const defaultIndexHtmlTemplatePath = path.join(
    globalCantaraConfig.internalPaths.static,
    'default-index.html',
  );
  if (!app.paths.assets) return;
  const indexHtmlDestinationPath = path.join(app.paths.assets, 'index.html');
  if (!existsSync(indexHtmlDestinationPath)) {
    copyFileSync(defaultIndexHtmlTemplatePath, indexHtmlDestinationPath);
  }

  // Install/update dependencies
  await createOrUpdatePackageJSON({
    expectedDependencies: globalCantaraConfig.dependencies.react,
    rootDir: app.paths.root,
  });
}
