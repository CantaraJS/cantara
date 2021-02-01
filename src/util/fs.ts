import {
  readFileSync,
  writeFileSync,
  readFile,
  exists,
  writeFile,
  readdir,
} from 'fs';
import { promisify } from 'util';

export function readFileAsJSON(path: string) {
  return JSON.parse(readFileSync(path).toString());
}

export function writeJson(path: string, content: any) {
  const prettyPrintedJson = JSON.stringify(content, null, 2);
  writeFileSync(path, prettyPrintedJson);
}

export const fsReadFile = promisify(readFile);
export const fsExists = promisify(exists);
export const fsReaddir = promisify(readdir);
export const fsWriteFile = promisify(writeFile);
