import path from 'path';
import slash from 'slash';
import { readFileAsJSON } from './fs';
import { CantaraApplication, LiveLinkedPackage } from './types';

export function linkedPackagesToWebpackAliases(
  linkedPackages: LiveLinkedPackage[],
) {
  const linkedPackagesAliases = linkedPackages.reduce((newObj, currPackage) => {
    const packageJsonPath = path.join(currPackage.packageRoot, 'package.json');
    const { name } = readFileAsJSON(packageJsonPath);
    const packageSrcPath = slash(path.join(currPackage.packageRoot, 'src'));
    return {
      ...newObj,
      [name]: packageSrcPath,
    };
  }, {}) as { [key: string]: string };

  return linkedPackagesAliases;
}

interface GetNodeModulesResolvingOrderParams {
  linkedPackages: LiveLinkedPackage[];
  cantaraNodeModulesPath: string;
  activeApp: CantaraApplication;
  projectRoot: string;
}

/**
 * Creates an array of 'node_module' folder
 * paths which represent the order in which
 * modules will get resolved by webpack
 * Modules resolving oder:
 * - App 'node_modules' folder
 * - Project's 'node_modules' folder
 * - Cantara (CLI package) 'node_modules' folder
 * - Currently linked package's 'node_modules' folder
 * - Currently linked package root (project) 'node_modules' folder
 * - Fallback 'node_modules' relative folder (which will traverse up to Cantara's modules folder)
 */
export function getNodeModulesResolvingOrder({
  activeApp,
  cantaraNodeModulesPath,
  projectRoot,
  linkedPackages,
}: GetNodeModulesResolvingOrderParams) {
  const appNodeModules = path.join(activeApp.paths.root, 'node_modules');

  const projectRootNodeModules = path.join(projectRoot, 'node_modules');

  const linkedPackagesNodeModules = linkedPackages
    .map((currPackage) => {
      const packageNodeModules = path.join(
        currPackage.packageRoot,
        'node_modules',
      );
      const projectNodeModules = path.join(
        currPackage.packageRoot,
        'node_modules',
      );
      return [packageNodeModules, projectNodeModules];
    })
    .flat();

  const resolve = [
    appNodeModules,
    cantaraNodeModulesPath,
    projectRootNodeModules,
    ...linkedPackagesNodeModules,
    'node_modules',
  ];

  return resolve;
}

export function linkedPackagesToWebpackInclude(
  linkedPackages: LiveLinkedPackage[],
) {
  return linkedPackages.map((currPackage) => {
    return path.join(currPackage.packageRoot, 'src');
  });
}
