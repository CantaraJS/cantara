import execCmd from '../../util/exec';
import { getChangedAppNames } from './util';
import getGlobalConfig from '../../cantara-config/global-config';

/** Returns a list of applications
 * which changed based on Lerna
 */
async function getChangedApps() {
  const { projectDir } = getGlobalConfig();

  const changedAppNames = (await getChangedAppNames(projectDir)).map(
    res => res.name,
  );

  return changedAppNames;
}

interface ExecUserCmdForChangedAppParams {
  appnames: string[];
}

/**
 * Executes an arbitrary command
 * if one of the the specified
 * applications changed
 */
export default async function execCmdIfAppsChanged({
  appnames,
}: ExecUserCmdForChangedAppParams) {
  const { projectDir, additionalCliOptions: userCmd } = getGlobalConfig();

  const changedAppNames = await getChangedApps();
  const didChange = !!appnames.find(appname =>
    changedAppNames.includes(appname),
  );

  if (didChange) {
    await execCmd(userCmd, {
      workingDirectory: projectDir,
      redirectIo: true,
    });
  }
}
