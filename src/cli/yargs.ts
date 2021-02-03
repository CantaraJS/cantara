import yargs from 'yargs';
import { CantaraCommand } from './commands';

interface BuildYargsCommandsParams {
  availableCommands: CantaraCommand[];
  cmdToUse: string[];
  projectDir: string;
  yargs: typeof yargs;
}

/**
 * Setup yargs
 */
export default async function buildYargsCommands({
  availableCommands,
  cmdToUse,
  projectDir,
  yargs,
}: BuildYargsCommandsParams) {
  for (const command of availableCommands) {
    let cmd = command.name;
    const {
      needsActiveApp,
      needsGlobalConfig = true,
      needsActiveLiveLink,
      needsLiveLinkSuggestion,
      appTypes = [],
      retrieveAdditionalCliParams,
    } = command.configuration;

    if (needsActiveApp) {
      cmd = `${cmd} [appname]`;
    }

    const isLiveLinkParamNeeded =
      needsActiveLiveLink || needsLiveLinkSuggestion;
    if (isLiveLinkParamNeeded) {
      cmd = `${cmd} [externalCantaraPackage]`;
    }

    if (command.parameters) {
      cmd = `${cmd}${command.parameters
        .map((param) => ` [${param.name}]`)
        .join('')}`;
    }
    let additionalCliOptions = cmdToUse.slice(2).join(' ');
    if (needsGlobalConfig) {
      const { loadCantaraGlobalConfig } = await import(
        '../cantara-config/global-config'
      );
      await loadCantaraGlobalConfig({ projectDir, additionalCliOptions });
    }
    yargs.command(
      cmd,
      command.description,
      async (yargs) => {
        if (command.options) {
          for (const option of command.options) {
            const { name, ...rest } = option;
            yargs.option(name, rest);
          }
        }
        if (command.parameters) {
          for (const cmdParam of command.parameters) {
            yargs.positional(cmdParam.name, {
              describe: cmdParam.description,
              type: 'string',
              ...(cmdParam.choices ? { choices: cmdParam.choices } : {}),
            });
          }
        }
        if (needsActiveApp) {
          const { default: getGlobalConfig } = await import(
            '../cantara-config/global-config'
          );
          const { allApps } = getGlobalConfig();
          const filteredApps =
            appTypes.length === 0
              ? allApps
              : allApps.filter((app) => appTypes.includes(app.type));
          const availableAppNames = filteredApps.map((app) => app.name);
          yargs.positional('appname', {
            describe: 'Name of the app (foldername)',
            type: 'string',
            choices: availableAppNames,
          });
          yargs.option('preset', {
            alias: 'p',
            type: 'string',
            describe: `Runtime preset name inside 'presets' folder`,
            default: 'default',
          });
        }

        if (isLiveLinkParamNeeded) {
          const { default: getGlobalConfig } = await import(
            '../cantara-config/global-config'
          );
          const { liveLinkSuggestions } = getGlobalConfig();
          const availablePackagePaths = liveLinkSuggestions.map(
            (liveLinkPackage) => liveLinkPackage.packageRoot,
          );
          yargs.positional('externalCantaraPackage', {
            describe: 'Path to a package inside another Cantara project',
            type: 'string',
            choices: availablePackagePaths,
          });
        }
      },
      async (args) => {
        const cmdName = args._[0];

        if (isLiveLinkParamNeeded) {
          const { default: getGlobalConfig } = await import(
            '../cantara-config/global-config'
          );
          const globalConfig = getGlobalConfig();
          let { liveLinkSuggestions, projectPersistanceData } = globalConfig;
          if (needsLiveLinkSuggestion) {
            liveLinkSuggestions = liveLinkSuggestions.filter((suggestion) => {
              return !projectPersistanceData.linkedPackages.includes(
                suggestion.packageRoot,
              );
            });
          }
          if (needsActiveLiveLink) {
            liveLinkSuggestions = liveLinkSuggestions.filter((suggestion) => {
              return projectPersistanceData.linkedPackages.includes(
                suggestion.packageRoot,
              );
            });
          }
          if (liveLinkSuggestions.length === 0) {
            throw new Error('No more Live Link packages available!');
          }
          let liveLinkPackagePath = args.externalCantaraPackage as
            | string
            | undefined;
          if (!liveLinkPackagePath) {
            const { chooseLiveLinkPackage } = await import('./interactive');
            liveLinkPackagePath = await chooseLiveLinkPackage(
              liveLinkSuggestions,
            );
          }
          args.liveLinkPackagePath = liveLinkPackagePath;
        }

        if (needsActiveApp) {
          const { default: getGlobalConfig } = await import(
            '../cantara-config/global-config'
          );
          const globalConfig = getGlobalConfig();
          const { allApps } = globalConfig;
          const filteredApps =
            appTypes.length === 0
              ? allApps
              : allApps.filter((app) => appTypes.includes(app.type));
          const availableAppNames = filteredApps.map((app) => app.name);

          let appname = args.appname as string | undefined;
          if (!appname) {
            const { chooseApplication } = await import('./interactive');
            appname = await chooseApplication({ availableAppNames });
          }

          if (retrieveAdditionalCliParams && !additionalCliOptions) {
            const { stringPrompt } = await import('./interactive');
            additionalCliOptions = await stringPrompt({
              message: retrieveAdditionalCliParams.message,
            });
          }

          globalConfig.additionalCliOptions = additionalCliOptions;

          const { default: prepareCantaraProject } = await import(
            '../prepare-project'
          );
          const { loadCantaraRuntimeConfig } = await import(
            '../cantara-config/runtime-config'
          );
          await loadCantaraRuntimeConfig({
            stage: (args.stage as string | undefined) || 'not_set',
            currentCommand: {
              name: cmdName.toString(),
              appname,
            },
            activeRuntimeApplicationPresetName:
              (args.preset as string | undefined) || 'default',
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
  yargs.option('stage', {
    alias: 's',
    type: 'string',
    describe: `Current stage, e.g. development, production or something custom. Environment variables are chosen based on the currently set stage.`,
  });
}
