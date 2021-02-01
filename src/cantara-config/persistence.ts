import { existsSync, writeFileSync } from 'fs';
import path from 'path';
import { readFileAsJSON } from '../util/fs';
import { CantaraPersistenceData } from '../util/types';

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
  /**
   * Absolute path to current project
   */
  projectPath: string;
}

export function addProjectPathToPersistentData({
  tempFolder,
  projectPath,
}: AddProjectPathToPersistentDataParams) {
  let data = readCantaraPersistentData(tempFolder);
  if (data === null) {
    data = {
      projects: [],
    };
  }
  data.projects = [
    ...data.projects.filter((project) => project.rootPath !== projectPath),
    { rootPath: projectPath },
  ];
  writeFileSync(
    path.join(tempFolder, PERSISTENCE_DATA_FILE_NAME),
    JSON.stringify(data),
  );

  return data;
}
