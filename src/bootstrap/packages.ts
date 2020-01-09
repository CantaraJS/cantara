import path from 'path';

import { CantaraApplication } from '../util/types';
import { createOrUpdatePackageJSON } from './util';
import getGlobalConfig from '../config';
import { readFileAsJSON } from '../util/fs';
import { writeFileSync } from 'fs';

function addPeerDeps(packageJsonPath: string, deps: { [key: string]: string }) {
  const packagJson = readFileAsJSON(packageJsonPath);
  const newPackageJson = {
    ...packagJson,
    peerDependencies: deps,
  };
  writeFileSync(packageJsonPath, JSON.stringify(newPackageJson));
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
