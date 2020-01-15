import getGlobalConfig from '../../cantara-config';
import execCmd from '../../util/exec';

export default function executeTests() {
  const {
    runtime: {
      currentCommand: { app: activeApp },
    },
  } = getGlobalConfig();

  execCmd('jest', { workingDirectory: activeApp.paths.root, redirectIo: true });
}
