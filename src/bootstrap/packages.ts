import path from 'path';

import { CantaraApplication } from '../util/types';
import { createOrUpdatePackageJSON } from './util';
import getGlobalConfig from '../cantara-config';
import { readFileAsJSON, writeJson } from '../util/fs';

function addPeerDeps(packageJsonPath: string, deps: { [key: string]: string }) {
  const packageJson = readFileAsJSON(packageJsonPath);
  const newPackageJson = {
    ...packageJson,
    peerDependencies: deps,
  };
  writeJson(packageJsonPath, newPackageJson);
}

/** Prepares a JavaScript package or React Component */
export default async function prepareJsPackage(app: CantaraApplication) {
  const {
    dependencies: { react: reactDeps },
  } = getGlobalConfig();
  // Create package.json if none exists

  await createOrUpdatePackageJSON({
    rootDir: app.paths.root,
    expectedDependencies: {},
  });

  // For React Components, add react and react-dom to the peer dependencies
  if (app.type === 'react-component') {
    addPeerDeps(path.join(app.paths.root, 'package.json'), reactDeps);
  }
}
