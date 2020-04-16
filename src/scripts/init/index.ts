import path from 'path';
import del from 'del';
import { spawnCmd } from '../../util/exec';
import { readdirSync, existsSync } from 'fs';
import c from 'ansi-colors';
import terminalLink from 'terminal-link';

interface InitializeNewProjectOptions {
  /** Optional absolute path/name of new folder */
  newFolderPath?: string;
  /** Name of template. If no github username is specified,
   * it will be resolved to "CantaraJS/<template-name>".
   * A link can also be passed.
   */
  templateName: string;
  cwd: string;
}

export default async function initializeNewProject({
  newFolderPath,
  templateName,
  cwd,
}: InitializeNewProjectOptions) {
  let projectDir = path.join(cwd, templateName);
  if (newFolderPath) {
    if (path.isAbsolute(newFolderPath)) {
      projectDir = newFolderPath;
    } else {
      projectDir = path.join(cwd, newFolderPath);
    }
  }
  const isDirEmpty =
    !existsSync(projectDir) || readdirSync(projectDir).length === 0;
  if (!isDirEmpty) {
    throw new Error(`${projectDir} is not empty. Aborting...`);
  }

  let finalGitLink = templateName;
  if (!templateName.includes('/')) {
    // It's not a link and not a username/repo pair
    finalGitLink = `https://github.com/CantaraJS/${templateName}.git`;
  }

  if (!templateName.includes('.git') && templateName.includes('/')) {
    finalGitLink = `https://github.com/${templateName}.git`;
  }

  await spawnCmd(`git clone "${finalGitLink}" "${projectDir}"`, {
    redirectIo: true,
  });
  const gitFolderToDelete = path.join(projectDir, '.git');
  // Set force to true because gitFolderToDelete is outside CWD
  await del(gitFolderToDelete, { force: true });
  await spawnCmd(`git init "${projectDir}"`);
  console.log(`
    Initialized new Cantara project.
    
    Execute:
    ${c.cyan(`cd ${path.basename(projectDir)}`)}
    ${c.cyan(`ctra`)}

    This will get you up and running with your new project.
    
    Here are some links for further information:
    ${terminalLink('Website', c.magenta('https://cantara.js.org'))}
    ${terminalLink(
      'Quick Start',
      c.magenta('https://cantara.js.org/docs/quick_start'),
    )}
    ${terminalLink('Community', c.magenta('https://spectrum.chat/cantara'))}

    Have fun!
  `);
}
