import getGlobalConfig, { getActiveApp } from '../../cantara-config';
import execCmd from '../../util/exec';
import allNpmCommands from './npmCommands';

/**
 * This function is executed if no cantara command
 * was matched. First, look if it is an NPM command.
 * If not, try to execute it as an arbitrary command
 * with the package's/app's root as the CWD.
 */
export default function executeArbitraryCmdWithinApp(
  originalCommand: string[],
) {
  const [, , cmd, ...params] = originalCommand;
  const activeApp = getActiveApp();

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
  });
}
