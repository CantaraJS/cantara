import getGlobalConfig, { getActiveApp } from '../../cantara-config';
import execCmd from '../../util/exec';

export default function executeTests() {
  const {
    runtime: {
      currentCommand: { additionalCliOptions },
    },
  } = getGlobalConfig();

  const activeApp = getActiveApp();

  const cmdToExecute = `jest ${additionalCliOptions}`;

  execCmd(cmdToExecute, {
    workingDirectory: activeApp.paths.root,
    redirectIo: true,
  });
}
