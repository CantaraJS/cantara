#!/usr/bin/env node
import program from 'commander';
import startDevelopmentServer from './scripts/dev';
import { configureCantara } from './cantara-config';
import path from 'path';
import onPreBootstrap from './bootstrap';
import buildActiveApp from './scripts/build';
import deployActiveApp from './scripts/deploy';
import executeArbitraryCmdWithinApp from './scripts/arbitrary';
import executeTests from './scripts/test';
import deriveStageNameFromCmd from './util/deriveStage';
import publishPackage from './scripts/publish';
import createNewAppOrPackage from './scripts/new';
import { writeJson } from './util/fs';
const packageJSON = require('../package.json');

const cantaraRootDir = path.join(__dirname, '..');

/** "Normalizes" the behaviour of the CLI
 * no matter if Cantara is executed by the user
 * in a project folder or by nodemon in
 * development mode
 */
function setupCliContext() {
  // Set CWD to path of Cantara
  process.chdir(cantaraRootDir);
}

/** Takes CLI command and removes unknown options
 * from it, so that no error is thrown. Those
 * unknown options are then passed to Cantara,
 * so that they can be used internally to e.g.
 * pass them to another program, for example Jest
 */
function prepareCmdForCommander(cmd: string[]) {
  let { unknown } = program.parseOptions(cmd);
  const unknownParams = unknown.join(' ');

  const cmdWithoutUnknownParams = cmd.filter((cmd, i) => {
    if (i <= 2) return true;
    const shouldKeep = !unknown.includes(cmd);
    // Only remove it once
    unknown = unknown.filter(uCmd => uCmd !== cmd);
    return shouldKeep;
  });
  return { cmd: cmdWithoutUnknownParams, unknownParams };
}

const TEST_CMD = 'test lucky-number';
const cantaraPath =
  process.env.NODE_ENV === 'development'
    ? 'C:\\Users\\maxim\\DEV\\cantara-simple-starter'
    : process.cwd();

const cmdArr =
  process.env.NODE_ENV === 'development'
    ? ['', '', ...TEST_CMD.split(' ')]
    : process.argv;

const {
  cmd: cmdToParse,
  unknownParams: additionalCliOptions,
} = prepareCmdForCommander(cmdArr);

setupCliContext();

interface PrepareCantaraOptions {
  appname: string;
  cmdName: string;
  additionalCliOptions: string;
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
async function prepareCantara({
  appname,
  cmdName,
  additionalCliOptions,
}: PrepareCantaraOptions) {
  wasCantaraCommandExecuted = true;
  const saveConfToFile = false;
  const conf = configureCantara({
    additionalCliOptions,
    projectDir: cantaraPath,
    packageRootDir: cantaraRootDir,
    currentCommand: {
      appname,
      name: cmdName,
    },
    stage:
      !program.stage || program.stage === 'not_set'
        ? deriveStageNameFromCmd(cmdName)
        : program.stage,
  });
  if (saveConfToFile) {
    writeJson(
      path.join(
        conf.internalPaths.temp,
        `./cantara-globconf.${process.env.NODE_ENV}.json`,
      ),
      conf,
    );
  }
  await onPreBootstrap();
}

program.version(packageJSON.version);

/** Stage can be configured externally via --stage
 * parameter. If not defined, the current stage is
 * derived from the current command as follows:
 * - dev: development
 * - build: production
 * - test: test
 */
program.option(
  '-s, --stage <development|production|custom>',
  'This parameter affects which environment variables are used.',
  'not_set',
);

program
  .command('dev <appname>')
  .description('Start the specified app in development mode.')
  .action(async appname => {
    await prepareCantara({ appname, cmdName: 'dev', additionalCliOptions });
    startDevelopmentServer();
  });

program
  .command('build <appname>')
  .description('Create a production build for the specified app or package.')
  .action(async appname => {
    await prepareCantara({ appname, cmdName: 'build', additionalCliOptions });
    buildActiveApp();
  });

program
  .command('deploy <appname>')
  .description('Deploy an application.')
  .action(async appname => {
    await prepareCantara({ appname, cmdName: 'deploy', additionalCliOptions });
    deployActiveApp();
  });

program
  .command('test <appname>')
  .description(
    'Execute Jest tests for the specified application. Jest parameters can be appended at the end of the command.',
  )
  .action(async appname => {
    await prepareCantara({ appname, cmdName: 'test', additionalCliOptions });
    executeTests();
  });

program
  .command('publish <package-name>')
  .description(
    'Publish a package to npm. Make sure to execute tests yourself before publishing.',
  )
  .action(async packageName => {
    await prepareCantara({
      appname: packageName,
      cmdName: 'publish',
      additionalCliOptions,
    });
    publishPackage();
  });

program
  .command(
    'new <react-app|node-app|serverless|package|react-component|react-cmp> <name>',
  )
  .action(async (type, name) => {
    wasCantaraCommandExecuted = true;
    createNewAppOrPackage({
      type,
      name,
      projectDir: cantaraPath,
      staticFolderPath: path.join(cantaraRootDir, 'static'),
      tempFolderPath: path.join(cantaraRootDir, 'static/.temp'),
    });
  });

/** Execute npm commands in the scope of a package/app */
program
  .command('<appname> <command> [parameters...]')
  .description(
    'Execute npm commands for the specified app or package. If you want to e.g. install a package from npm for your React Component named "button", you can execute: "cantara button install @emotion/core".',
  )
  .action((appname, command, ...parameters) => {
    // console.log({ appname, command, parameters });
  });

program.parse(cmdToParse);

if (!wasCantaraCommandExecuted) {
  if (program.args.length <= 1) {
    program.help();
  }
  prepareCantara({
    appname: program.args[0],
    cmdName: program.args[1],
    additionalCliOptions,
  }).then(() => {
    const allCmds = cmdToParse.slice(2);
    executeArbitraryCmdWithinApp(allCmds);
  });
}
