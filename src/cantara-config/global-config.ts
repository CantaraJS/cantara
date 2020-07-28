import path from 'path';
import { existsSync } from 'fs';

import getAllApps, {
  loadSecrets,
  getCantaraDepenciesInstallationPath,
  getDependecyVersions,
} from './util';
import { CantaraApplication } from '../util/types';

import getAllPackageAliases from './aliases';
import { reactDependencies } from './dependencies/react';
import { typescriptDependencies } from './dependencies/types';
import { testingDependencies } from './dependencies/testing';
import { commonDependencies } from './dependencies/common';

const EXPECTED_CANTARA_SECRETS = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];

interface GlobalCantaraSettings {
  e2e: {
    executeBefore: string[];
    portsToWaitFor: number[];
    testCommand: string;
  };
}

interface CantaraLoadGlobalConfigOptions {
  /** Path of Cantara project */
  projectDir?: string;
  additionalCliOptions?: string;
}

type Dependencies = { [key: string]: string };

interface CantaraGlobalConfig {
  allApps: CantaraApplication[];
  /** Unknown options for 3rd party CLI programs, e.g. Jest.
   * Options which are foreign to Cantara are included
   * in this string.
   */
  additionalCliOptions: string;
  allPackages: {
    /** Include all those paths into webpack configs */
    include: string[];
  };
  /**
   * List of dependencies;
   * The actual versions are retrieved from
   * cantara's package.json. This way,
   * all runtime dependencies are alway
   * kept up to date thanks to dependabot
   */
  dependencies: {
    /** Current React and React DOM version */
    react: Dependencies;
    /** Dependencies needed for TS
     * (including all type declarations packages)
     */
    typescript: Dependencies;
    /** Dependecies needed for testing */
    testing: Dependencies;
    /** Commonly needed, global dependencies. E.g. prettier */
    common: Dependencies;
  };
  /** Paths used internally by Cantara */
  internalPaths: {
    static: string;
    /** Where the cantara package itself lives */
    root: string;
    /** Folder for temporary files (excluded from version control) */
    temp: string;
    /** Install path where cantara's dependencies were installed */
    nodeModules: string;
  };
  /** Aliases which need to be set by
   * tools like webpack
   */
  aliases: {
    packageAliases: { [key: string]: string };
  };
  /** Working directory where user executed Cantara */
  projectDir: string;
  /** Path of .cantara folder */
  dotCantaraDir: string;
  /** Secrets from user's .secrets.json file */
  secrets: {
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
  };
  /** Configuration wich is set
   * after the command which needs
   * to be executed is known
   */
  /** Settings from cantara.config.js
   * at the project's root */
  globalCantaraSettings: GlobalCantaraSettings;
}

let globalConfig: CantaraGlobalConfig | undefined = undefined;

export default function getGlobalConfig() {
  if (!globalConfig)
    throw new Error("Cantara's global configuration was not set yet!");
  return globalConfig;
}

// Make sure setup is only executed once
let wasCantaraConfigured = false;
/**
 * Creates current Cantara configuration
 * before the command which needs to
 * be executed is known.
 */
export async function loadCantaraGlobalConfig(
  config: CantaraLoadGlobalConfigOptions,
) {
  if (wasCantaraConfigured) {
    return;
  }
  wasCantaraConfigured = true;
  const cantaraRootDir = path.join(__dirname, '..', '..');
  const staticFilesPath = path.join(cantaraRootDir, 'static');
  const tempFolder = path.join(staticFilesPath, '.temp');
  const projectDir = config.projectDir || process.cwd();
  const cantaraProjectMetaFolderPath = path.join(projectDir, '.cantara');

  const allApps = await getAllApps({
    rootDir: projectDir,
  });

  const packageAliases = getAllPackageAliases({
    allApps,
  });

  const globalCantaraSettingsFilePath = path.join(
    projectDir,
    'cantara.config.js',
  );
  const globalCantaraUserSettings: Partial<GlobalCantaraSettings> = existsSync(
    globalCantaraSettingsFilePath,
  )
    ? require(globalCantaraSettingsFilePath)
    : {};
  const globalCantaraSettings: GlobalCantaraSettings = {
    e2e: {
      executeBefore: globalCantaraUserSettings.e2e
        ? globalCantaraUserSettings.e2e.executeBefore || []
        : [],
      portsToWaitFor: globalCantaraUserSettings.e2e
        ? globalCantaraUserSettings.e2e.portsToWaitFor || []
        : [],
      testCommand: globalCantaraUserSettings.e2e
        ? globalCantaraUserSettings.e2e.testCommand || ''
        : '',
    },
  };

  const nodeModulesPath = getCantaraDepenciesInstallationPath();

  const configToUse: CantaraGlobalConfig = {
    additionalCliOptions: config.additionalCliOptions || '',
    allApps,
    projectDir,
    aliases: {
      packageAliases,
    },
    dotCantaraDir: cantaraProjectMetaFolderPath,
    globalCantaraSettings,
    secrets: loadSecrets({ projectDir, secrets: EXPECTED_CANTARA_SECRETS }),
    allPackages: {
      include: allApps
        .filter(
          app => app.type === 'js-package' || app.type === 'react-component',
        )
        .map(app => app.paths.src),
    },
    dependencies: {
      react: getDependecyVersions(reactDependencies),
      typescript: getDependecyVersions(typescriptDependencies),
      testing: getDependecyVersions(testingDependencies),
      common: getDependecyVersions(commonDependencies),
    },
    internalPaths: {
      root: cantaraRootDir,
      static: staticFilesPath,
      temp: tempFolder,
      nodeModules: nodeModulesPath,
    },
  };
  globalConfig = configToUse;

  return globalConfig;
}
