import {
  readFileSync,
  writeFileSync,
  readFile,
  exists,
  writeFile,
  readdir,
  unlink,
  mkdir,
  existsSync,
} from 'fs';
import path from 'path';
import { promisify } from 'util';

export function readFileAsJSON(path: string) {
  return JSON.parse(readFileSync(path).toString());
}

export function writeJson(path: string, content: any) {
  let jsonLineBreak = '\n';
  if (existsSync(path)) {
    const jsonFileContent = readFileSync(path).toString();
    jsonLineBreak = jsonFileContent.includes('\r\n') ? '\r\n' : '\n';
  }

  let prettyPrintedJson = JSON.stringify(content, null, 2);

  // \n = default for JSON stringify
  if (jsonLineBreak !== '\n') {
    prettyPrintedJson = prettyPrintedJson.replace(
      new RegExp('\n', 'g'),
      jsonLineBreak,
    );
  }

  if (!prettyPrintedJson.endsWith(jsonLineBreak)) {
    prettyPrintedJson += jsonLineBreak;
  }

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
