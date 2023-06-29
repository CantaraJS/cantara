import yargs from 'yargs';

import {
  setupErrorHandling,
  loadEnv,
  setupCliContext,
  getProjectPath,
  loadPackageJson,
  checkForUpdates,
} from './util';

import clearConsole from '../util/clearConsole';
import allCliCommands from './commands';
import { isCantaraProject } from '../cantara-config';
import buildYargsCommands from './yargs';

export default async function setupCliInterface() {
  if (process.env.NODE_ENV === 'development') {
    // Make sure deprecation warnings show stack trace
    console.log('Tracing depreactions...');
    process.traceDeprecation = true;
    //clearConsole();
    // Load envs from .env for development
    loadEnv();
  }

  // User's project path
  const projectDir = getProjectPath();
  setupErrorHandling();
  setupCliContext();

  const isCwdCantaraProject = isCantaraProject(projectDir);

  const TEST_CMD = (process.env.DEV_CANTARA_COMMAND || '').split(' ');
  let cmdToUse =
    process.env.NODE_ENV === 'development' ? TEST_CMD : process.argv.slice(2);

  cmdToUse = cmdToUse.filter(Boolean);

  // Determine commands which can be executed in current folder.
  const availableCommands = allCliCommands.filter((command) => {
    const { needsGlobalConfig = true } = command.configuration;
    if (needsGlobalConfig && !isCwdCantaraProject) {
      return false;
    }
    if (isCwdCantaraProject && !needsGlobalConfig) {
      return false;
    }
    return true;
  });

  // If no command was specified, build command
  // with interactive UI
  if (cmdToUse.length === 0) {
    const { cantaraInteractiveMode } = await import('./interactive');
    const newCmd = await cantaraInteractiveMode({ availableCommands });
    cmdToUse = newCmd.split(' ');
  }

  await buildYargsCommands({
    availableCommands,
    cmdToUse,
    projectDir,
    yargs,
  });

  const packageJson = await loadPackageJson();
  checkForUpdates(packageJson);

  yargs.version(packageJson.version).parse(cmdToUse);
}
