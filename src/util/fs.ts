import { readFileSync, writeFileSync } from 'fs';

export function readFileAsJSON(path: string) {
  return JSON.parse(readFileSync(path).toString());
}

export function writeJson(path: string, content: any) {
  const prettyPrintedJson = JSON.stringify(content, null, 2);
  writeFileSync(path, prettyPrintedJson);
}
