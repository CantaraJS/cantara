import execCmd from '../../util/exec';
import getRuntimeConfig from '../../cantara-config/runtime-config';

export default function executeTests() {
  const {
    currentCommand: { additionalCliOptions, app: activeApp },
  } = getRuntimeConfig();

  const cmdToExecute = `jest ${additionalCliOptions}`;

  execCmd(cmdToExecute, {
    workingDirectory: activeApp.paths.root,
    redirectIo: true,
  });
}
