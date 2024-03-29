import path from 'path';
import ncpCb from 'ncp';
import del from 'del';
import { promisify } from 'util';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import c from 'ansi-colors';

import { camalize } from '../../util/string-manipulation';
import getGlobalConfig from '../../cantara-config/global-config';
import { CantaraApplicationType } from '../../util/types';
import { fsExists } from '../../util/fs';

const ncp = promisify(ncpCb);

interface CreateNewOptions {
  name: string;
}

interface CreateNewAppOrPackageOptions extends CreateNewOptions {
  type: CantaraApplicationType;
}

async function createReactComponent({ name }: CreateNewOptions) {
  const {
    projectDir,
    internalPaths: { static: staticFolderPath, temp: tempFolderPath },
  } = getGlobalConfig();

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
}: CreateNewAppOrPackageOptions) {
  const {
    projectDir,
    internalPaths: { static: staticFolderPath },
  } = getGlobalConfig();

  let templateFolderPath = '';
  let destinationPath = '';

  let indexFilePath = '';

  if (type === 'react') {
    destinationPath = path.join(projectDir, 'react-apps', name);
    templateFolderPath = path.join(staticFolderPath, 'app-templates/react-app');
    indexFilePath = 'src/index.tsx';
  }
  if (type === 'react-component') {
    const resObj = await createReactComponent({
      name,
    });
    templateFolderPath = resObj.templateFolderPath;
    destinationPath = resObj.destinationPath;
    indexFilePath = 'src/index.tsx';
  }
  if (type === 'node') {
    destinationPath = path.join(projectDir, 'node-apps', name);
    templateFolderPath = path.join(staticFolderPath, 'app-templates/node-app');
    indexFilePath = 'src/index.ts';
  }
  if (type === 'serverless') {
    destinationPath = path.join(projectDir, 'node-apps', name);
    templateFolderPath = path.join(
      staticFolderPath,
      'app-templates/serverless',
    );
    indexFilePath = 'handler.js';
    if (await fsExists(path.join(destinationPath, 'src', 'handler.ts'))) {
      indexFilePath = 'handler.ts';
    }
  }
  if (type === 'js-package') {
    destinationPath = path.join(projectDir, 'packages', name);
    templateFolderPath = path.join(
      staticFolderPath,
      'app-templates/js-package',
    );
    indexFilePath = 'src/index.ts';
  }

  if (!existsSync(templateFolderPath)) {
    throw new Error(`${templateFolderPath} does not exist.`);
  }

  if (existsSync(destinationPath)) {
    throw new Error(
      `${destinationPath} already exists! Delete the folder if you want to override it.`,
    );
  }

  mkdirSync(destinationPath, { recursive: true });

  await ncp(templateFolderPath, destinationPath);

  console.log(`
    Created new ${c.cyan(type)} at
    ${path.join(destinationPath, indexFilePath)}
  `);
}
