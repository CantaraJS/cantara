import path from 'path';
import { copyFileSync, existsSync, readFileSync } from 'fs';

import getGlobalConfig from '../config';
import { CantaraApplication } from '../util/types';
import execCmd from '../util/exec';

/** Prepares React App Folder */
export default async function prepareReactApps(app: CantaraApplication) {
  const globalCantaraConfig = getGlobalConfig();
  // Copy index.html to asssets folder if not already there
  const defaultIndexHtmlTemplatePath = path.join(
    globalCantaraConfig.internalPaths.static,
    'default-index.html',
  );
  if (!app.paths.assets) return;
  const indexHtmlDestinationPath = path.join(app.paths.assets, 'index.html');
  if (!existsSync(indexHtmlDestinationPath)) {
    copyFileSync(defaultIndexHtmlTemplatePath, indexHtmlDestinationPath);
  }

  // Install/update dependencies
  const localPackageJsonPath = path.join(app.paths.root, 'package.json');
  if (existsSync(localPackageJsonPath)) {
    // Look if dependencies need to be updated
    type KeyValueStore = { [key: string]: string };
    const { dependencies }: { dependencies: KeyValueStore } = JSON.parse(
      readFileSync(localPackageJsonPath).toString(),
    );
    const dependenciesToInstall = Object.keys(
      globalCantaraConfig.dependencies.react,
    )
      .reduce((depsStr, depName) => {
        const appDependencyVersion = dependencies[depName];
        const expectedVersion = globalCantaraConfig.dependencies.react[depName];
        if (expectedVersion && expectedVersion !== appDependencyVersion) {
          return `${depName}@${expectedVersion} ${depsStr}`;
        }
        return depsStr;
      }, '')
      .trim();
    if (dependenciesToInstall) {
      await execCmd(`npm install -S ${dependenciesToInstall}`, {
        workingDirectory: app.paths.root,
        redirectIo: true,
      });
    }
  } else {
    // Create new packageJSON and install dependencies
    await execCmd(`npm init -y`, {
      workingDirectory: app.paths.root,
    });
    const dependencies = globalCantaraConfig.dependencies.react;
    const dependenciesToInstall = Object.keys(dependencies)
      .reduce((depsStr, depName) => {
        return `${depName}@${dependencies[depName]} ${depsStr}`;
      }, '')
      .trim();
    await execCmd(`npm install -S ${dependenciesToInstall}`, {
      workingDirectory: app.paths.root,
      redirectIo: true,
    });
  }
}
