import path from 'path';

import { CantaraApplication } from '../util/types';
import { createOrUpdatePackageJSON } from './util';
import getGlobalConfig from '../cantara-config';
import { readFileAsJSON, writeJson } from '../util/fs';
import renderTemplate from '../util/configTemplates';
import { readFileSync } from 'fs';

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
    internalPaths: { static: staticFilesFolder },
  } = getGlobalConfig();

  let indexFileName = 'index.ts';
  const isReactComponent = app.type === 'react-component';

  const expectedDevDependencies = isReactComponent ? reactDeps : {};

  // Create package.json if none exists
  await createOrUpdatePackageJSON({
    rootDir: app.paths.root,
    expectedDevDependencies,
    expectedDependencies: {},
  });

  // For React Components, add react and react-dom to the peer dependencies
  if (isReactComponent) {
    addPeerDeps(path.join(app.paths.root, 'package.json'), reactDeps);
    indexFileName = 'index.tsx';
  }

  // Create local tsconfig which extends from global one.
  // Needed to correctly generate types
  const packageTsConfigTemplate = readFileSync(
    path.join(staticFilesFolder, 'packageTsConfigTemplate.json'),
  ).toString();
  const renderedTsConfig = renderTemplate({
    template: packageTsConfigTemplate,
    variables: {
      INDEX_FILE_NAME: indexFileName,
    },
  });
  const packageTsConfigPath = path.join(app.paths.root, 'tsconfig.json');
  writeJson(packageTsConfigPath, JSON.parse(renderedTsConfig));
}
