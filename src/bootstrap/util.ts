import path from 'path';
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import execCmd from '../util/exec';
import getGlobalConfig from '../cantara-config';
import slash from 'slash';
import renderTemplate from '../util/configTemplates';
import { CantaraApplication } from '../util/types';

interface CreateOrUpdatePackageJSONParams {
  expectedDependencies?: { [key: string]: string };
  expectedDevDependencies?: { [key: string]: string };
  rootDir: string;
}

interface GetDependenciesInstallationStringOptions {
  /** Dependencies which are expected to be present
   * in actualDependencies
   */
  expectedDependencies: { [key: string]: string };
  /** Currently installed depdencies */
  actualDependencies: { [key: string]: string };
}

/** Returns a string of dependecies that
 * need to be installed in the form of:
 * "react@16.0.0 react-dom@16.0.0"
 */
function getDependenciesInstallationString({
  expectedDependencies,
  actualDependencies,
}: GetDependenciesInstallationStringOptions) {
  const dependenciesToInstall = Object.keys(expectedDependencies)
    .reduce((depsStr, depName) => {
      const appDependencyVersion = actualDependencies[depName];
      const expectedVersion = expectedDependencies[depName];
      if (expectedVersion && expectedVersion !== appDependencyVersion) {
        return `${depName}@${expectedVersion} ${depsStr}`;
      }
      return depsStr;
    }, '')
    .trim();
  return dependenciesToInstall;
}

/** Updates/installs the specified dependecies in the
 * specified folder. Creates a package.json if none exists.
 */
export async function createOrUpdatePackageJSON({
  rootDir,
  expectedDependencies,
  expectedDevDependencies,
}: CreateOrUpdatePackageJSONParams) {
  // Install/update dependencies
  const localPackageJsonPath = path.join(rootDir, 'package.json');
  if (existsSync(localPackageJsonPath)) {
    // Look if dependencies need to be updated
    type KeyValueStore = { [key: string]: string };
    const {
      dependencies,
      devDependencies,
    }: {
      dependencies: KeyValueStore;
      devDependencies: KeyValueStore;
    } = JSON.parse(readFileSync(localPackageJsonPath).toString());
    if (expectedDependencies) {
      const dependenciesToInstall = getDependenciesInstallationString({
        expectedDependencies,
        actualDependencies: dependencies,
      });
      if (dependenciesToInstall) {
        await execCmd(`npm install -S ${dependenciesToInstall}`, {
          workingDirectory: rootDir,
          redirectIo: true,
        });
      }
    }
    if (expectedDevDependencies) {
      const devDependenciesToInstall = getDependenciesInstallationString({
        expectedDependencies: expectedDevDependencies,
        actualDependencies: devDependencies,
      });
      if (devDependenciesToInstall) {
        await execCmd(`npm install -D ${devDependenciesToInstall}`, {
          workingDirectory: rootDir,
          redirectIo: true,
        });
      }
    }
  } else {
    // Create new packageJSON and install dependencies
    await execCmd(`npm init -y`, {
      workingDirectory: rootDir,
    });
    if (expectedDependencies) {
      const dependenciesToInstall = Object.keys(expectedDependencies)
        .reduce((depsStr, depName) => {
          return `${depName}@${expectedDependencies[depName]} ${depsStr}`;
        }, '')
        .trim();
      if (dependenciesToInstall) {
        await execCmd(`npm install -S ${dependenciesToInstall}`, {
          workingDirectory: rootDir,
          redirectIo: true,
        });
      }
    }

    if (expectedDevDependencies) {
      const devDependenciesToInstall = Object.keys(expectedDevDependencies)
        .reduce((depsStr, depName) => {
          return `${depName}@${expectedDevDependencies[depName]} ${depsStr}`;
        }, '')
        .trim();
      if (devDependenciesToInstall) {
        await execCmd(`npm install -D ${devDependenciesToInstall}`, {
          workingDirectory: rootDir,
          redirectIo: true,
        });
      }
    }
  }
}

export function createReactJestConfig(app: CantaraApplication) {
  const globalCantaraConfig = getGlobalConfig();

  // Copy setup file to project root
  const setupFilePath = path.join(
    globalCantaraConfig.internalPaths.static,
    'jestReact.setup.ts',
  );
  const setupFileDestination = path.join(app.paths.root, 'jest.setup.ts');
  copyFileSync(setupFilePath, setupFileDestination);

  // create jest.config.js
  const jestConfigTemplate = readFileSync(
    path.join(
      globalCantaraConfig.internalPaths.static,
      'jestReactConfig.template.js',
    ),
  ).toString();

  const templateVariables = {
    MODULES_PATH: slash(
      path.join(globalCantaraConfig.internalPaths.root, 'node_modules'),
    ),
  };

  const newJestConfig = renderTemplate({
    template: jestConfigTemplate,
    variables: templateVariables,
  });
  const newJestConfigPath = path.join(app.paths.root, 'jest.config.js');

  writeFileSync(newJestConfigPath, newJestConfig);
}

export function createNodeJestConfig(app: CantaraApplication) {
  const globalCantaraConfig = getGlobalConfig();
  const jestConfigTemplate = readFileSync(
    path.join(
      globalCantaraConfig.internalPaths.static,
      'jestNodeConfig.template.js',
    ),
  ).toString();
  const newJestConfigPath = path.join(app.paths.root, 'jest.config.js');

  const templateVariables = {
    MODULES_PATH: slash(
      path.join(globalCantaraConfig.internalPaths.root, 'node_modules'),
    ),
  };

  const newJestConfig = renderTemplate({
    template: jestConfigTemplate,
    variables: templateVariables,
  });

  writeFileSync(newJestConfigPath, newJestConfig);
}
