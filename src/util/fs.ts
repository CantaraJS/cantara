import { readFileSync } from 'fs';

export function readFileAsJSON(path: string) {
  return JSON.parse(readFileSync(path).toString());
}
