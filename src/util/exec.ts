import { spawn } from 'child_process';
import path from 'path';
import getGlobalConfig from '../cantara-config';

interface ExecOptions {
  /** Defaults to current process.cwd() */
  workingDirectory?: string;
  /** Redirect stdin and stdio to current process */
  redirectIo?: boolean;
  /** If set to true, variables defined in user's .secrets.json
   * file are set as env vars for this command
   */
  withSecrets?: boolean;
}

/** Execute commands in different contexts and
 * with different folders in PATH.
 */
export default function execCmd(
  cmd: string,
  {
    workingDirectory = process.cwd(),
    redirectIo,
    withSecrets,
  }: ExecOptions = {},
) {
  const globalCantaraConfig = getGlobalConfig();
  return new Promise((resolve, reject) => {
    const localNodeModulesBinPath =
      globalCantaraConfig.internalPaths.root +
      path.sep +
      'node_modules' +
      path.sep +
      '.bin';
    const localNodeModulesAlreadyInPath = (process.env.PATH || '').includes(
      localNodeModulesBinPath,
    );
    const NEW_PATH_ENV = localNodeModulesAlreadyInPath
      ? process.env.PATH
      : process.env.PATH + path.delimiter + localNodeModulesBinPath;

    const secretsEnvVars = withSecrets
      ? globalCantaraConfig.runtime.secrets
      : {};

    const options = {
      cwd: workingDirectory,
      env: {
        ...process.env,
        ...secretsEnvVars,
        PATH: NEW_PATH_ENV,
      },
    };

    const [programCmd, ...params] = cmd.split(' ');

    const newProcess = spawn(programCmd, params, {
      ...options,
      shell: true,
      stdio: redirectIo ? 'inherit' : 'ignore',
    });
    newProcess.on('close', resolve);
    newProcess.on('exit', resolve);
    newProcess.on('disconnect', resolve);
  });
}
