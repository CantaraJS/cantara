import path from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import getGlobalConfig from '../../cantara-config/global-config';

/**
 * Creates a "pre-commit" file
 * in the .git/hooks folder if
 * it doesn't exist already.
 * If it exists, look if the word
 * "cantara" is contained in it.
 * If not, append the custom command
 * to the end of the file to not
 * overwrite existing scripts
 */
export default async function setupGitHooks() {
  const { projectDir } = getGlobalConfig();

  const preCommitScriptPath = path.join(projectDir, '.git/hooks/pre-commit');
  let fileContent = '';
  if (existsSync(preCommitScriptPath)) {
    fileContent = readFileSync(preCommitScriptPath).toString();
  }
  if (!fileContent.includes('# Cantara')) {
    let appendToFile = ``;
    if (!fileContent.includes('#!/bin/sh')) {
      appendToFile = '#!/bin/sh\n';
    }
    appendToFile += `
# Cantara
cantara on-pre-commit
    `;
    writeFileSync(preCommitScriptPath, fileContent + appendToFile);
  }
}
