import { spawn } from 'child_process';
import path from 'path';
import getGlobalConfig from '../cantara-config';

interface CommonOptions {
  /** Defaults to current process.cwd() */
  workingDirectory?: string;
  /** Redirect stdin and stdio to current process */
  redirectIo?: boolean;
  /** If set to true, variables defined in user's .secrets.json
   * file are set as env vars for this command.
   */
}

interface SpawnOptions extends CommonOptions {
  env?: { [key: string]: string | undefined };
}

export function spawnCmd(
  cmd: string,
  { workingDirectory, redirectIo, env = {} }: SpawnOptions = {},
): Promise<string | number> {
  return new Promise((resolve, reject) => {
    const options = {
      cwd: workingDirectory,
      env: {
        ...process.env,
        ...env,
      },
    };

    if (
      process.env.NODE_ENV === 'development' &&
      (cmd.startsWith('cantara') || cmd.startsWith('ctra'))
    ) {
      // If Cantara calls itself in development mode
      // it always uses the the TEST_CMD. Therefore,
      // explicitly delete it
      delete options.env.NODE_ENV;
    }

    const [programCmd, ...params] = cmd.split(' ');

    let retData = '';
    const newProcess = spawn(programCmd, params, {
      ...options,
      shell: true,
      stdio: redirectIo ? 'inherit' : undefined,
    });

    function onExit(exitCode: number) {
      if (exitCode === 0) {
        resolve(retData);
      } else {
        reject(`Command "${cmd}" failed.`);
      }
    }

    newProcess.stdio.forEach(
      io =>
        io &&
        io.on('data', data => {
          retData += `\n${data.toString()}`;
        }),
    );

    // newProcess.on('close', onExit);
    newProcess.on('exit', onExit);
    newProcess.on('error', e => {
      reject(e);
    });
    // newProcess.on('disconnect', onExit);
  });
}

interface ExecOptions extends CommonOptions {
  withSecrets?: boolean;
}

/**
 * Retrieved paths of folder which should
 * be added to PATH during this session.
 * Like this, commands can be executed
 * directly from the node_modules folder.
 * Same technique as npm run-scripts uses.
 * Add the following node_modules/.bin
 * folders to PATH:
 * - Cantara's node_modules
 * - The user's project node_modules
 */
function getCurrentPATH() {
  const globalCantaraConfig = getGlobalConfig();

  const getNodeModulesBinPath = (folderWithNodeModules: string) => {
    return (
      folderWithNodeModules + path.sep + 'node_modules' + path.sep + '.bin'
    );
  };

  const localNodeModulesBinPath = getNodeModulesBinPath(
    globalCantaraConfig.internalPaths.root,
  );
  const userProjectNodeModulesBinPath = getNodeModulesBinPath(
    globalCantaraConfig.runtime.projectDir,
  );

  let newPathEnv = process.env.PATH || '';

  const pathsToAdd = [localNodeModulesBinPath, userProjectNodeModulesBinPath];
  for (const pathToAdd of pathsToAdd) {
    if (!newPathEnv.includes(pathToAdd)) {
      newPathEnv += path.delimiter + pathToAdd;
    }
  }
  return newPathEnv;
}

/** Execute commands in different contexts and
 * with different folders in PATH.
 */
export default async function execCmd(
  cmd: string,
  {
    workingDirectory = process.cwd(),
    redirectIo,
    withSecrets,
  }: ExecOptions = {},
) {
  const globalCantaraConfig = getGlobalConfig();
  const NEW_PATH_ENV = getCurrentPATH();

  const secretsEnvVars = withSecrets ? globalCantaraConfig.runtime.secrets : {};

  const options: SpawnOptions = {
    workingDirectory,
    env: {
      ...secretsEnvVars,
      PATH: NEW_PATH_ENV || '',
    },
    redirectIo,
  };

  return spawnCmd(cmd, options);
}
