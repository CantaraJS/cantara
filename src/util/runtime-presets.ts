import { readdirSync, statSync } from 'fs';
import path from 'path';
import { CantaraApplication } from './types';

export function getAllRuntimePresetNames(app: CantaraApplication) {
  return readdirSync(app.paths.runtimePresets)
    .filter((presetName) => {
      const fullPath = path.join(app.paths.runtimePresets, presetName);
      return statSync(fullPath).isFile();
    })
    .map((presetName) => presetName.slice(0, presetName.lastIndexOf('.')));
}
