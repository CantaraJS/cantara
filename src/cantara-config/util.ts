import { existsSync, lstatSync, readdirSync } from 'fs';
import path from 'path';
import {
  CantaraApplication,
  CantaraApplicationType,
  CantaraApplicationMetaInformation,
} from '../util/types';
import { readFileAsJSON, fsExists, fsReadFile } from '../util/fs';

const isDirectory = (source: string) => lstatSync(source).isDirectory();
const getDirectories = (source: string) => {
  try {
    return readdirSync(source)
      .map((name) => path.join(source, name))
      .filter(isDirectory);
  } catch (e) {
    return [];
  }
};
/**
 * Returns node_modules path of
 * Cantara's dependecies,
 * as this may differ depending
 * on how it was installed. Do
 * that by requiring a module
 * which will never be removed,
 * @babel/core, and resolve it's
 * absolute path.
 */
export function getCantaraDepenciesInstallationPath() {
  const absolutePath = require.resolve('@babel/core');
  const nodeModulesPos = absolutePath.lastIndexOf('node_modules');
  const nodeModulesPath = absolutePath.slice(
    0,
    nodeModulesPos + 'node_modules'.length,
  );
  return nodeModulesPath;
}

export function getAllCantaraProjectFolders(rootDir: string) {
  const FOLDER_NAMES: { [key: string]: string } = {
    REACT_APPS: 'react-apps',
    NODE_APPS: 'node-apps',
    PACKAGES: 'packages',
  };

  const reactAppsRootDir = path.join(rootDir, FOLDER_NAMES.REACT_APPS);
  const packagesAppsRootDir = path.join(rootDir, FOLDER_NAMES.PACKAGES);
  const nodeAppsRootDir = path.join(rootDir, FOLDER_NAMES.NODE_APPS);
  return {
    reactAppsRootDir,
    packagesAppsRootDir,
    nodeAppsRootDir,
  };
}

interface GetAllAppsOptions {
  rootDir: string;
}

/** Returns list of all React Apps, Packages and Node Apps */
export default async function getAllApps({
  rootDir,
}: GetAllAppsOptions): Promise<CantaraApplication[]> {
  const {
    nodeAppsRootDir,
    packagesAppsRootDir,
    reactAppsRootDir,
  } = getAllCantaraProjectFolders(rootDir);

  const allAppsDirectories: { dir: string; type: string }[] = [
    ...getDirectories(reactAppsRootDir).map((dir) => ({ dir, type: 'react' })),
    ...getDirectories(packagesAppsRootDir).map((dir) => ({
      dir,
      type: 'package',
    })),
    ...getDirectories(nodeAppsRootDir).map((dir) => ({ dir, type: 'node' })),
  ];

  let allApps: CantaraApplication[] = await Promise.all(
    allAppsDirectories.map(async ({ dir, type }) => {
      let typeToUse: CantaraApplicationType = type as CantaraApplicationType;
      let displayName = path.basename(dir);

      let appName = displayName;
      let userAddedMetadata:
        | CantaraApplicationMetaInformation
        | undefined = undefined;

      const packageJsonPath = path.join(dir, 'package.json');
      let packageJsonName = '';
      if (await fsExists(packageJsonPath)) {
        const packageJSON = JSON.parse(
          (await fsReadFile(packageJsonPath)).toString(),
        );
        packageJsonName = packageJSON.name;
      }

      if (packageJsonName) {
        displayName = packageJsonName;
      }

      if (type === 'package') {
        // For packages, if a package.json file is already available,
        // use the name defined at the "name" field instead
        // of the foldername. This way, org scoped packages
        // also work with cantara, e.g. @acme/package
        if (packageJsonName) {
          appName = packageJsonName;
        }
        const packageSrc = path.join(dir, 'src');
        typeToUse = (await fsExists(path.join(packageSrc, 'index.tsx')))
          ? 'react-component'
          : 'js-package';
      }

      if (type === 'node') {
        typeToUse = (await fsExists(path.join(dir, 'serverless.yml')))
          ? 'serverless'
          : 'node';
      }

      const cantaraConfigPath = path.join(dir, 'cantara.config.js');
      if (await fsExists(cantaraConfigPath)) {
        userAddedMetadata = require(cantaraConfigPath);
      }

      const appMeta: CantaraApplicationMetaInformation = {
        displayName,
        ...userAddedMetadata,
      };

      // Custom or standard app static folder
      const appStaticFolder = appMeta.staticFolder
        ? path.join(dir, appMeta.staticFolder)
        : path.join(dir, 'static');

      return {
        name: appName,
        type: typeToUse,
        paths: {
          root: dir,
          src: path.join(dir, 'src'),
          build: path.join(dir, 'build'),
          assets: path.join(dir, 'assets'),
          static: appStaticFolder,
        },
        meta: appMeta,
      };
    }),
  );

  // Require index.ts(x) file to exist for every app
  // and react component
  allApps = allApps.filter((app) => {
    let doesIndexFileExist = false;
    if (app.type === 'js-package') {
      doesIndexFileExist = true;
    }
    if (app.type === 'node') {
      doesIndexFileExist = existsSync(path.join(app.paths.src, 'index.ts'));
    }
    if (app.type === 'react' || app.type === 'react-component') {
      doesIndexFileExist = existsSync(path.join(app.paths.src, 'index.tsx'));
    }
    if (app.type === 'serverless') {
      doesIndexFileExist = existsSync(path.join(app.paths.root, 'handler.js'));
    }

    if (!doesIndexFileExist) {
      console.log(
        `Entry file for "${app.name}" was not found. Please create it.`,
      );
    }
    return doesIndexFileExist;
  });

  return allApps;
}

interface LoadSecretsParams {
  projectDir: string;
  /** Array of secret identifiers, e.g. ['AWS_ACCESS_KEY_ID'] */
  secrets: string[];
}

/** Loads and parses the content from the user's .secrets.json file
 * in the project root. Here, Cantara specific secrets can be stored.
 * E.g. AWS keys. Can also be passed in as environment variables.
 */
export function loadSecrets({
  projectDir,
  secrets: identifiers,
}: LoadSecretsParams) {
  const secretsFilePath = path.join(projectDir, '.secrets.json');
  let secrets: { [key: string]: string | undefined } = {};
  if (existsSync(secretsFilePath)) {
    secrets = readFileAsJSON(secretsFilePath);
  }

  for (const secretId of identifiers) {
    if (!secrets[secretId]) {
      secrets[secretId] = process.env[secretId];
    }
  }

  return secrets;
}

/**
 * Transforms an array of npm package names
 * into a map containing the currently
 * installed version in cantara by retrieving
 * it from the package.json
 */
export function getDependecyVersions(dependencies: string[]) {
  const cantaraRootDir = path.join(__dirname, '..', '..');
  const packageJson = readFileAsJSON(path.join(cantaraRootDir, 'package.json'));
  const versionMap = dependencies.reduce((obj, dep) => {
    const version =
      packageJson.dependencies[dep] || packageJson.devDependencies[dep];
    return {
      ...obj,
      [dep]: version,
    };
  }, {} as { [key: string]: string });
  return versionMap;
}
