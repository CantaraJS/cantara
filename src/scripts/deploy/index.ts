import getGlobalConfig from '../../cantara-config';
import execCmd from '../../util/exec';

/** Deploys the currently selected application.
 */
export default function deployActiveApp() {
  const {
    runtime: {
      currentCommand: { app: activeApp },
      secrets,
    },
  } = getGlobalConfig();

  if (activeApp.type !== 'serverless') {
    throw new Error(
      'Currently, only the deployment of serverless endpoints is provided by Cantara.',
    );
  }

  if (!secrets.AWS_ACCESS_KEY_ID || !secrets.AWS_SECRET_ACCESS_KEY) {
    throw new Error(
      'Please define "AWS_ACCESS_KEY_ID" and "AWS_SECRET_ACCESS_KEY" in the .secrets.json file on the root of your project!',
    );
  }

  const serverlessCmd = 'serverless deploy --stage prod';
  execCmd(serverlessCmd, {
    workingDirectory: activeApp.paths.root,
    redirectIo: true,
    withSecrets: true,
  });
}
