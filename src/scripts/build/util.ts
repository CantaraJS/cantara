import c from 'ansi-colors';
import { existsSync, readdirSync, statSync } from 'fs';
import path from 'path';
import prettyMs from 'pretty-ms';
import del from 'del';

interface LogBuildTimeParams {
  toolName: string;
  stepName: string;
}

export function logBuildTime({ toolName, stepName }: LogBuildTimeParams) {
  const startTime = Date.now();
  console.log(`${c.cyan(`[${toolName}]`)} ${c.gray(`${stepName}...`)}`);

  return () => {
    const elapsed = Date.now() - startTime;
    const elapsedTimePretty = prettyMs(elapsed);
    console.log(
      `${c.cyan(`[${toolName}]`)} ${c.magenta(
        `${stepName} took`,
      )} ${c.cyanBright(elapsedTimePretty)}`,
    );
  };
}

interface PrepareTypesOutputFolderParams {
  typesFolder: string;
  packageFolderName: string;
}

/**
 * Checks if there are multiple
 * generated type folders. If that's
 * the case, all but the relevant one
 * are deleted. The function returns
 * the path of the index.d.ts file
 * of the package, which needs to be
 * referenced inside the package.json
 */
export async function prepareTypesOutputFolder({
  typesFolder,
  packageFolderName,
}: PrepareTypesOutputFolderParams) {
  const indexDeclarationFilePath = path.join(typesFolder, 'index.d.ts');
  const isIndexFileAvailable = existsSync(indexDeclarationFilePath);
  if (isIndexFileAvailable) {
    return './build/types/index.d.ts';
  }

  // Delete all non relevant folders
  const folderContents = readdirSync(typesFolder);
  for (const folderEntry of folderContents) {
    const fullPath = path.join(typesFolder, folderEntry);
    const isDir = statSync(fullPath).isDirectory();
    if (isDir && folderEntry !== packageFolderName) {
      await del(fullPath, { force: true });
    }
  }

  return `./build/types/${packageFolderName}/src/index.d.ts`;
}
