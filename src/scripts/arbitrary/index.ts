import execCmd from '../../util/exec';
import allNpmCommands from './npmCommands';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import getGlobalConfig from '../../cantara-config/global-config';

/**
 * This function is executed if no cantara command
 * was matched. First, look if it is an NPM command.
 * If not, try to execute it as an arbitrary command
 * with the package's/app's root as the CWD.
 */
export default function executeArbitraryCmdWithinApp() {
  const {
    currentCommand: { app: activeApp },
  } = getRuntimeConfig();

  const { additionalCliOptions } = getGlobalConfig();

  const [cmd, ...params] = additionalCliOptions.split(' ');

  const isNpmCommand = allNpmCommands.includes(cmd);
  let cmdToExecute = '';
  if (isNpmCommand) {
    cmdToExecute = `npm ${cmd} ${params.join(' ')}`;
  } else {
    cmdToExecute = `${cmd} ${params.join(' ')}`;
  }

  execCmd(cmdToExecute, {
    workingDirectory: activeApp.paths.root,
    withSecrets: true,
    redirectIo: true,
    includeAppEnvVars: true,
  });
}
