import execCmd from './exec';

/**
 * Returns changed app names
 * based on Lerna
 */
export async function getChangedAppNames(
  projectDir: string,
  allAppNames: string[],
) {
  type LernaChangedCmdRetType = { name: string; version: string }[];

  let cmdRes: any;
  try {
    cmdRes = (
      await execCmd('lerna changed --json --all --loglevel silent', {
        workingDirectory: projectDir,
      })
    ).toString();
  } catch {
    // lerna has non zero exit code, if there are no changes, set to empty array to work around this
    cmdRes = '[]';
  }

  let changedAppNames: LernaChangedCmdRetType = [];
  try {
    changedAppNames = JSON.parse(cmdRes.toString());
  } catch {
    // Remove first two lines, as for some reason an info message is sometimes shown
    // info
    // cli using local version of lerna

    cmdRes = cmdRes.split('\n').slice(3).join('\n').trim();
    try {
      changedAppNames = JSON.parse(cmdRes.toString());
    } catch {
      // In worst case return all app names
      console.log(
        'Failed detecting changes using Lerna. Marking all apps as changed...',
      );
      return allAppNames.map((name) => ({ name, version: '0.0.0' }));
    }
  }
  return changedAppNames;
}
