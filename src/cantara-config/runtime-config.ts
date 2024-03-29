import { CantaraApplication } from '../util/types';
import getGlobalConfig from './global-config';
import loadAppEnvVars from './envvars';
import deriveStageNameFromCmd from '../util/deriveStage';
import {
  excludeInexistentPackages,
  getNodeModulesResolvingOrder,
  linkedPackagesToWebpackAliases,
  linkedPackagesToWebpackInclude,
} from '../util/live-link';
import path from 'path';
import { existsSync } from 'fs';
import { fsExists } from '../util/fs';

export interface CantaraRuntimeConfig {
  /** Information about current command */
  currentCommand: {
    name: string;
    app: CantaraApplication;
  };
  stage: string;
  /** Environment variables loaded from
   * either a .env.<stage> file or process.env
   */
  env: { [key: string]: string };
  /**
   * `node_modules` folders which
   * get searched to resolve modules.
   * Only relevant during development
   * because of Cantara Live Link
   */
  resolveModulesInDevelopment: string[];
  includes: {
    /** Only during development */
    linkedPackages: string[];
  };
  /** Aliases which need to be set by
   * tools like webpack
   */
  aliases: {
    linkedPackageAliases: { [key: string]: string };
    /**
     * Runtime Preset Entry file
     * and other utility runtime
     * aliases if needed
     */
    otherAliases: { [key: string]: string };
  };
  /**
   * Name of a runtime
   * preset of the current active
   * application
   */
  activeRuntimeApplicationPresetName?: string;
  /**
   * Additional TS files which
   * need to be included in
   * tsconfig.json
   */
  tsFilesToInclude: string[];
}

interface LoadCantaraRuntimeConfigOptions {
  currentCommand: {
    name: string;
    appname: string;
  };
  stage: string;
  activeRuntimeApplicationPresetName?: string;
}

let runtimeConfig: CantaraRuntimeConfig | undefined = undefined;

export default function getRuntimeConfig() {
  if (!runtimeConfig)
    throw new Error("Cantara's runtime configuration was not set yet!");
  return runtimeConfig;
}

/**
 * Loads runtime config
 * based on current command.
 * Expects global Cantara config
 * to be loaded.
 */
export async function loadCantaraRuntimeConfig({
  currentCommand,
  stage: stageParam,
  activeRuntimeApplicationPresetName,
}: LoadCantaraRuntimeConfigOptions) {
  const {
    allApps,
    projectDir,
    internalPaths: { nodeModules: cantaraNodeModulesPath },
    projectPersistanceData,
  } = getGlobalConfig();

  let linkedPackageAliases: {
    [key: string]: string;
  } = {};

  let linkedPackageIncludes: string[] = [];
  let { linkedPackages: projectLinkedPackages } = projectPersistanceData;
  let tsFilesToInclude: string[] = [];

  if (currentCommand.name === 'dev') {
    projectLinkedPackages = excludeInexistentPackages(projectLinkedPackages);
    // Cantara Live Link is only active during development
    linkedPackageAliases = linkedPackagesToWebpackAliases(
      projectLinkedPackages,
    );
    linkedPackageIncludes = linkedPackagesToWebpackInclude(
      projectLinkedPackages,
    );
    // Include global.d.ts file of the package's project
    // (if exists)
    const packagesRootGlobalTsFiles = [
      ...new Set(
        projectLinkedPackages
          .map((packagePath) => path.join(packagePath, '../..', 'global.d.ts'))
          .filter(existsSync),
      ),
    ];
    tsFilesToInclude = packagesRootGlobalTsFiles;
  }

  const stage =
    !stageParam || stageParam === 'not_set'
      ? process.env.STAGE || deriveStageNameFromCmd(currentCommand.name)
      : stageParam;

  console.log(`[STAGE]: ${stage}`);

  const currentActiveApp = allApps.find(
    (app) => app.name === currentCommand.appname,
  );
  if (!currentActiveApp) {
    throw new Error(`No app with the name ${currentCommand.appname}!`);
  }

  const envVars = await loadAppEnvVars({
    projectRootDir: projectDir,
    appRootDir: currentActiveApp.paths.root,
    currentStage: stage,
    expectedEnvVars: currentActiveApp.meta.env || [],
    required: true,
  });

  const resolveModulesInDevelopment = getNodeModulesResolvingOrder({
    activeApp: currentActiveApp,
    cantaraNodeModulesPath,
    linkedPackages: projectLinkedPackages,
    projectRoot: projectDir,
  });

  const doRuntimePresetsExist = await fsExists(
    currentActiveApp.paths.runtimePresets,
  );

  // Set app aliases as global aliases. Those aliases will be ignored
  // by TypeScript, so they don't overwrite each other with local
  // app aliases
  const otherAliases: { [key: string]: string } = currentActiveApp.aliases;

  runtimeConfig = {
    env: envVars,
    currentCommand: {
      name: currentCommand.name,
      app: currentActiveApp,
    },
    stage,
    resolveModulesInDevelopment,
    aliases: {
      linkedPackageAliases,
      otherAliases,
    },
    includes: {
      linkedPackages: linkedPackageIncludes,
    },
    activeRuntimeApplicationPresetName,
    tsFilesToInclude,
  };

  return runtimeConfig;
}
