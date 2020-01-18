import path from 'path';
import ncpCb from 'ncp';
import { promisify } from 'util';
import { existsSync } from 'fs';

const ncp = promisify(ncpCb);

interface CreateNewAppOrPackageOptions {
  type:
    | 'react-app'
    | 'node-app'
    | 'serverless'
    | 'package'
    | 'react-component'
    | 'react-cmp';
  name: string;
  /** Root of user's project */
  projectDir: string;
  staticFolderPath: string;
}

export default async function createNewAppOrPackage({
  type,
  name,
  staticFolderPath,
  projectDir,
}: CreateNewAppOrPackageOptions) {
  let templateFolderPath = '';
  let destinationPath = '';
  if (type === 'react-app') {
    destinationPath = path.join(projectDir, 'react-apps', name);
    templateFolderPath = path.join(staticFolderPath, 'app-templates/react-app');
  }
  if (type === 'react-cmp' || type === 'react-component') {
    destinationPath = path.join(projectDir, 'packages', name);
    templateFolderPath = path.join(
      staticFolderPath,
      'app-templates/react-component',
    );
  }
  if (type === 'node-app') {
    destinationPath = path.join(projectDir, 'node-apps', name);
    templateFolderPath = path.join(staticFolderPath, 'app-templates/node-app');
  }
  if (type === 'serverless') {
    destinationPath = path.join(projectDir, 'node-apps', name);
    templateFolderPath = path.join(
      staticFolderPath,
      'app-templates/serverless',
    );
  }
  if (type === 'package') {
    destinationPath = path.join(projectDir, 'packages', name);
    templateFolderPath = path.join(
      staticFolderPath,
      'app-templates/js-package',
    );
  }

  if (existsSync(destinationPath)) {
    throw new Error(
      `${destinationPath} already exists! Delete the folder if you want to override it.`,
    );
  }

  await ncp(templateFolderPath, destinationPath);

  console.log(`Created new ${type} at ${destinationPath}!`);
}
