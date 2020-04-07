import path from 'path';
import ncpCb from 'ncp';
import { existsSync, readFileSync, mkdirSync } from 'fs';
import { promisify } from 'util';

import getGlobalConfig from '../cantara-config';
import prepareReactApps from './react';

import prepareServerlessApp from './serverless';
import prepareJsPackage from './packages';
import { writeJson } from '../util/fs';
import prepareNodeApp from './node';
import { createOrUpdatePackageJSON } from './util/npm';
import { createTempEnvJsonFile } from './util/env';
import { createJestConfig } from './util/jest';
import setupGitHooks from './util/git-hooks';

const ncp = promisify(ncpCb);

/** Make paths relative for typescript */
function aliasesAbsoluteToRelative(aliases: { [key: string]: string }) {
  return Object.keys(aliases).reduce((newObj, currAliasName) => {
    const currPath = aliases[currAliasName];
    const newPath = currPath.slice(currPath.lastIndexOf('packages'));
    return {
      ...newObj,
      [currAliasName]: [newPath],
      [`${currAliasName}/*`]: [`${newPath}/*`],
    };
  }, {});
}

/** Prepares user's project */
async function prepareCantaraProject() {
  const globalCantaraConfig = getGlobalConfig();
  const rootDir = globalCantaraConfig.runtime.projectDir;
  // Static files/folders to copy to the project's root
  // Copy global.d.ts file to project's root:
  // This way, static assets like images and CSS files can be imported using "import" syntax
  const STATIC_PATHS_TO_COPY = [
    '.vscode',
    '.gitignore',
    '.prettierrc',
    'global.d.ts',
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

  // Read tsconfig.json and add package aliases
  const tsConfig = JSON.parse(
    readFileSync(
      path.join(globalCantaraConfig.internalPaths.static, 'tsconfig.json'),
    ).toString(),
  );
  const {
    runtime: {
      aliases: { packageAliases },
    },
  } = globalCantaraConfig;

  const newTsConfig = {
    ...tsConfig,
    compilerOptions: {
      ...tsConfig.compilerOptions,
      paths: aliasesAbsoluteToRelative(packageAliases),
    },
  };
  writeJson(path.join(rootDir, 'tsconfig.json'), newTsConfig);

  // Install React + Typescript dependencies globally for project
  await createOrUpdatePackageJSON({
    rootDir,
    expectedDependencies: globalCantaraConfig.dependencies.react,
    expectedDevDependencies: {
      ...globalCantaraConfig.dependencies.typescript,
      // ...globalCantaraConfig.dependencies.testing,
      ...globalCantaraConfig.dependencies.common,
    },
  });

  // Setup git hooks
  await setupGitHooks();

  // Create .temp folder if it doesn't exist yet
  if (!existsSync(globalCantaraConfig.internalPaths.temp)) {
    mkdirSync(globalCantaraConfig.internalPaths.temp);
  }

  createTempEnvJsonFile();

  // Copy global jest.config.js (needed so that correct typings are used when e.g. also cypress is installed)
  createJestConfig({
    dir: rootDir,
    configTemplateFileName: 'jestGlobalConfig.template.js',
  });

  // Create .cantara folder if it doesn't exist
  const dotCantaraDir = globalCantaraConfig.runtime.dotCantaraDir;
  if (!existsSync(dotCantaraDir)) {
    mkdirSync(dotCantaraDir, { recursive: true });
  }
}

/**
 * Prepares the application folders if not done already.
 * Gets only executed if there's an active application
 */
export default async function onPreBootstrap() {
  await prepareCantaraProject();

  const globalCantaraConfig = getGlobalConfig();
  const isAnAppActive = !!globalCantaraConfig.runtime.currentCommand.app;
  if (!isAnAppActive) return;

  for (const app of globalCantaraConfig.allApps) {
    // Each app type is bootstrapped slightly different
    if (app.type === 'react') {
      await prepareReactApps(app);
    }
    if (app.type === 'serverless') {
      await prepareServerlessApp(app);
    }
    if (app.type === 'react-component' || app.type === 'js-package') {
      await prepareJsPackage(app);
    }
    if (app.type === 'node') {
      await prepareNodeApp(app);
    }
  }
}
