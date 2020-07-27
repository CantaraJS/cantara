import path from 'path';

import { getCurrentBranchName, getUnpushedCommits, amendChanges } from './util';
import { writeJson } from '../../util/fs';
import getGlobalConfig from '../../cantara-config/global-config';

/**
 * Execute this function always
 * before the user is executing
 * 'git commit'. Cantara implements
 * this using git hooks.
 * It saves all needed information
 * to be able to execute
 * '*-changed' commands in CI.
 */
export default async function onPreCommit() {
  const { projectDir: repoDir, dotCantaraDir } = getGlobalConfig();
  // await pullChanges({ repoDir });

  console.log('[Cantara] recording unpushed commits');

  try {
    // Get branch name
    const currentBranch = await getCurrentBranchName({ repoDir });
    let unpushedCommits = await getUnpushedCommits({
      localBranch: currentBranch,
      remoteBranch: `origin/${currentBranch}`,
      repoDir,
    });

    if (unpushedCommits.length === 1) {
      // We amend the changes in the ci.json file,
      // that's why the hash of the latest commit
      // will change and thus won't be available
      // after that. So instead of saving
      // the hash, set it to HEAD, so when
      // exec-changed  is executed, it will look
      // for differences between HEAD and HEAD~1
      unpushedCommits = ['HEAD'];
    }

    // Save commit range to <projectDir>/.cantara/ci.json
    const cantaraCiFilePath = path.join(dotCantaraDir, 'ci.json');
    const lastCommit = unpushedCommits[unpushedCommits.length - 1];
    if (lastCommit) {
      const ciFileContent = {
        fromCommit: lastCommit,
        test: Date.now(),
      };
      writeJson(cantaraCiFilePath, ciFileContent);
      await amendChanges({ repoDir });
    }
  } catch (e) {
    console.log('No commits to record yet.');
  }
}
