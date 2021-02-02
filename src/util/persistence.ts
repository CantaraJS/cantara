import { existsSync, writeFileSync } from 'fs';
import path from 'path';
import { readFileAsJSON } from './fs';
import { CantaraPersistenceData, CantaraProjectPersistenceData } from './types';

const PERSISTENCE_DATA_FILE_NAME = 'cantara-persistance.json';

export function readCantaraPersistentData(
  tempFolder: string,
): CantaraPersistenceData | null {
  const filePath = path.join(tempFolder, PERSISTENCE_DATA_FILE_NAME);
  if (existsSync(filePath)) {
    return readFileAsJSON(filePath);
  }
  return null;
}

interface AddProjectPathToPersistentDataParams {
  tempFolder: string;
  data: CantaraProjectPersistenceData;
}

export function writeProjectPersistenData({
  tempFolder,
  data: projectData,
}: AddProjectPathToPersistentDataParams) {
  let data = readCantaraPersistentData(tempFolder);
  if (data === null) {
    data = {
      projects: [projectData],
    };
  }

  const foundProject = data.projects.find(
    (project) => project.rootPath === projectData.rootPath,
  );
  if (!foundProject) {
    data.projects = [...data.projects, projectData];
  } else {
    foundProject.linkedPackages = [
      ...new Set([
        ...projectData.linkedPackages,
        ...foundProject.linkedPackages,
      ]),
    ];
  }

  writeFileSync(
    path.join(tempFolder, PERSISTENCE_DATA_FILE_NAME),
    JSON.stringify(data),
  );

  return data;
}

interface AddLiveLinkPackagePathParams {
  tempFolder: string;
  /**
   * Absolute path to current project
   */
  projectPath: string;
  liveLinkPackagePath: string;
}

export function addLiveLinkPackagePath({
  liveLinkPackagePath,
  tempFolder,
  projectPath,
}: AddLiveLinkPackagePathParams) {
  return writeProjectPersistenData({
    tempFolder,
    data: {
      linkedPackages: [liveLinkPackagePath],
      rootPath: projectPath,
    },
  });
}
