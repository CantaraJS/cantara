import path from 'path';
import getGlobalConfig from '../../cantara-config';
import execCmd from '../../util/exec';

export default function executeTests() {
  const {
    runtime: {
      currentCommand: { app: activeApp, additionalCliOptions },
    },
    internalPaths: { temp },
  } = getGlobalConfig();

  const cmdToExecute = `jest ${additionalCliOptions}`;

  execCmd(cmdToExecute, {
    workingDirectory: activeApp.paths.root,
    redirectIo: true,
  });
}
