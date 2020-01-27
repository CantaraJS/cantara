import execCmd from '../../util/exec';
import { getActiveApp } from '../../cantara-config';

export default async function publishPackage() {
  const packageToPublish = getActiveApp();

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
