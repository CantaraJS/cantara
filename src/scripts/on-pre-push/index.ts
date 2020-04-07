import path from 'path';

import getGlobalConfig from '../../cantara-config';
import { getCurrentBranchName, getUnpushedCommits, amendChanges } from './util';
import { writeJson } from '../../util/fs';

/**
 * Execute this function always
 * before the user is executing
 * 'git push'. Cantara implements
 * this using husky.
 * It saves all needed information
 * to be able to execute
 * '*-changed' commands in CI.
 */
export default async function onPrePush() {
  const {
    runtime: { projectDir: repoDir, dotCantaraDir },
  } = getGlobalConfig();
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
