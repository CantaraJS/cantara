import execCmd from '../../util/exec';

interface GetFilesChangedSinceCommitParams {
  fromCommit: string;
  repoDir: string;
}

export async function getFilesChangedSinceCommit({
  fromCommit,
  repoDir,
}: GetFilesChangedSinceCommitParams) {
  const res = (
    await execCmd(`git diff ${fromCommit}~1 HEAD --name-only`, {
      workingDirectory: repoDir,
    })
  ).toString();

  const changedFiles = res.trim().split('\n');
  return changedFiles;
}
