import path from 'path';
import { existsSync } from 'fs';
import { getAllCantaraProjectFolders } from './util';

/** Requires that at least one of the specified folders exist */
function doesOneFolderExist(paths: string[]) {
  const doesOneFolderExist = paths
    .map(folderPath => existsSync(folderPath))
    .includes(true);
  return doesOneFolderExist;
}

export function isCantaraProject(rootDir: string) {
  const {
    nodeAppsRootDir,
    packagesAppsRootDir,
    reactAppsRootDir,
  } = getAllCantaraProjectFolders(rootDir);

  return doesOneFolderExist([
    reactAppsRootDir,
    packagesAppsRootDir,
    nodeAppsRootDir,
  ]);
}
