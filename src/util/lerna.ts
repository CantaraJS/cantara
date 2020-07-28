import execCmd from './exec';

/**
 * Returns changed app names
 * based on Lerna
 */
export async function getChangedAppNames(projectDir: string) {
  type LernaChangedCmdRetType = { name: string; version: string }[];

  let cmdRes = (
    await execCmd('lerna changed --json --all --loglevel silent', {
      workingDirectory: projectDir,
    })
  ).toString();

  let changedAppNames: LernaChangedCmdRetType = [];
  try {
    changedAppNames = JSON.parse(cmdRes.toString());
  } catch {
    // Remove first two lines, as for some reason an info message is sometimes shown
    // info
    // cli using local version of lerna

    cmdRes = cmdRes.split('\n').slice(3).join('\n').trim();

    changedAppNames = JSON.parse(cmdRes.toString());
  }
  return changedAppNames;
}
