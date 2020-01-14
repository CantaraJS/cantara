import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';
import path = require('path');
import {
  CantaraApplication,
  CantaraApplicationType,
  CantaraApplicationMetaInformation,
} from '../util/types';
import getGlobalConfig from '.';
import { readFileAsJSON } from '../util/fs';

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

interface GetAllAppsOptions {
  rootDir: string;
  stage: string;
}

/** Returns list of all React Apps, Packages and Node Apps */
export default function getAllApps({
  rootDir,
  stage,
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

      let envVars = loadAppEnvVars({
        appRootDir: dir,
        currentStage: stage,
        expectedEnvVars: userAddedMetadata ? userAddedMetadata.env || [] : [],
      });

      return {
        name: path.basename(dir),
        type: typeToUse,
        env: envVars,
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
        `Index file for "${app.name}" was not found. Please create it.`,
      );
    }
  });

  return allApps;
}

/** Loads and parses the content from the user's .secrets.json file
 * in the project root. Here, Cantara specific secrets can be stored.
 * E.g. AWS keys
 */
export function loadSecrets(projectDir: string) {
  const secretsFilePath = path.join(projectDir, '.secrets.json');
  let secrets = {};
  if (existsSync(secretsFilePath)) {
    secrets = readFileAsJSON(secretsFilePath);
  }
  return secrets;
}

/**
 * Parses a .env file and returns and object
 * with it's values.
 * If the file is not found, an empty object
 * is returned.
 */
function parseEnvFile(filePath: string): { [key: string]: string } {
  if (!existsSync(filePath)) return {};
  let result: { [key: string]: string } = {};
  const lines = readFileSync(filePath)
    .toString()
    .split('\n');
  for (const line of lines) {
    const match = line.match(/^([^=:#]+?)[=:](.*)/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      result[key] = value;
    }
  }
  return result;
}

interface LoadAppEnvVarsOptions {
  appRootDir: string;
  /** Can be specified in app's cantara.config.js */
  expectedEnvVars: string[];
  currentStage: string;
}

/**
 * Loads env vars from either the current
 * stage's env file (.env.<stage>) or, if
 * not defined, from process.env.
 * If an env var in the array expectedEnvVars
 * is not defined, an error is thrown.
 * Additional env vars in the .env file
 * are ignored and a warning is shown.
 * The resulting object can later on
 * be used by the WebpackDefinePlugin.
 * STAGE is always added as an env var
 * with the current stage as it's value.
 */
function loadAppEnvVars({
  appRootDir,
  currentStage,
  expectedEnvVars,
}: LoadAppEnvVarsOptions) {
  let envVarsToReturn: { [key: string]: string } = { STAGE: currentStage };
  if (expectedEnvVars.length === 0) return envVarsToReturn;
  const envFileName = `.env.${currentStage.toLowerCase()}`;
  const currentStageEnvFile = path.join(appRootDir, envFileName);
  const envFileContent = parseEnvFile(currentStageEnvFile);
  for (const expectedEnvVarName of expectedEnvVars) {
    const envVarValue =
      envFileContent[expectedEnvVarName] || process.env[expectedEnvVarName];
    if (envVarValue === undefined || envVarValue === null) {
      throw new Error(
        `File ${envFileName} contains no variable named "${expectedEnvVarName}" and it is not defined in the current environment. It is marked as required in crana.config.js`,
      );
    }
    envVarsToReturn[expectedEnvVarName] = envVarValue;
  }

  // Warnings for ignored env vars in .env file
  const allEnvVarsInEnvFile = Object.keys(envFileContent);
  const ignoredEnvVars = allEnvVarsInEnvFile.filter(
    envName => !expectedEnvVars.includes(envName),
  );
  if (ignoredEnvVars.length > 0) {
    console.warn(
      `The following environment variables are ignored, because they are not present in the crana.config.js file:\n\t${ignoredEnvVars.join(
        '\n\t',
      )}`,
    );
  }

  return envVarsToReturn;
}
