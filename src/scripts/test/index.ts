import path from 'path';
import execCmd from '../../util/exec';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import getGlobalConfig from '../../cantara-config/global-config';

export default function executeTests() {
  const {
    currentCommand: { app: activeApp },
  } = getRuntimeConfig();

  const {
    additionalCliOptions,
    internalPaths: { root: cantaraRootPath },
  } = getGlobalConfig();
  const jestInstallPath = path.join(
    cantaraRootPath,
    'node_modules/jest/bin/jest.js',
  );

  let newAdditionalCliOptions = additionalCliOptions;
  let nodeCmd = '';

  if (newAdditionalCliOptions.includes('--ctra-debug')) {
    nodeCmd = `node --inspect-brk=9239 `;
    newAdditionalCliOptions = newAdditionalCliOptions.replace('--ctra-debug', '');
  }
    
  const cmdToExecute = `${nodeCmd}"${jestInstallPath}" ${newAdditionalCliOptions}`;

  execCmd(cmdToExecute, {
    workingDirectory: activeApp.paths.root,
    redirectIo: true,
  });
}
