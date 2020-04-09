import yargs from 'yargs';
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
import startDevelopmentServer from '../scripts/dev';
import prepareCantaraProject from '../prepare-project';

const packageJson = require('../../package.json');

export default async function setupCliInterface() {
  setupErrorHandling();
  loadEnv();
  setupCliContext();
  await loadCantaraGlobalConfig({ projectDir: getProjectPath() });

  const { allApps } = getGlobalConfig();
  const availableAppNames = allApps.map(app => app.name);

  const TEST_CMD = (process.env.DEV_CANTARA_COMMAND || '').split(' ');
  const cmdToUse =
    process.env.NODE_ENV === 'development' ? TEST_CMD : process.argv.slice(2);
  yargs
    .command(
      'dev <appname>',
      'Start the development server for that app',
      yargs => {
        yargs.positional('appname', {
          describe: 'Name of the app (foldername)',
          type: 'string',
          choices: availableAppNames,
        });
      },
      async args => {
        await loadCantaraRuntimeConfig({
          stage: 'not_set',
          currentCommand: {
            name: 'dev',
            appname: args.appname as string,
          },
          additionalCliOptions: '',
        });
        await prepareCantaraProject();
        await startDevelopmentServer();
      },
    )
    .option('stage', {
      alias: 's',
      type: 'string',
      describe: `Current stage, e.g. development, production or something custom. Environment variables are chosen based on the currently set stage.`,
    })
    // TODO: Update version in PackageJSON using semantic release
    .version(packageJson.version)
    .parse(cmdToUse);
}
