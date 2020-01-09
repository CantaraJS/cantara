#!/usr/bin/env node
import program from 'commander';
import startDevelopmentServer from './scripts/dev';
import { configureCantara } from './cantara-config';
import path from 'path';
import onPreBootstrap from './bootstrap';
import buildActiveApp from './scripts/build';
import deployActiveApp from './scripts/deploy';
import executeArbitraryCmdWithinApp from './scripts/arbitrary';
// import execCmd from './exec';

const packageJSON = require('../package.json');

const TEST_CMD = 'places-api serverless info --stage prod';
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

/** Is set to true if any Cantara command was executed.
 * If no cantara command was matched,
 * the tool tries to execute the npm command
 * for the specified app/package. If no NPM command with this name
 * exists, it tries to execute it as an arbitrary
 * command with the specified app/package as the CWD.
 */
let wasCantaraCommandExecuted = false;

/** Execute this function before each command */
async function prepareCantara({ appname, cmdName }: PrepareCantaraOptions) {
  wasCantaraCommandExecuted = true;
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

/** Execute npm commands in the scope of a package/app */
program
  .command('<appname> <command> [parameters...]')
  .description(
    'Execute npm commands for the specified app or package. If you want to e.g. install a package from npm for your React Component named "button", you can execute: "cantara button install @emotion/core".',
  )
  .action((appname, command, ...parameters) => {
    console.log({ appname, command, parameters });
  });

program.parse(cmdToParse);

if (!wasCantaraCommandExecuted) {
  if (program.args.length <= 1) {
    program.help();
  }
  prepareCantara({ appname: program.args[0], cmdName: program.args[1] }).then(
    () => {
      const allCmds = cmdToParse.slice(2);
      executeArbitraryCmdWithinApp(allCmds);
    },
  );
}
