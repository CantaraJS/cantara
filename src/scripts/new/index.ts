import path from 'path';
import ncpCb from 'ncp';
import del from 'del';
import { promisify } from 'util';
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  rmdirSync,
} from 'fs';
import { camalize } from '../../util/string-manipulation';

const ncp = promisify(ncpCb);

interface CreateNewOptions {
  name: string;
  /** Root of user's project */
  projectDir: string;
  staticFolderPath: string;
  tempFolderPath: string;
}

interface CreateNewAppOrPackageOptions extends CreateNewOptions {
  type:
    | 'react-app'
    | 'node-app'
    | 'serverless'
    | 'package'
    | 'react-component'
    | 'react-cmp';
}

async function createReactComponent({
  name,
  staticFolderPath,
  tempFolderPath,
  projectDir,
}: CreateNewOptions) {
  const destinationPath = path.join(projectDir, 'packages', name);
  // Replace "Index" with actual component name
  const origTemplateFolderPath = path.join(
    staticFolderPath,
    'app-templates/react-component',
  );
  const templateFolderPath = path.join(
    tempFolderPath,
    'react-component-app-template',
  );
  if (existsSync(templateFolderPath)) {
    await del(templateFolderPath);
  }
  mkdirSync(templateFolderPath);
  await ncp(origTemplateFolderPath, templateFolderPath);
  const reactIndexFilePath = path.join(templateFolderPath, 'src/index.tsx');
  const origReactIndexFileContent = readFileSync(reactIndexFilePath).toString();
  const newReactIndexFileContent = origReactIndexFileContent.replace(
    new RegExp('Index', 'g'),
    camalize(name),
  );
  writeFileSync(reactIndexFilePath, newReactIndexFileContent);
  return { destinationPath, templateFolderPath };
}

export default async function createNewAppOrPackage({
  type,
  name,
  staticFolderPath,
  tempFolderPath,
  projectDir,
}: CreateNewAppOrPackageOptions) {
  let templateFolderPath = '';
  let destinationPath = '';
  if (type === 'react-app') {
    destinationPath = path.join(projectDir, 'react-apps', name);
    templateFolderPath = path.join(staticFolderPath, 'app-templates/react-app');
  }
  if (type === 'react-cmp' || type === 'react-component') {
    const resObj = await createReactComponent({
      name,
      staticFolderPath,
      tempFolderPath,
      projectDir,
    });
    templateFolderPath = resObj.templateFolderPath;
    destinationPath = resObj.destinationPath;
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
