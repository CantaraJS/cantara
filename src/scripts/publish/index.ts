import execCmd from '../../util/exec';
import getGlobalConfig from '../../cantara-config';

export default async function publishPackage() {
  const {
    runtime: {
      currentCommand: { app: packageToPublish },
    },
  } = getGlobalConfig();

  if (
    packageToPublish.type !== 'js-package' &&
    packageToPublish.type !== 'react-component'
  ) {
    throw new Error('Only packages can be published!');
  }

  await execCmd('np --no-tests', {
    redirectIo: true,
    workingDirectory: packageToPublish.paths.root,
  });
}
