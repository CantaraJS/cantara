import execCmd from '../../util/exec';

interface GitCmdBaseParams {
  repoDir: string;
}

interface GetUnpushedCommitsParams extends GitCmdBaseParams {
  remoteBranch: string;
  localBranch: string;
}

export async function getUnpushedCommits({
  localBranch,
  remoteBranch,
  repoDir,
}: GetUnpushedCommitsParams) {
  try {
    const cmd = `git log ${remoteBranch}..${localBranch} --pretty=%H`;
    const res = await execCmd(cmd, { workingDirectory: repoDir });
    const unpushedCommits = res
      .toString()
      .trim()
      .split('\n');
    return unpushedCommits;
  } catch (e) {
    return [];
  }
}

export async function getCurrentBranchName({ repoDir }: GitCmdBaseParams) {
  const res = await execCmd('git rev-parse --abbrev-ref HEAD', {
    workingDirectory: repoDir,
  });
  return res.toString().trim();
}

export async function amendChanges({ repoDir }: GitCmdBaseParams) {
  // Amend changes to last commit
  await execCmd('git add .', { workingDirectory: repoDir });
  await execCmd('git commit --amend --no-edit --no-verify', {
    workingDirectory: repoDir,
  });
}

export async function pullChanges({ repoDir }: GitCmdBaseParams) {
  await execCmd('git pull', {
    workingDirectory: repoDir,
  });
}
