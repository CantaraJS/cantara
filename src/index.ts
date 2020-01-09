#!/usr/bin/env node
import program from 'commander';
import startDevelopmentServer from './scripts/dev';
import { configureCantara } from './cantara-config';
import path from 'path';
import onPreBootstrap from './bootstrap';
import buildActiveApp from './scripts/build';
import deployActiveApp from './scripts/deploy';
// import execCmd from './exec';

const packageJSON = require('../package.json');

const TEST_CMD = 'deploy places-api';
const cantaraPath =
  process.env.NODE_ENV === 'development'
    ? 'C:\\Users\\maxim\\DEV\\cantare-example'
    : process.cwd();

const cmdToParse =
  process.env.NODE_ENV === 'development'
    ? ['', '', ...TEST_CMD.split(' ')]
    : process.argv;

const cantaraRootDir = path.join(__dirname, '..');

interface PrepareCantaraOptions {
  appname: string;
  cmdName: string;
}

/** Execute this function before each command */
async function prepareCantara({ appname, cmdName }: PrepareCantaraOptions) {
  configureCantara({
    projectDir: cantaraPath,
    packageRootDir: cantaraRootDir,
    currentCommand: {
      appname,
      name: cmdName,
    },
  });
  await onPreBootstrap();
}

program.version(packageJSON.version);

program
  .command('dev <appname>')
  .description('Start the specified app in development mode.')
  .action(async appname => {
    await prepareCantara({ appname, cmdName: 'dev' });
    startDevelopmentServer();
  });

program
  .command('build <appname>')
  .description('Create a production build for the specified app or package.')
  .action(async appname => {
    await prepareCantara({ appname, cmdName: 'build' });
    buildActiveApp();
  });

program
  .command('deploy <appname>')
  .description('Deploy an application.')
  .action(async appname => {
    await prepareCantara({ appname, cmdName: 'deploy' });
    deployActiveApp();
  });

program.parse(cmdToParse);
