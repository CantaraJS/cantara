import path from 'path';
import ncpCb from 'ncp';
import { existsSync, readFileSync, mkdirSync } from 'fs';
import { promisify } from 'util';

import prepareReactApps from './react';

import prepareServerlessApp from './serverless';
import prepareJsPackage from './packages';
import { writeJson } from '../util/fs';
import prepareNodeApp from './node';
import { createOrUpdatePackageJSON } from './util/npm';
import { createTempEnvJsonFile } from './util/env';
import { createJestConfig } from './util/jest';
import setupGitHooks from './util/git-hooks';
import getGlobalConfig from '../cantara-config/global-config';

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
async function prepareUserProject() {
  const globalCantaraConfig = getGlobalConfig();
  const rootDir = globalCantaraConfig.projectDir;
  // Static files/folders to copy to the project's root
  // Copy global.d.ts file to project's root:
  // This way, static assets like images and CSS files can be imported using "import" syntax
  const STATIC_PATHS_TO_COPY = [
    { from: '.vscode' },
    { from: '.gitignore-template', to: '.gitignore' },
    { from: '.prettierrc' },
    { from: 'global.d.ts' },
  ];
  for (const pathToCopy of STATIC_PATHS_TO_COPY) {
    const fromPath = path.join(
      globalCantaraConfig.internalPaths.static,
      pathToCopy.from,
    );
    const fullPath = path.join(rootDir, pathToCopy.to || pathToCopy.from);

    if (!existsSync(fullPath)) {
      await ncp(fromPath, fullPath);
    }
  }

  // Read tsconfig.json and add package aliases
  const tsConfig = JSON.parse(
    readFileSync(
      path.join(
        globalCantaraConfig.internalPaths.static,
        'tsConfigTemplate.json',
      ),
    ).toString(),
  );
  const {
    aliases: { packageAliases },
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
  const dotCantaraDir = globalCantaraConfig.dotCantaraDir;
  if (!existsSync(dotCantaraDir)) {
    mkdirSync(dotCantaraDir, { recursive: true });
  }
}

/**
 * Prepares the application folders and the
 * project folder. Must be called after
 * the global and the runtime config
 * have been loaded!
 */
export default async function prepareCantaraProject() {
  await prepareUserProject();

  const globalCantaraConfig = getGlobalConfig();

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
