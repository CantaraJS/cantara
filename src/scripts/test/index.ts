import execCmd from '../../util/exec';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import getGlobalConfig from '../../cantara-config/global-config';

export default function executeTests() {
  const {
    currentCommand: { app: activeApp },
  } = getRuntimeConfig();

  const { additionalCliOptions } = getGlobalConfig();

  const cmdToExecute = `jest ${additionalCliOptions}`;

  execCmd(cmdToExecute, {
    workingDirectory: activeApp.paths.root,
    redirectIo: true,
  });
}
