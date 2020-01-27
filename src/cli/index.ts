import program from 'commander';
import path from 'path';

import startDevelopmentServer from '../scripts/dev';
import buildActiveApp from '../scripts/build';
import deployActiveApp from '../scripts/deploy';
import executeArbitraryCmdWithinApp from '../scripts/arbitrary';
import executeTests from '../scripts/test';
import publishPackage from '../scripts/publish';
import createNewAppOrPackage from '../scripts/new';
import initializeNewProject from '../scripts/init';
import executeForChangedApps from '../scripts/exec-changed';
import initalizeCantara from '../bootstrap/init';
import { prepareCmdForCommander, setupCliContext } from './util';
const packageJSON = require('../../package.json');

const TEST_CMD = 'deploy greeting-api --stage staging';
const userProjectPath =
  process.env.NODE_ENV === 'development'
    ? 'C:\\Users\\maxim\\DEV\\new-cantara'
    : process.cwd();

const cmdArr =
  process.env.NODE_ENV === 'development'
    ? ['', '', ...TEST_CMD.split(' ')]
    : process.argv;

const {
  cmd: cmdToParse,
  unknownParams: additionalCliOptions,
} = prepareCmdForCommander(cmdArr, program);

interface PrepareCantaraOptions {
  appname?: string;
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
export async function prepareCantara({
  appname,
  cmdName,
  additionalCliOptions,
}: PrepareCantaraOptions) {
  wasCantaraCommandExecuted = true;
  setupCliContext();
  await initalizeCantara({
    additionalCliOptions,
    appname,
    cmdName,
    stage: program.stage,
    userProjectPath: userProjectPath,
  });
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
  '-s, --stage <stageName>',
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
    await buildActiveApp();
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
    await prepareCantara({
      cmdName: 'new',
      additionalCliOptions,
    });
    await createNewAppOrPackage({
      type,
      name,
    });
  });

program
  .command('init [path] [template]')
  .description(
    `Initialize a new project from a template.
    If no path is specified, the current working directory is used (if empty).
    If no template is specified, cantara-simple-starter is used.`,
  )
  .action(async (userPath, template) => {
    wasCantaraCommandExecuted = true;
    const templateToUse = template ? template : 'cantara-simple-starter';
    const pathToUse = userPath ? path.resolve(userPath) : process.cwd();
    await initializeNewProject({
      projectDir: pathToUse,
      templateName: templateToUse,
    });
  });

program
  .command('build-changed')
  .description(
    'Creates a production build of all apps/packages that changed since the last commit.',
  )
  .action(async () => {
    await prepareCantara({ cmdName: 'build-changed', additionalCliOptions });
    await executeForChangedApps(async appname => {
      await prepareCantara({ cmdName: 'build', additionalCliOptions, appname });
      await buildActiveApp();
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
