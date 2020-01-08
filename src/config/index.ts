import path from 'path';

import getAllApps from './util';
import { CantaraApplication } from '../util/types';

import { readFileSync } from 'fs';
import getAllPackageAliases from './aliases';

interface CantaraInitialConfig {
  /** Where the cantara package itself lives */
  packageRootDir: string;
  /** Path of Cantara project */
  projectDir?: string;
  currentCommand: {
    name: string;
    appname: string;
  };
}

interface CantaraGlobalConfig {
  allApps: CantaraApplication[];
  allPackages: {
    aliases: { [key: string]: string };
    /** Include all those paths into webpack configs */
    include: string[];
  };
  dependencies: {
    /** Dependecies for React apps/components */
    react: { [key: string]: string };
  };
  /** Paths used internally by Cantara */
  internalPaths: {
    static: string;
    /** Where the cantara package itself lives */
    root: string;
  };
  /** Current runtime configuration (e.g. the command the user executed, the location of it etc.) */
  runtime: {
    /** Working directory where user executed Cantara */
    projectDir: string;
    /** Information about current command */
    currentCommand: {
      name: string;
      app: CantaraApplication;
    };
  };
}

let globalConfig: CantaraGlobalConfig | undefined = undefined;

export default function getGlobalConfig() {
  if (!globalConfig)
    throw new Error("Cantara's global configuration was not set yet!");
  return globalConfig;
}

/** Config can only be set once */
export function configureCantara(config: CantaraInitialConfig) {
  const staticFilesPath = path.join(config.packageRootDir, 'static');
  const reactDependecies = JSON.parse(
    readFileSync(
      path.join(staticFilesPath, 'react-dependencies.json'),
    ).toString(),
  );
  const projectDir = config.projectDir || process.cwd();
  const allApps = getAllApps(projectDir);
  const currentActiveApp = allApps.find(
    app => app.name === config.currentCommand.appname,
  );
  if (!currentActiveApp) {
    throw new Error(
      `The app "${config.currentCommand.appname}" does not exist.`,
    );
  }
  const configToUse: CantaraGlobalConfig = {
    allApps,
    allPackages: {
      aliases: getAllPackageAliases(allApps),
      include: allApps
        .filter(
          app => app.type === 'js-package' || app.type === 'react-component',
        )
        .map(app => app.paths.src),
    },
    dependencies: {
      react: reactDependecies,
    },
    internalPaths: {
      root: config.packageRootDir,
      static: staticFilesPath,
    },
    runtime: {
      projectDir,
      currentCommand: {
        name: config.currentCommand.name,
        app: currentActiveApp,
      },
    },
  };
  globalConfig = Object.freeze(configToUse);
}
