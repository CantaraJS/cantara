import path from 'path';
import ncpCb from 'ncp';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { promisify } from 'util';

import getGlobalConfig from '../config';
import prepareReactApps from './react';
import { createOrUpdatePackageJSON } from './util';
import prepareServerlessApp from './serverless';

const ncp = promisify(ncpCb);

/** Make paths relative for typescript */
function aliasesAbsoluteToRelative(aliases: { [key: string]: string }) {
  return Object.keys(aliases).reduce((newObj, currAliasName) => {
    const currPath = aliases[currAliasName];
    const newPath = currPath.slice(currPath.lastIndexOf('packages'));
    return {
      ...newObj,
      [currAliasName]: [newPath],
    };
  }, {});
}

/** Prepares user's project */
async function prepareCantaraProject() {
  const globalCantaraConfig = getGlobalConfig();
  const rootDir = globalCantaraConfig.runtime.projectDir;
  // Static files/folders to copy to the project's root
  const STATIC_PATHS_TO_COPY = ['.vscode', '.gitignore', '.prettierrc'];
  for (const pathToCopy of STATIC_PATHS_TO_COPY) {
    const fullPath = path.join(rootDir, pathToCopy);
    if (!existsSync(fullPath)) {
      await ncp(
        path.join(globalCantaraConfig.internalPaths.static, pathToCopy),
        fullPath,
      );
    }
  }

  // Read tsconfig.json and add package aliases
  const tsConfig = JSON.parse(
    readFileSync(
      path.join(globalCantaraConfig.internalPaths.static, 'tsconfig.json'),
    ).toString(),
  );
  const {
    allPackages: { aliases },
  } = globalCantaraConfig;
  const newTsConfig = {
    ...tsConfig,
    compilerOptions: {
      ...tsConfig.compilerOptions,
      paths: aliasesAbsoluteToRelative(aliases),
    },
  };
  writeFileSync(
    path.join(rootDir, 'tsconfig.json'),
    JSON.stringify(newTsConfig),
  );

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
