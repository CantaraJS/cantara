import path from 'path';
import getGlobalConfig, { getActiveApp } from '../../cantara-config';
import { writeJson } from '../../util/fs';

/** Takes all env vars defined
 * for the current stage and writes them
 * to 'static/.temp/.env.json'
 * so that parts of the application
 * which don't have access to the runtime
 * can read them, e.g. the Jest setup file
 * in the user's project
 */
export function createTempEnvJsonFile() {
  const {
    internalPaths: { temp },
  } = getGlobalConfig();
  try {
    const { env } = getActiveApp();
    const jsonFilePath = path.join(temp, '.env.json');
    writeJson(jsonFilePath, env || {});
  } catch {
    // No app active, skipping this step...
  }
}
