import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';
import path = require('path');
import {
  CantaraApplication,
  CantaraApplicationType,
  CantaraApplicationMetaInformation,
} from '../util/types';
import { readFileAsJSON } from '../util/fs';
import loadAppEnvVars from './envvars';

const isDirectory = (source: string) => lstatSync(source).isDirectory();
const getDirectories = (source: string) =>
  readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);

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

/** Requires that at least one of the specified folders exist */
function requireAtLeastOneFolder(paths: string[]) {
  const doesOneFolderExist = paths
    .map(folderPath => existsSync(folderPath))
    .includes(true);
  if (!doesOneFolderExist) {
    throw new Error('No apps or packages folders were detected!');
  }
}

interface GetAllAppsOptions {
  rootDir: string;
  stage: string;
  /** Name of currently active app */
  activeAppName?: string;
}

/** Returns list of all React Apps, Packages and Node Apps */
export default function getAllApps({
  rootDir,
  stage,
  activeAppName,
}: GetAllAppsOptions): CantaraApplication[] {
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
      const appName = displayName;
      let userAddedMetadata:
        | CantaraApplicationMetaInformation
        | undefined = undefined;
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
        userAddedMetadata = require(cantaraConfigPath);
      }

      const envVars = loadAppEnvVars({
        appRootDir: dir,
        currentStage: stage,
        expectedEnvVars: userAddedMetadata ? userAddedMetadata.env || [] : [],
        fallbackStage: 'development',
        /** If this is the currently active app,
         * the env vars defined in cantara.config.js
         * are required and an error is thrown
         * if some are missing
         */
        required: appName === activeAppName,
      });

      return {
        name: appName,
        type: typeToUse,
        env: envVars,
        paths: {
          root: dir,
          src: path.join(dir, 'src'),
          build: path.join(dir, 'build'),
          assets: path.join(dir, 'assets'),
          static: path.join(dir, 'static'),
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
        `Index file for "${app.name}" was not found. Please create it.`,
      );
    }
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
