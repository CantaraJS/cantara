import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';
import path = require('path');
import { CantaraApplication, CantaraApplicationType } from '../util/types';

const isDirectory = (source: string) => lstatSync(source).isDirectory();
const getDirectories = (source: string) =>
  readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);

/** Requires that at least one of the specified folders exist */
function requireAtLeastOneFolder(paths: string[]) {
  const doesOneFolderExist = paths
    .map(folderPath => existsSync(folderPath))
    .includes(true);
  if (!doesOneFolderExist) {
    throw new Error('No apps or packages folders were detected!');
  }
}

/** Returns list of all React Apps, Packages and Node Apps */
export default function getAllApps(rootDir: string): CantaraApplication[] {
  const FOLDER_NAMES: { [key: string]: string } = {
    REACT_APPS: 'react-apps',
    NODE_APPS: 'node-apps',
    PACKAGES: 'packages',
  };

  const reactAppsRootDir = path.join(rootDir, FOLDER_NAMES.REACT_APPS);
  const packagesAppsRootDir = path.join(rootDir, FOLDER_NAMES.PACKAGES);
  const nodeAppsRootDir = path.join(rootDir, FOLDER_NAMES.NODE_APPS);

  requireAtLeastOneFolder([
    reactAppsRootDir,
    packagesAppsRootDir,
    nodeAppsRootDir,
  ]);

  const allAppsDirectories: { dir: string; type: string }[] = [
    ...getDirectories(reactAppsRootDir).map(dir => ({ dir, type: 'react' })),
    ...getDirectories(packagesAppsRootDir).map(dir => ({
      dir,
      type: 'package',
    })),
    ...getDirectories(nodeAppsRootDir).map(dir => ({ dir, type: 'node' })),
  ];

  const allApps: CantaraApplication[] = allAppsDirectories.map(
    ({ dir, type }) => {
      let typeToUse: CantaraApplicationType = type as CantaraApplicationType;
      let displayName = path.basename(dir);
      let userAddedMetadata = {};
      if (type === 'package') {
        const packageSrc = path.join(dir, 'src');
        typeToUse = existsSync(path.join(packageSrc, 'index.tsx'))
          ? 'react-component'
          : 'js-package';
      }

      if (type === 'node') {
        typeToUse = existsSync(path.join(dir, 'serverless.yml'))
          ? 'serverless'
          : 'node';
      }

      const packageJsonPath = path.join(dir, 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJSON = JSON.parse(
          readFileSync(packageJsonPath).toString(),
        );
        displayName = packageJSON.name;
      }

      const cantaraConfigPath = path.join(dir, 'cantara.config.js');
      if (existsSync(cantaraConfigPath)) {
        const userAppConfig = require(cantaraConfigPath);
        userAddedMetadata = userAppConfig.app;
      }

      return {
        name: path.basename(dir),
        type: typeToUse,
        paths: {
          root: dir,
          src: path.join(dir, 'src'),
          build: path.join(dir, 'build'),
          assets: path.join(dir, 'assets'),
        },
        meta: {
          displayName,
          ...userAddedMetadata,
        },
      };
    },
  );

  // Require index.ts(x) file to exist for every app
  allApps.forEach(app => {
    const indexTsFileExists = existsSync(path.join(app.paths.src, 'index.ts'));
    const indexTsxFileExists = existsSync(
      path.join(app.paths.src, 'index.tsx'),
    );
    const doesIndexFileExist = indexTsFileExists || indexTsxFileExists;
    if (!doesIndexFileExist) {
      throw new Error(
        `Index file for ${app.name} was not found. Please create it.`,
      );
    }
  });

  return allApps;
}
