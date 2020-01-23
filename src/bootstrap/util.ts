import path from 'path';
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import execCmd from '../util/exec';
import getGlobalConfig from '../cantara-config';
import slash from 'slash';
import renderTemplate from '../util/configTemplates';
import { CantaraApplication } from '../util/types';
import { writeJson } from '../util/fs';

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
      dependencies = {},
      devDependencies = {},
    }: {
      dependencies?: KeyValueStore;
      devDependencies?: KeyValueStore;
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

/** Converts webpack compatible aliases
 * into Jest's `moduleNameMapper` aliases
 */
function getJestAliases() {
  const {
    aliases: { packageAliases },
    runtime: {
      currentCommand: { app: activeApp },
    },
  } = getGlobalConfig();
  const jestAliases = Object.keys(packageAliases).reduce(
    (aliasObj, packageName) => {
      const packageAbsolutePath = packageAliases[packageName];
      const relativePathToPackage = path.relative(
        activeApp.paths.root,
        packageAbsolutePath,
      );
      return {
        ...aliasObj,
        [`^${packageName}$`]: `<rootDir>/${slash(relativePathToPackage)}`,
      };
    },
    {},
  );
  return jestAliases;
}

interface CreateJestConfigOptions {
  app: CantaraApplication;
  configTemplateFileName: string;
  setupScriptImports?: string[];
}

export function createJestConfig({
  app,
  configTemplateFileName,
  setupScriptImports = [],
}: CreateJestConfigOptions) {
  const globalCantaraConfig = getGlobalConfig();
  const jestAliases = getJestAliases();

  // Copy setup file to project root
  const setupFileTemplatePath = path.join(
    globalCantaraConfig.internalPaths.static,
    'jestSetup.template.ts',
  );
  const renderedSetupFile = renderTemplate({
    template: readFileSync(setupFileTemplatePath).toString(),
    variables: {
      ENV_FILE_PATH: slash(
        path.join(globalCantaraConfig.internalPaths.temp, '.env.json'),
      ),
      IMPORTS: setupScriptImports.reduce((importStr, importName) => {
        return `${importStr}import '${importName}'\n`;
      }, ''),
    },
  });
  const setupFileDestination = path.join(app.paths.root, 'jest.setup.ts');
  writeFileSync(setupFileDestination, renderedSetupFile);

  // create jest.config.js
  const jestConfigTemplate = readFileSync(
    path.join(globalCantaraConfig.internalPaths.static, configTemplateFileName),
  ).toString();

  const templateVariables = {
    MODULES_PATH: slash(
      path.join(globalCantaraConfig.internalPaths.root, 'node_modules'),
    ),
    PACKAGE_ALIASES: JSON.stringify(jestAliases, null, 2),
  };

  const newJestConfig = renderTemplate({
    template: jestConfigTemplate,
    variables: templateVariables,
  });
  const newJestConfigPath = path.join(app.paths.root, 'jest.config.js');

  writeFileSync(newJestConfigPath, newJestConfig);
}

export function createNodeJestConfig(app: CantaraApplication) {
  createJestConfig({
    app,
    configTemplateFileName: 'jestNodeConfig.template.js',
  });
}

export function createReactJestConfig(app: CantaraApplication) {
  createJestConfig({
    app,
    configTemplateFileName: 'jestReactConfig.template.js',
    setupScriptImports: [
      '@testing-library/jest-dom',
      '@testing-library/jest-dom/extend-expect',
    ],
  });
}

/** Takes all env vars defined
 * for the current stage and writes them
 * to 'static/.temp/.env.json'
 * so that parts of the application
 * which don't have access to the runtime
 * can read them, e.g. the Jest setup file
 * in the user's project
 */
export function createTempEnvJsonFile() {
  const {
    runtime: {
      currentCommand: {
        app: { env },
      },
    },
    internalPaths: { temp },
  } = getGlobalConfig();
  const jsonFilePath = path.join(temp, '.env.json');
  writeJson(jsonFilePath, env || {});
}
