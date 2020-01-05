import path from 'path';
import { existsSync, readFileSync } from 'fs';
import execCmd from '../util/exec';

interface CreateOrUpdatePackageJSONParams {
  expectedDependencies: { [key: string]: string };
  rootDir: string;
}

/** Updates/installs the specified dependecies in the
 * specified folder. Creates a package.json if none exists.
 */
export async function createOrUpdatePackageJSON({
  rootDir,
  expectedDependencies,
}: CreateOrUpdatePackageJSONParams) {
  // Install/update dependencies
  const localPackageJsonPath = path.join(rootDir, 'package.json');
  if (existsSync(localPackageJsonPath)) {
    // Look if dependencies need to be updated
    type KeyValueStore = { [key: string]: string };
    const { dependencies }: { dependencies: KeyValueStore } = JSON.parse(
      readFileSync(localPackageJsonPath).toString(),
    );
    const dependenciesToInstall = Object.keys(expectedDependencies)
      .reduce((depsStr, depName) => {
        const appDependencyVersion = dependencies[depName];
        const expectedVersion = expectedDependencies[depName];
        if (expectedVersion && expectedVersion !== appDependencyVersion) {
          return `${depName}@${expectedVersion} ${depsStr}`;
        }
        return depsStr;
      }, '')
      .trim();
    if (dependenciesToInstall) {
      await execCmd(`npm install -S ${dependenciesToInstall}`, {
        workingDirectory: rootDir,
        redirectIo: true,
      });
    }
  } else {
    // Create new packageJSON and install dependencies
    await execCmd(`npm init -y`, {
      workingDirectory: rootDir,
    });
    const dependenciesToInstall = Object.keys(expectedDependencies)
      .reduce((depsStr, depName) => {
        return `${depName}@${expectedDependencies[depName]} ${depsStr}`;
      }, '')
      .trim();
    await execCmd(`npm install -S ${dependenciesToInstall}`, {
      workingDirectory: rootDir,
      redirectIo: true,
    });
  }
}
