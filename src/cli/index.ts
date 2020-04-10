import yargs from 'yargs';

import { AutoComplete, StringPrompt } from 'enquirer';

import {
  setupErrorHandling,
  loadEnv,
  setupCliContext,
  getProjectPath,
} from './util';
import getGlobalConfig, {
  loadCantaraGlobalConfig,
} from '../cantara-config/global-config';
import { loadCantaraRuntimeConfig } from '../cantara-config/runtime-config';

import prepareCantaraProject from '../prepare-project';
import clearConsole from '../util/clearConsole';
import allCliCommands from './commands';
import { isCantaraProject } from '../cantara-config';

const packageJson = require('../../package.json');

export default async function setupCliInterface() {
  if (process.env.NODE_ENV === 'development') {
    clearConsole();
  }

  loadEnv();
  const projectDir = getProjectPath();
  setupErrorHandling();
  setupCliContext();

  const isCwdCantaraProject = isCantaraProject(projectDir);

  const TEST_CMD = (process.env.DEV_CANTARA_COMMAND || '').split(' ');
  let cmdToUse =
    process.env.NODE_ENV === 'development' ? TEST_CMD : process.argv.slice(2);

  cmdToUse = cmdToUse.filter(Boolean);

  const availableCommands = allCliCommands.filter(command => {
    const { needsGlobalConfig = true } = command.configuration;
    if (needsGlobalConfig && !isCwdCantaraProject) {
      return false;
    }
    if (isCwdCantaraProject && !needsGlobalConfig) {
      return false;
    }
    return true;
  });

  if (cmdToUse.length === 0) {
    const cmdChoices = availableCommands.map(cmd => cmd.name);
    const prompt = new AutoComplete({
      name: 'Command',
      message: 'Which command do you want to execute?',
      initial: 0,
      choices: cmdChoices,
    });
    let newCmd = await prompt.run();
    const foundCmdObj = availableCommands[prompt.index];
    if (foundCmdObj.parameters) {
      const prompt = new StringPrompt({
        message: `Type in paramater for command ${foundCmdObj.name}: ${foundCmdObj.parameters}`,
        footer: '(leave empty for none)',
      });
      const params = await prompt.run();
      if (params) {
        newCmd = `${newCmd} ${params}`;
      }
    }
    cmdToUse = newCmd.split(' ');
  }

  for (const command of availableCommands) {
    let cmd = command.name;
    const {
      needsActiveApp,
      needsGlobalConfig = true,
      appTypes = [],
      retrieveAdditionalCliParams,
    } = command.configuration;

    if (needsActiveApp) {
      cmd = `${cmd} [appname]`;
    }
    if (command.parameters) [(cmd = `${cmd} ${command.parameters}`)];
    let additionalCliOptions = cmdToUse.slice(2).join(' ');
    if (needsGlobalConfig) {
      await loadCantaraGlobalConfig({ projectDir, additionalCliOptions });
    }
    yargs.command(
      cmd,
      command.description,
      yargs => {
        if (needsActiveApp) {
          const { allApps } = getGlobalConfig();
          const filteredApps =
            appTypes.length === 0
              ? allApps
              : allApps.filter(app => appTypes.includes(app.type));
          const availableAppNames = filteredApps.map(app => app.name);
          yargs
            .positional('appname', {
              describe: 'Name of the app (foldername)',
              type: 'string',
              choices: availableAppNames,
            })
            .option('stage', {
              alias: 's',
              type: 'string',
              describe: `Current stage, e.g. development, production or something custom. Environment variables are chosen based on the currently set stage.`,
            });
        }
      },
      async args => {
        if (needsActiveApp) {
          const globalConfig = getGlobalConfig();
          const { allApps } = globalConfig;
          const filteredApps =
            appTypes.length === 0
              ? allApps
              : allApps.filter(app => appTypes.includes(app.type));
          const availableAppNames = filteredApps.map(app => app.name);

          let appname = args.appname as string | undefined;
          if (!appname) {
            const prompt = new AutoComplete({
              name: 'Appname',
              message: 'Pick an application',
              initial: 0,
              choices: availableAppNames,
            });
            appname = await prompt.run();
          }

          if (retrieveAdditionalCliParams && !additionalCliOptions) {
            const prompt = new StringPrompt({
              message: retrieveAdditionalCliParams.message,
            });
            additionalCliOptions = await prompt.run();
          }

          globalConfig.additionalCliOptions = additionalCliOptions;

          await loadCantaraRuntimeConfig({
            stage: 'not_set',
            currentCommand: {
              name: 'dev',
              appname,
            },
          });
          await prepareCantaraProject();
        }
        await Promise.resolve(
          command.execute({
            ...args,
            projectDir,
          }),
        );
      },
    );
  }

  yargs
    // TODO: Update version in PackageJSON using semantic release
    .version(packageJson.version)
    .parse(cmdToUse);
}
