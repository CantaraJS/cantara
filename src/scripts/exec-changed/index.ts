import path from 'path';
import execCmd from '../../util/exec';
import parseDiffSummary from './parseDiffSummary';
import getGlobalConfig from '../../cantara-config';
import { existsSync } from 'fs';
import { readFileAsJSON } from '../../util/fs';
import { getFilesChangedSinceCommit } from './util';

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
    runtime: { projectDir, dotCantaraDir },
    allApps,
  } = getGlobalConfig();

  // Get commit from .cantara/ci.json file
  const cantaraCiFilePath = path.join(dotCantaraDir, 'ci.json');
  let fromCommit = 'HEAD~1';
  if (existsSync(cantaraCiFilePath)) {
    const { fromCommit: fromCommitVal } = readFileAsJSON(cantaraCiFilePath);
    if (fromCommitVal) {
      fromCommit = fromCommitVal;
    }
  }

  // Identify changes between this and latest commit
  const changedFiles = await getFilesChangedSinceCommit({
    fromCommit,
    repoDir: projectDir,
  });

  const changedAppNames = changedFiles
    .map(changedFile => {
      const srcIndex = changedFile.indexOf('src');
      const rootPath = changedFile.slice(0, srcIndex);
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
  appnames: string[];
  userCmd: string;
}

/**
 * Executes an arbitrary command if the specified
 * application changed
 */
export function execUserCmdForChangedApp({
  appnames,
  userCmd,
}: ExecUserCmdForChangedAppParams) {
  const {
    runtime: { projectDir },
  } = getGlobalConfig();
  return executeForChangedApps(async changedAppName => {
    if (appnames.includes(changedAppName)) {
      await execCmd(userCmd, {
        workingDirectory: projectDir,
        redirectIo: true,
      });
    }
  });
}
