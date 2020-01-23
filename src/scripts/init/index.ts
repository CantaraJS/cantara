import path from 'path';
import del from 'del';
import { spawnCmd } from '../../util/exec';
import { readdirSync, existsSync } from 'fs';

interface InitializeNewProjectOptions {
  /** name of new project.
   * Will be derived from folder
   * name if not specified.
   */
  projectName?: string;
  /** Root of user's project */
  projectDir: string;
  /** Name of template. If no github username is specified,
   * it will be resolved to "scriptify/<template-name>".
   * A link can also be passed.
   */
  templateName: string;
}

export default async function initializeNewProject({
  projectDir,
  templateName,
}: InitializeNewProjectOptions) {
  const isDirEmpty =
    !existsSync(projectDir) || readdirSync(projectDir).length === 0;
  if (!isDirEmpty) {
    throw new Error(`${projectDir} is not empty. Aborting...`);
  }

  let finalGitLink = templateName;
  if (!templateName.includes('/')) {
    // It's not a link and not a username/repo pair
    finalGitLink = `https://github.com/scriptify/${templateName}.git`;
  }

  if (!templateName.includes('.git') && templateName.includes('/')) {
    finalGitLink = `https://github.com/${templateName}.git`;
  }

  await spawnCmd(`git clone ${finalGitLink} ${projectDir}`, {
    redirectIo: true,
  });
  const gitFolderToDelete = path.join(projectDir, '.git');
  await del(gitFolderToDelete);
  await spawnCmd(`git init ${projectDir}`);
  console.log(
    'Initialized new Cantara project. Type cantara --help to see what you can do next.',
  );
}
