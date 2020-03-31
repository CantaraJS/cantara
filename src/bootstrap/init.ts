import path from 'path';
import deriveStageNameFromCmd from '../util/deriveStage';
import { configureCantara } from '../cantara-config';
import onPreBootstrap from '.';

interface InitializeCantaraOptions {
  appname?: string;
  cmdName: string;
  additionalCliOptions: string;
  userProjectPath: string;
  stage?: string;
  skipBootstrap?: boolean;
}

/**
 * Sets up the Cantara configuration
 * and executes the the "onPreBootstrap"
 * function which sets up the project
 * folder structure etc
 */
export default async function initalizeCantara({
  userProjectPath,
  stage: stageParam,
  cmdName,
  additionalCliOptions,
  appname,
  skipBootstrap,
}: InitializeCantaraOptions) {
  const stage =
    !stageParam || stageParam === 'not_set'
      ? deriveStageNameFromCmd(cmdName)
      : stageParam;
  const cantaraRootDir = path.join(__dirname, '..', '..');
  await configureCantara({
    additionalCliOptions,
    projectDir: userProjectPath,
    packageRootDir: cantaraRootDir,
    currentCommand: {
      appname,
      name: cmdName,
    },
    stage,
  });
  if (!skipBootstrap) {
    await onPreBootstrap();
  }
}
