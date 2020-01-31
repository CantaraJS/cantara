import path from 'path';

import {
  CantaraCommand,
  parseCliCommand,
  execCantaraCommand,
  prepareCantara,
} from './cli-tools';
import executeArbitraryCmdWithinApp from '../scripts/arbitrary';
import startDevelopmentServer from '../scripts/dev';
import deployActiveApp from '../scripts/deploy';
import buildActiveApp from '../scripts/build';
import executeTests from '../scripts/test';
import publishPackage from '../scripts/publish';
import createNewAppOrPackage from '../scripts/new';
import initializeNewProject from '../scripts/init';
import executeForChangedApps from '../scripts/exec-changed';
import startEndToEndTests from '../scripts/e2e';

const allCantaraCommands: CantaraCommand[] = [
  {
    actionName: 'dev',
    parameters: [{ name: 'appname', required: true }],
    exec: () => {
      return startDevelopmentServer();
    },
  },
  {
    actionName: 'deploy',
    parameters: [{ name: 'appname', required: true }],
    exec: () => {
      return deployActiveApp();
    },
  },
  {
    actionName: 'build',
    parameters: [{ name: 'appname', required: true }],
    exec: () => {
      return buildActiveApp();
    },
  },
  {
    actionName: 'test',
    parameters: [{ name: 'appname', required: true }],
    exec: () => {
      return executeTests();
    },
  },
  {
    actionName: 'publish',
    parameters: [{ name: 'appname', required: true }],
    exec: () => {
      return publishPackage();
    },
  },
  {
    actionName: 'run',
    parameters: [{ name: 'appname', required: true }],
    exec: ({ originalCommand }) => {
      return executeArbitraryCmdWithinApp(originalCommand);
    },
  },
  {
    actionName: 'new',
    parameters: [
      { name: 'type', required: true },
      { name: 'name', required: true },
    ],
    exec: ({ parameters: [name, type] }) => {
      return createNewAppOrPackage({ type: type as any, name });
    },
  },
  {
    actionName: 'init',
    parameters: [{ name: 'path' }, { name: 'template' }],
    exec: ({ parameters: [userPath, template] }) => {
      const templateToUse = template ? template : 'cantara-simple-starter';
      const pathToUse = userPath ? path.resolve(userPath) : process.cwd();
      return initializeNewProject({
        projectDir: pathToUse,
        templateName: templateToUse,
      });
    },
  },
  {
    actionName: 'build-changed',
    exec: ({ stage }) => {
      return executeForChangedApps(async appname => {
        await prepareCantara({
          cmdName: 'build',
          additionalCliOptions: '',
          appname,
          stage,
        });
        await buildActiveApp();
      });
    },
  },
  {
    actionName: 'test-changed',
    exec: ({ stage }) => {
      return executeForChangedApps(async appname => {
        await prepareCantara({
          cmdName: 'test',
          additionalCliOptions: '',
          appname,
          stage,
        });
        await executeTests();
      });
    },
  },
  {
    actionName: 'e2e',
    exec: () => {
      return startEndToEndTests();
    },
  },
];

export default function setupCliInterface() {
  const TEST_CMD = (process.env.DEV_CANTARA_COMMAND || '').split(' ');
  const cmdToUse =
    process.env.NODE_ENV === 'development' ? TEST_CMD : process.argv.slice(2);
  const parsedCommand = parseCliCommand(cmdToUse);
  execCantaraCommand({
    allCantaraCommands,
    parsedCommand,
    originalCommand: cmdToUse,
  });
}
