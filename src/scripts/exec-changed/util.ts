import execCmd from '../../util/exec';

/**
 * Returns changed app names
 * based on Lerna
 */
export async function getChangedAppNames(projectDir: string) {
  type LernaChangedCmdRetType = { name: string; version: string }[];

  const cmdRes = await execCmd('lerna changed --json --all --loglevel silent', {
    workingDirectory: projectDir,
  });

  const changedAppNames = JSON.parse(
    cmdRes.toString(),
  ) as LernaChangedCmdRetType;
  return changedAppNames;
}
