import {
  readFileSync,
  writeFileSync,
  readFile,
  exists,
  writeFile,
  readdir,
  unlink,
  mkdir,
} from 'fs';
import path from 'path';
import { promisify } from 'util';

export function readFileAsJSON(path: string) {
  return JSON.parse(readFileSync(path).toString());
}

export function writeJson(path: string, content: any) {
  const prettyPrintedJson = JSON.stringify(content, null, 2);
  writeFileSync(path, prettyPrintedJson);
}

/**
 * Creates file with folder structure
 * if it doesn't exist yet
 */
export async function createFileFolderIfNotExists(filePath: string) {
  const folderPath = path.dirname(filePath);
  if (!(await fsExists(folderPath))) {
    await fsMkdir(folderPath, { recursive: true });
  }
}

export const fsReadFile = promisify(readFile);
export const fsExists = promisify(exists);
export const fsReaddir = promisify(readdir);
export const fsWriteFile = promisify(writeFile);
export const fsUnlink = promisify(unlink);
export const fsMkdir = promisify(mkdir);
