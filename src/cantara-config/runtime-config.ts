import { CantaraApplication } from '../util/types';
import getGlobalConfig from './global-config';
import loadAppEnvVars from './envvars';
import deriveStageNameFromCmd from '../util/deriveStage';

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
  const { allApps, projectDir } = getGlobalConfig();

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

  runtimeConfig = {
    env: envVars,
    currentCommand: {
      name: currentCommand.name,
      app: currentActiveApp,
    },
    stage,
  };

  return runtimeConfig;
}
