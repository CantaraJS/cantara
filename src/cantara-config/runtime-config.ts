import { CantaraApplication } from '../util/types';
import getGlobalConfig from './global-config';
import loadAppEnvVars from './envvars';
import deriveStageNameFromCmd from '../util/deriveStage';
import {
  getNodeModulesResolvingOrder,
  linkedPackagesToWebpackAliases,
  linkedPackagesToWebpackInclude,
} from '../util/live-link';

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
  };
}

interface LoadCantaraRuntimeConfigOptions {
  currentCommand: {
    name: string;
    appname: string;
  };
  stage: string;
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
}: LoadCantaraRuntimeConfigOptions) {
  const {
    allApps,
    projectDir,
    internalPaths: { nodeModules: cantaraNodeModulesPath },
    projectPersistanceData,
  } = getGlobalConfig();

  const { linkedPackages: projectLinkedPackages } = projectPersistanceData;
  const linkedPackageAliases = linkedPackagesToWebpackAliases(
    projectLinkedPackages,
  );
  const linkedPackageIncludes = linkedPackagesToWebpackInclude(
    projectLinkedPackages,
  );

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
    },
    includes: {
      linkedPackages: linkedPackageIncludes,
    },
  };

  return runtimeConfig;
}
