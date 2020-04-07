import path from 'path';
import { existsSync } from 'fs';

import getAllApps, {
  loadSecrets,
  getCantaraDepenciesInstallationPath,
} from './util';
import { CantaraApplication } from '../util/types';

import getAllPackageAliases, { getDependencyAliases } from './aliases';
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

interface CantaraInitialConfig {
  /** Where the cantara package itself lives */
  packageRootDir: string;
  /** Path of Cantara project */
  projectDir?: string;
  currentCommand: {
    name: string;
    appname?: string;
  };
  stage: string;
  /** Unknown options for 3rd party CLI programs, e.g. Jest.
   * Options which are foreign to Cantara are included
   * in this string.
   */
  additionalCliOptions?: string;
}

type Dependencies = { [key: string]: string };

interface CantaraGlobalConfig {
  allApps: CantaraApplication[];
  allPackages: {
    /** Include all those paths into webpack configs */
    include: string[];
  };
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
  /** Current runtime configuration (e.g. the command the user executed, the location of it etc.) */
  runtime: {
    /** Aliases which need to be set by
     * tools like webpack
     */
    aliases: {
      packageAliases: { [key: string]: string };
      appDependencyAliases: { [key: string]: string };
    };
    /** Working directory where user executed Cantara */
    projectDir: string;
    /** Path of .cantara folder */
    dotCantaraDir: string;
    /** Information about current command */
    currentCommand: {
      name: string;
      additionalCliOptions: string;
      app?: CantaraApplication;
    };
    /** Secrets from user's .secrets.json file */
    secrets: {
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
    };
    stage: string;
    /** Settings from cantara.config.js
     * at the project's root */
    globalCantaraSettings: GlobalCantaraSettings;
  };
}

let globalConfig: CantaraGlobalConfig | undefined = undefined;

export default function getGlobalConfig() {
  if (!globalConfig)
    throw new Error("Cantara's global configuration was not set yet!");
  return globalConfig;
}

/** Returns currently active application
 * or throws an error if there
 * is no active application.
 * Can be used by all scripts which
 * require an active application.
 */
export function getActiveApp(): CantaraApplication {
  const {
    runtime: {
      currentCommand: { app: activeApp },
    },
  } = getGlobalConfig();
  if (!activeApp) {
    throw new Error('No active application in current Cantara runtime!');
  }
  return activeApp;
}

export async function configureCantara(config: CantaraInitialConfig) {
  const staticFilesPath = path.join(config.packageRootDir, 'static');
  const tempFolder = path.join(staticFilesPath, '.temp');
  const projectDir = config.projectDir || process.cwd();
  const cantaraProjectMetaFolderPath = path.join(projectDir, '.cantara');

  const allApps = await getAllApps({
    rootDir: projectDir,
    stage: config.stage,
    activeAppName: config.currentCommand.appname,
  });
  const currentActiveApp = config.currentCommand.appname
    ? allApps.find(app => app.name === config.currentCommand.appname)
    : undefined;

  if (config.currentCommand.appname && !currentActiveApp) {
    throw new Error(
      `Application "${config.currentCommand.appname}" does not exist.`,
    );
  }

  const packageAliases = getAllPackageAliases({
    allApps,
  });
  const appDependencyAliases = currentActiveApp
    ? getDependencyAliases(currentActiveApp)
    : {};

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
    allApps,
    allPackages: {
      include: allApps
        .filter(
          app => app.type === 'js-package' || app.type === 'react-component',
        )
        .map(app => app.paths.src),
    },
    dependencies: {
      react: reactDependencies,
      typescript: typescriptDependencies,
      testing: testingDependencies,
      common: commonDependencies,
    },
    internalPaths: {
      root: config.packageRootDir,
      static: staticFilesPath,
      temp: tempFolder,
      nodeModules: nodeModulesPath,
    },
    runtime: {
      projectDir,
      dotCantaraDir: cantaraProjectMetaFolderPath,
      globalCantaraSettings,
      stage: config.stage,
      currentCommand: {
        name: config.currentCommand.name,
        app: currentActiveApp,
        additionalCliOptions: config.additionalCliOptions || '',
      },
      secrets: loadSecrets({ projectDir, secrets: EXPECTED_CANTARA_SECRETS }),
      aliases: {
        packageAliases,
        appDependencyAliases,
      },
    },
  };
  globalConfig = configToUse;
  return globalConfig;
}
