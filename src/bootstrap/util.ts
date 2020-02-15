import path from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import execCmd from '../util/exec';
import getGlobalConfig, { getActiveApp } from '../cantara-config';
import slash from 'slash';
import renderTemplate from '../util/configTemplates';
import { CantaraApplication } from '../util/types';
import { writeJson, readFileAsJSON } from '../util/fs';

type KeyValueStore = { [key: string]: string };

interface ActualInstalledDependencies {
  devDependencies: KeyValueStore;
  dependencies: KeyValueStore;
}

/**
 * Returns installed dependencies
 * in the specified directory.
 * It first looks up the dependencies
 * which *should* be installed
 * in the package.json and then
 * looks if they are *actually*
 * installed by looking them up
 * in node_modules
 */
function getInstalledDependencies({
  rootDir,
}: {
  rootDir: string;
}): ActualInstalledDependencies {
  const localPackageJsonPath = path.join(rootDir, 'package.json');

  const getActuallyInstalledDeps = (dependencies: KeyValueStore) => {
    const actualDependencies = Object.keys(dependencies).reduce(
      (obj, depName) => {
        const version = dependencies[depName];
        // If found in node_modules folder, keep it
        const depPath = path.join(rootDir, 'node_modules', depName);
        if (existsSync(depPath)) {
          return {
            ...obj,
            [depName]: version,
          };
        }
        // If not, exclude it. Needs to be installed.
        return obj;
      },
      {},
    );
    return actualDependencies;
  };

  if (existsSync(localPackageJsonPath)) {
    const {
      dependencies = {},
      devDependencies = {},
    }: {
      dependencies?: KeyValueStore;
      devDependencies?: KeyValueStore;
    } = JSON.parse(readFileSync(localPackageJsonPath).toString());
    return {
      dependencies: getActuallyInstalledDeps(dependencies),
      devDependencies: getActuallyInstalledDeps(devDependencies),
    };
  }
  return { dependencies: {}, devDependencies: {} };
}

interface CreatePackageJsonOptions {
  folderPath: string;
}

/** Create new package.json
 * where none exists.
 */
async function createPackageJson({ folderPath }: CreatePackageJsonOptions) {
  await execCmd(`npm init -y`, {
    workingDirectory: folderPath,
  });
  // Set private to true
  const packageJsonPath = path.join(folderPath, 'package.json');
  const packageJsonContent = readFileAsJSON(packageJsonPath);
  const newPackageJsonContent = {
    ...packageJsonContent,
    private: true,
    main: 'build/index.js',
  };
  writeJson(packageJsonPath, newPackageJsonContent);
}

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
  // Add dependencies
  const localPackageJsonPath = path.join(rootDir, 'package.json');
  const nodeModulesPath = path.join(rootDir, 'node_modules');
  if (existsSync(localPackageJsonPath)) {
    // If no node_modules folder exists, run "npm install"
    if (!existsSync(nodeModulesPath)) {
      await execCmd(`npm i`, {
        workingDirectory: rootDir,
        redirectIo: true,
      });
      // If it still doesn't exist,
      // dependencies/devDependencies is empty
      // in package.json
      // Therefore create node_modules folder ourselves
      // so that "npm i" isn't called every time
      // this function is executed
      if (!existsSync(nodeModulesPath)) {
        mkdirSync(nodeModulesPath);
      }
    }
    // Look if dependencies need to be updated
    const {
      dependencies = {},
      devDependencies = {},
    } = getInstalledDependencies({ rootDir });
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
    await createPackageJson({ folderPath: rootDir });
    await createOrUpdatePackageJSON({
      rootDir,
      expectedDependencies,
      expectedDevDependencies,
    });
  }
}

/** Converts webpack compatible aliases
 * into Jest's `moduleNameMapper` aliases
 */
function getJestAliases() {
  const {
    runtime: {
      aliases: { packageAliases },
    },
  } = getGlobalConfig();
  try {
    const activeApp = getActiveApp();
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
  } catch {
    // No active app, skipping...
    return {};
  }
}

interface CreateJestConfigOptions {
  /** Path where to save jest.config.js */
  dir: string;
  configTemplateFileName: string;
  setupScriptImports?: string[];
}

export function createJestConfig({
  dir,
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
  const setupFileDestination = path.join(dir, 'jest.setup.ts');
  writeFileSync(setupFileDestination, renderedSetupFile);

  // create jest.config.js
  const jestConfigTemplate = readFileSync(
    path.join(globalCantaraConfig.internalPaths.static, configTemplateFileName),
  ).toString();

  // Map all package aliases and mock all possible import file types
  const styleMockFilePath = path.join(
    globalCantaraConfig.internalPaths.static,
    'jestStyleMock.js',
  );
  const fileMockFilePath = path.join(
    globalCantaraConfig.internalPaths.static,
    'jestFileMock.js',
  );
  const moduleNameMapper = {
    ...jestAliases,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': fileMockFilePath,
    '\\.(css|less)$': styleMockFilePath,
  };

  const templateVariables = {
    MODULES_PATH: slash(
      path.join(globalCantaraConfig.internalPaths.root, 'node_modules'),
    ),
    MODULE_NAME_MAPPER: JSON.stringify(moduleNameMapper, null, 2),
  };

  const newJestConfig = renderTemplate({
    template: jestConfigTemplate,
    variables: templateVariables,
  });
  const newJestConfigPath = path.join(dir, 'jest.config.js');

  writeFileSync(newJestConfigPath, newJestConfig);
}

export function createNodeJestConfig(app: CantaraApplication) {
  createJestConfig({
    dir: app.paths.root,
    configTemplateFileName: 'jestNodeConfig.template.js',
  });
}

export function createReactJestConfig(app: CantaraApplication) {
  createJestConfig({
    dir: app.paths.root,
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
    internalPaths: { temp },
  } = getGlobalConfig();
  try {
    const { env } = getActiveApp();
    const jsonFilePath = path.join(temp, '.env.json');
    writeJson(jsonFilePath, env || {});
  } catch {
    // No app active, skipping this step...
  }
}

interface CreateLocalAppTsConfigOptions {
  indexFileName: string;
  app: CantaraApplication;
}
/**
 * Create local tsconfig which extends from global one.
 * Needed to correctly generate types
 */
export function createLocalAppTsConfig({
  indexFileName,
  app,
}: CreateLocalAppTsConfigOptions) {
  const globalCantaraConfig = getGlobalConfig();
  const appLocalTsConfigTemplate = readFileSync(
    path.join(
      globalCantaraConfig.internalPaths.static,
      'appLocalTsConfigTemplate.json',
    ),
  ).toString();
  const renderedTsConfig = renderTemplate({
    template: appLocalTsConfigTemplate,
    variables: {
      INDEX_FILE_NAME: indexFileName,
    },
  });
  const appLocalTsConfigPath = path.join(
    app.paths.root,
    '.tsconfig.local.json',
  );
  writeJson(appLocalTsConfigPath, JSON.parse(renderedTsConfig));
}
