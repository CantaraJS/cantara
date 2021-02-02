import { statSync } from 'fs';
import path from 'path';
import slash from 'slash';
import { fsExists, fsReaddir, fsReadFile, readFileAsJSON } from './fs';
import {
  CantaraApplication,
  CantaraPersistenceData,
  LiveLinkedPackageSuggestion,
} from './types';

export function linkedPackagesToWebpackAliases(linkedPackages: string[]) {
  const linkedPackagesAliases = linkedPackages.reduce((newObj, currPackage) => {
    const packageJsonPath = path.join(currPackage, 'package.json');
    const { name } = readFileAsJSON(packageJsonPath);
    const packageSrcPath = slash(path.join(currPackage, 'src'));
    return {
      ...newObj,
      [name]: packageSrcPath,
    };
  }, {}) as { [key: string]: string };

  return linkedPackagesAliases;
}

interface GetNodeModulesResolvingOrderParams {
  linkedPackages: string[];
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
      const packageNodeModules = path.join(currPackage, 'node_modules');
      const projectNodeModules = path.join(currPackage, '../../node_modules');
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

export function linkedPackagesToWebpackInclude(linkedPackages: string[]) {
  return linkedPackages.map((currPackage) => {
    return path.join(currPackage, 'src');
  });
}

interface GetAllLiveLinkPackagesParams {
  persistanceData: CantaraPersistenceData;
  /**
   * Cantara project in which the command
   * was executed. Needed in order to
   * not live link packages from own packages
   * folder.
   */
  projectDir: string;
}

/**
 * Returns a list of all Cantara packages
 * which could be live linked
 */
export async function getAllLiveLinkPackageSuggestions({
  persistanceData,
  projectDir,
}: GetAllLiveLinkPackagesParams) {
  const liveLinkPackages: LiveLinkedPackageSuggestion[] = [];
  const allProjectPaths = persistanceData.projects.map(
    (project) => project.rootPath,
  );
  const projectPersistanceData = persistanceData.projects.find(
    (project) => project.rootPath === projectDir,
  );
  const alreadyLinkedPackages = projectPersistanceData
    ? projectPersistanceData.linkedPackages
    : [];
  for (const projectPath of allProjectPaths) {
    if (projectPath === projectDir) {
      continue;
    }
    const packagesFolderPath = path.join(projectPath, 'packages');
    if (!(await fsExists(packagesFolderPath))) {
      continue;
    }
    let allPackagesFolder = await fsReaddir(packagesFolderPath);
    allPackagesFolder = allPackagesFolder
      .map((pName) => path.join(packagesFolderPath, pName))
      .filter((fullPath) => statSync(fullPath).isDirectory());
    for (const packageFolder of allPackagesFolder) {
      const packageJsonPath = path.join(packageFolder, 'package.json');
      if (!(await fsExists(packageJsonPath))) {
        continue;
      }
      const { name: packageName } = JSON.parse(
        (await fsReadFile(packageJsonPath)).toString(),
      );
      if (!alreadyLinkedPackages.includes(packageFolder)) {
        liveLinkPackages.push({
          packageName: packageName,
          packageRoot: packageFolder,
          projectRoot: projectPath,
        });
      }
    }
  }

  return liveLinkPackages;
}
