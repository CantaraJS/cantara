#!/usr/bin/env node
import program from 'commander';
import startDevelopmentServer from './scripts/dev';
import { configureCantara } from './config';
import path from 'path';
import onPreBootstrap from './bootstrap';
// import execCmd from './exec';

const packageJSON = require('../package.json');

const TEST_CMD = 'dev places-api';
const cantaraPath =
  process.env.NODE_ENV === 'development'
    ? 'C:\\Users\\maxim\\DEV\\cantare-example'
    : process.cwd();

const cmdToParse =
  process.env.NODE_ENV === 'development'
    ? ['', '', ...TEST_CMD.split(' ')]
    : process.argv;

const cantaraRootDir = path.join(__dirname, '..');

program.version(packageJSON.version);

program
  .command('dev <appname>')
  .description('Start the specified app in development mode.')
  .action(async appname => {
    configureCantara({
      projectDir: cantaraPath,
      packageRootDir: cantaraRootDir,
      currentCommand: {
        appname,
        name: 'dev',
      },
    });
    await onPreBootstrap();
    startDevelopmentServer();
  });

program.parse(cmdToParse);
