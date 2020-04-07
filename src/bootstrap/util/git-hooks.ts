import path from 'path';
import getGlobalConfig from '../../cantara-config';
import { existsSync, readFileSync, writeFileSync } from 'fs';

/**
 * Creates a "pre-push" file
 * in the .git/hooks folder if
 * it doesn't exist already.
 * If it exists, look if the word
 * "cantara" is contained in it.
 * If not, append the custom command
 * to the end of the file to not
 * overwrite existing scripts
 */
export default async function setupGitHooks() {
  const {
    runtime: { projectDir },
  } = getGlobalConfig();

  const prePushScriptPath = path.join(projectDir, '.git/hooks/pre-push');
  let fileContent = '';
  if (existsSync(prePushScriptPath)) {
    fileContent = readFileSync(prePushScriptPath).toString();
  }
  if (!fileContent.includes('# Cantara')) {
    let appendToFile = ``;
    if (!fileContent.includes('#!/bin/sh')) {
      appendToFile = '#!/bin/sh\n';
    }
    appendToFile += `
# Cantara
cantara on-pre-push
    `;
    writeFileSync(prePushScriptPath, fileContent + appendToFile);
  }
}
