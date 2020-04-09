import path from 'path';
import { existsSync, readFileSync, mkdirSync } from 'fs';
import execCmd from '../../util/exec';
import { writeJson, readFileAsJSON } from '../../util/fs';

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
