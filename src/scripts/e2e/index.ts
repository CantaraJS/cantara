import waitPort from 'wait-port';
import execCmd from '../../util/exec';
import getGlobalConfig from '../../cantara-config/global-config';

export default async function startEndToEndTests() {
  const {
    globalCantaraSettings: { e2e },
    projectDir,
  } = getGlobalConfig();

  // Execute commands like starting servers etc.
  for (const command of e2e.executeBefore) {
    execCmd(command, { workingDirectory: projectDir });
  }
  // Wait for ports to be available
  for (const portToWaitFor of e2e.portsToWaitFor) {
    const isAvailable = await waitPort({ port: portToWaitFor });
    if (!isAvailable) {
      throw new Error(`No server available at port ${portToWaitFor}`);
    }
  }

  // Execute test command
  await execCmd(e2e.testCommand, {
    redirectIo: true,
    workingDirectory: projectDir,
  });
}
