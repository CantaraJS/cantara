import { existsSync, mkdirSync, writeFileSync } from 'fs';
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

interface GetProjectPersistentDataParams {
  tempFolder: string;
  rootPath: string;
}

export function getProjectPersistentData({
  tempFolder,
  rootPath,
}: GetProjectPersistentDataParams) {
  const data = readCantaraPersistentData(tempFolder);
  if (!data) return null;
  const foundProject = data.projects.find(
    (project) => project.rootPath === rootPath,
  );
  return foundProject;
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

  data.projects = data.projects.filter(
    (project) => project.rootPath !== projectData.rootPath,
  );
  data.projects = [...data.projects, projectData];

  if (!existsSync(tempFolder)) {
    mkdirSync(tempFolder);
  }

  writeFileSync(
    path.join(tempFolder, PERSISTENCE_DATA_FILE_NAME),
    JSON.stringify(data),
  );

  return projectData;
}
