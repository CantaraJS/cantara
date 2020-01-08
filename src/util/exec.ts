import { exec } from 'child_process';
import path from 'path';
import getGlobalConfig from '../config';

interface ExecOptions {
  /** Defaults to current process.cwd() */
  workingDirectory?: string;
  /** Redirect stdin and stdio to current process */
  redirectIo?: boolean;
}

/** Execute commands in different contexts and
 * with different folders in PATH.
 */
export default function execCmd(
  cmd: string,
  { workingDirectory = process.cwd(), redirectIo }: ExecOptions = {},
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

    const newProcess = exec(
      cmd,
      { cwd: workingDirectory, env: { ...process.env, PATH: NEW_PATH_ENV } },
      (err, stdout, stderr) => {
        if (err) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      },
    );

    if (redirectIo && newProcess.stdout && newProcess.stderr) {
      newProcess.stdout.pipe(process.stdout);
      newProcess.stderr.pipe(process.stderr);
    }
  });
}
