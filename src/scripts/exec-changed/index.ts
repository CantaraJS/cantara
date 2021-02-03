import execCmd from '../../util/exec';
import getGlobalConfig from '../../cantara-config/global-config';
import { getChangedAppNames } from '../../util/lerna';

/** Returns a list of applications
 * which changed based on Lerna
 */
async function getChangedApps() {
  const { projectDir, allApps } = getGlobalConfig();

  const changedAppNames = (
    await getChangedAppNames(
      projectDir,
      allApps.map((app) => app.name),
    )
  ).map((res) => res.name);

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
  const didChange = !!appnames.find((appname) =>
    changedAppNames.includes(appname),
  );

  if (didChange) {
    await execCmd(userCmd, {
      workingDirectory: projectDir,
      redirectIo: true,
    });
  }
}
