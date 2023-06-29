import path from 'path';
import prettier from 'prettier';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import {
  createFileFolderIfNotExists,
  fsExists,
  fsReadFile,
  fsUnlink,
  fsWriteFile,
} from '../../util/fs';
import { CantaraApplication } from '../../util/types';

/**
 * Generates a TS file which exports
 * the currently active runtime preset
 * if present. Otherwise, an empty object
 * is exported.
 * Only applicable if a `presets` folder
 * exists inside the application folder
 */
export async function generateRuntimePresetCode(app: CantaraApplication) {
  const {
    activeRuntimeApplicationPresetName,
    currentCommand: { app: runningApp },
  } = getRuntimeConfig();

  if (runningApp.name != app.name) {
    //update presets only for the current running app, because otherwise activeRuntimeApplicationPresetName is of wrong app
    return;
  }

  if (!(await fsExists(app.paths.runtimePresets))) {
    // Remove runtimePresetEntry index file if it exists
    // but not more app presets
    if (await fsExists(app.paths.runtimePresetEntry)) {
      await fsUnlink(app.paths.runtimePresetEntry);
    }
    return;
  }

  let loadedRuntimePreset = '{}';

  const runtimePresetFilePath = path.join(
    app.paths.runtimePresets,
    `${activeRuntimeApplicationPresetName}.json`,
  );

  if (await fsExists(runtimePresetFilePath)) {
    loadedRuntimePreset = (await fsReadFile(runtimePresetFilePath)).toString();
  }

  let code = `
    const appRuntimePreset = ${loadedRuntimePreset};

    export default appRuntimePreset;
  `;

  code = prettier.format(code, {
    parser: 'babel',
  });

  await createFileFolderIfNotExists(app.paths.runtimePresetEntry);

  await fsWriteFile(app.paths.runtimePresetEntry, code);
}
