import path from 'path';
import execCmd from '../../util/exec';
import parseDiffSummary from './parseDiffSummary';
import getGlobalConfig from '../../cantara-config';
import { CantaraApplication } from '../../util/types';

type ExecChangeCallback = (changedAppName: string) => Promise<void>;

/** Executes a function for all
 * applications/packages whose code
 * has changed since the last commit.
 * Accepts a function as a parameter
 * which gets executed with the name
 * of the app that changed as it's first
 * parameter
 */
export default async function executeForChangedApps(cb: ExecChangeCallback) {
  const {
    runtime: { projectDir },
    allApps,
  } = getGlobalConfig();

  const res = await execCmd('git diff --stat', {
    workingDirectory: projectDir,
  });
  const diffSum = parseDiffSummary(res.toString(), projectDir);
  const changedAppNames = diffSum
    .map(changeObj => {
      if (!changeObj) return false;
      const srcIndex = changeObj.file.indexOf('src');
      const rootPath = changeObj.file.slice(0, srcIndex);
      const name = path.basename(rootPath);
      // Only include apps that exist
      const foundApp = allApps.find(app => app.name === name);
      if (!foundApp) return false;
      return name;
    })
    .filter(Boolean) as string[];
  // Execute cb for each application
  for (const changedAppName of changedAppNames) {
    await cb(changedAppName);
  }
}

interface ExecUserCmdForChangedAppParams {
  appname: string;
  userCmd: string;
}

/**
 * Executes an arbitrary command if the specified
 * application changed
 */
export function execUserCmdForChangedApp({
  appname,
  userCmd,
}: ExecUserCmdForChangedAppParams) {
  const {
    runtime: { projectDir },
  } = getGlobalConfig();
  return executeForChangedApps(async changedAppName => {
    if (appname === changedAppName) {
      // Exec cmd
      console.log(`"${appname}" changed.\nExecuting "${userCmd}"`);
      await execCmd(userCmd, {
        workingDirectory: projectDir,
        redirectIo: true,
      });
    }
  });
}
