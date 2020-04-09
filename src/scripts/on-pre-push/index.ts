import path from 'path';

import {
  getCurrentBranchName,
  getUnpushedCommits,
  amendChanges,
  pullChanges,
} from './util';
import { writeJson } from '../../util/fs';
import getGlobalConfig from '../../cantara-config/global-config';

/**
 * Execute this function always
 * before the user is executing
 * 'git push'. Cantara implements
 * this using git hooks.
 * It saves all needed information
 * to be able to execute
 * '*-changed' commands in CI.
 */
export default async function onPrePush() {
  const { projectDir: repoDir, dotCantaraDir } = getGlobalConfig();
  // pull possible differences
  await pullChanges({ repoDir });

  // Get branch name
  const currentBranch = await getCurrentBranchName({ repoDir });

  const unpushedCommits = await getUnpushedCommits({
    localBranch: currentBranch,
    remoteBranch: `origin/${currentBranch}`,
    repoDir,
  });

  // Save commit range to <projectDir>/.cantara/ci.json
  const cantaraCiFilePath = path.join(dotCantaraDir, 'ci.json');
  const lastCommit = unpushedCommits[unpushedCommits.length - 1];
  if (lastCommit) {
    const ciFileContent = {
      fromCommit: lastCommit,
    };
    writeJson(cantaraCiFilePath, ciFileContent);

    await amendChanges({ repoDir });
  }
}
