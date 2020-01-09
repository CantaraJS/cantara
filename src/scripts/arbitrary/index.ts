import getGlobalConfig from '../../cantara-config';
import execCmd from '../../util/exec';
import allNpmCommands from './npmCommands';

/**
 * This function is executed if no cantara command
 * was matched. First, look if it is an NPM command.
 * If not, try to execute it as an arbitrary command
 * with the package's/app's root as the CWD.
 */
export default function executeArbitraryCmdWithinApp(args: string[]) {
  const { allApps } = getGlobalConfig();
  const [appName, cmd, ...params] = args;
  const foundApp = allApps.find(app => app.name === appName);
  if (!foundApp) throw new Error(`App/package "${foundApp}" does not exist!`);

  const isNpmCommand = allNpmCommands.includes(cmd);
  let cmdToExecute = '';
  if (isNpmCommand) {
    cmdToExecute = `npm ${cmd} ${params.join(' ')} --color always`;
  } else {
    cmdToExecute = `${cmd} ${params.join(' ')}`;
  }

  execCmd(cmdToExecute, {
    workingDirectory: foundApp.paths.root,
    withSecrets: true,
    redirectIo: true,
  });
}
