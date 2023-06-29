import path from 'path';

import { CantaraApplication } from '../util/types';

import { readFileAsJSON, writeJson } from '../util/fs';
import { copyFileSync } from 'fs';
import { createOrUpdatePackageJSON } from './util/yarn';
import { createReactJestConfig, createNodeJestConfig } from './util/testing';
import getGlobalConfig from '../cantara-config/global-config';
import { createLocalTsConfig } from './util/typescript';

function addPeerDeps(packageJsonPath: string, deps: { [key: string]: string }) {
  const packageJson = readFileAsJSON(packageJsonPath);
  const peerDeps = {
    ...(packageJson.peerDependencies || {}),
    ...deps,
  };
  if (Object.keys(peerDeps).length) {
    const newPackageJson = {
      ...packageJson,
      peerDependencies: peerDeps,
    };
    writeJson(packageJsonPath, newPackageJson);
  }
}

/** Prepares a JavaScript package or React Component */
export default async function prepareJsPackage(app: CantaraApplication) {
  const {
    dependencies: { react: reactDeps, testing: testingDeps },
    internalPaths: { static: staticFilesFolder },
  } = getGlobalConfig();

  let indexFileName = 'index.ts';
  const isReactComponent = app.type === 'react-component';

  const expectedDevDependencies = isReactComponent
    ? { ...reactDeps, ...testingDeps }
    : {};

  // Create package.json if none exists
  await createOrUpdatePackageJSON({
    rootDir: app.paths.root,
    expectedDevDependencies,
    expectedDependencies: {},
  });

  if (isReactComponent) {
    // For React Components, add react and react-dom to the peer dependencies
    addPeerDeps(path.join(app.paths.root, 'package.json'), reactDeps);
    // Create jest config files
    createReactJestConfig(app);
    indexFileName = 'index.tsx';
  } else {
    createNodeJestConfig(app);
  }

  // Create local tsconfig which extends from global one.
  // Needed to correctly generate types
  createLocalTsConfig({
    app,
    indexFileName,
    templateFileName: 'packageTsConfigTemplate.json',
  });

  // Copy .npmignore ignore file
  const npmignorePath = path.join(staticFilesFolder, '.npmignore-template');
  const npmignoreDestPath = path.join(app.paths.root, '.npmignore');
  copyFileSync(npmignorePath, npmignoreDestPath);
}
