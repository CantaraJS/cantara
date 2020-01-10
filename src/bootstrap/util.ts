import path from 'path';
import { existsSync, readFileSync } from 'fs';
import execCmd from '../util/exec';

interface CreateOrUpdatePackageJSONParams {
  expectedDependencies: { [key: string]: string };
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
    const { dependencies }: { dependencies: KeyValueStore } = JSON.parse(
      readFileSync(localPackageJsonPath).toString(),
    );
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
    if (expectedDevDependencies) {
      const devDependenciesToInstall = getDependenciesInstallationString({
        expectedDependencies: expectedDevDependencies,
        actualDependencies: dependencies,
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

interface RenderTemplateOptions {
  template: string;
  variables: { [key: string]: string | number | boolean };
}
/** Takes a template and variables in the form of "<--VARIABLE_NAME-->" and replaces
 * all variables with the values passed */
export function renderTemplate({ template, variables }: RenderTemplateOptions) {
  const variablesNames = Object.keys(variables);
  let renderedTemplate = template;
  for (const varName of variablesNames) {
    const varValue = variables[varName];
    const replaceVal = `<--${varName}-->`;
    renderedTemplate = renderedTemplate.replace(
      new RegExp(replaceVal, 'g'),
      varValue.toString(),
    );
  }

  return renderedTemplate;
}
