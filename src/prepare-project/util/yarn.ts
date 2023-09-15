import path from 'path';
import { existsSync, readFileSync } from 'fs';
import execCmd from '../../util/exec';
import { writeJson, readFileAsJSON } from '../../util/fs';

type KeyValueStore = { [key: string]: string };

interface ActualInstalledDependencies {
  devDependencies: KeyValueStore;
  dependencies: KeyValueStore;
}

/**
 * Automatically installs missing
 * packages or with a different
 * version
 */
export async function autoInstallMissingPackages(rootDir: string) {
  const localPackageJsonPath = path.join(rootDir, 'package.json');
  const { devDependencies = {}, dependencies = {} } =
    readFileAsJSON(localPackageJsonPath);
  const {
    devDependencies: actualDevDependencies = {},
    dependencies: actualDependencies = {},
  } = getInstalledDependencies({ rootDir });

  const devDepsInstallationString = getDependenciesInstallationString({
    expectedDependencies: devDependencies,
    actualDependencies: actualDevDependencies,
  });
  const depsInstallationString = getDependenciesInstallationString({
    expectedDependencies: dependencies,
    actualDependencies,
  });

  if (depsInstallationString) {
    await execCmd(`npm install -S ${depsInstallationString}`, {
      workingDirectory: rootDir,
      redirectIo: true,
    });
  }
  if (devDepsInstallationString) {
    await execCmd(`npm install -D ${devDepsInstallationString}`, {
      workingDirectory: rootDir,
      redirectIo: true,
    });
  }
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
 * (and the version matches)
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
          let actualVersion = 'not_specified';
          try {
            actualVersion = readFileAsJSON(
              path.join(depPath, 'package.json'),
            ).version;
          } catch (e) {}
          // Version missmatch
          if (!version.includes(actualVersion)) {
            return obj;
          }
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

interface CreateOrUpdatePackageJSONParams {
  expectedDependencies?: { [key: string]: string };
  expectedDevDependencies?: { [key: string]: string };
  rootDir: string;
  workspaces?: string[];
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

/** Creates a package.json file if none exists.
 * Sets the dependencies in that file
 * accordingly
 */
export async function createOrUpdatePackageJSON({
  rootDir,
  expectedDependencies,
  expectedDevDependencies,
  workspaces,
}: CreateOrUpdatePackageJSONParams) {
  // Install/update dependencies
  // Add dependencies
  const localPackageJsonPath = path.join(rootDir, 'package.json');
  const doesExist = existsSync(localPackageJsonPath);
  if (!doesExist) {
    await execCmd('yarn init -y', { workingDirectory: rootDir });
  }
  let currentpackageJsonContent = readFileAsJSON(localPackageJsonPath);
  let newPackageJsonContent = {
    ...currentpackageJsonContent,
  };
  let devDependencies = {
    ...expectedDevDependencies,
    ...currentpackageJsonContent.devDependencies,
  };
  if (Object.keys(devDependencies).length) {
    newPackageJsonContent.devDependencies = devDependencies;
  }
  let dependencies = {
    ...expectedDependencies,
    ...currentpackageJsonContent.dependencies,
  };

  if (Object.keys(dependencies).length) {
    newPackageJsonContent.dependencies = dependencies;
  }
  if (
    workspaces &&
    (!newPackageJsonContent.workspaces ||
      Array.isArray(newPackageJsonContent.workspaces))
  ) {
    newPackageJsonContent = {
      ...newPackageJsonContent,
      workspaces,
    };
  } else if (workspaces) {
    newPackageJsonContent = {
      ...newPackageJsonContent,
      workspaces: {
        ...newPackageJsonContent.workspaces,
        packages: workspaces,
      },
    };
  }
  writeJson(localPackageJsonPath, newPackageJsonContent);
}
