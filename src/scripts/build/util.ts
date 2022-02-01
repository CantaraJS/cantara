import c from 'ansi-colors';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import path from 'path';
import prettyMs from 'pretty-ms';
import del from 'del';
import webpack from 'webpack';

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

interface AddReferenceToIndexTypeFileParams {
  refFileNames: string[];
  indexDeclarationFilePath: string;
}

function addReferenceToIndexTypeFile({
  refFileNames,
  indexDeclarationFilePath,
}: AddReferenceToIndexTypeFileParams) {
  const indexDeclarationFileContent = readFileSync(
    indexDeclarationFilePath,
    'utf8',
  );
  const newIndexDeclarationFileContent = `
${refFileNames
  .map((refFileName) => `/// <reference path="./${refFileName}" />`)
  .join('\n')}
${indexDeclarationFileContent}
  `;
  writeFileSync(indexDeclarationFilePath, newIndexDeclarationFileContent);
}

interface PrepareTypesOutputFolderParams {
  typesFolder: string;
  packageFolderName: string;
  customTypeFiles: string[];
  appRootPath: string;
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
  customTypeFiles,
  appRootPath,
}: PrepareTypesOutputFolderParams) {
  let typesSrcFolder = '';
  const indexDeclarationFilePath = path.join(typesFolder, 'index.d.ts');
  const isIndexFileAvailable = existsSync(indexDeclarationFilePath);
  if (isIndexFileAvailable) {
    typesSrcFolder = './build/types';
  } else {
    // Delete all non relevant folders
    const folderContents = readdirSync(typesFolder);
    for (const folderEntry of folderContents) {
      const fullPath = path.join(typesFolder, folderEntry);
      const isDir = statSync(fullPath).isDirectory();
      if (isDir && folderEntry !== packageFolderName) {
        await del(fullPath, { force: true });
      }
    }

    // Copy custom .d.ts files to the output folder
    typesSrcFolder = `./build/types/${packageFolderName}/src`;
  }

  mkdirSync(typesSrcFolder, { recursive: true });

  for (const customTypeFile of customTypeFiles) {
    const typeFileName = path.basename(customTypeFile);
    copyFileSync(
      customTypeFile,
      path.join(appRootPath, typesSrcFolder, typeFileName),
    );
  }

  addReferenceToIndexTypeFile({
    refFileNames: customTypeFiles.map((customTypeFile) =>
      path.basename(customTypeFile),
    ),
    indexDeclarationFilePath: path.join(
      appRootPath,
      typesSrcFolder,
      'index.d.ts',
    ),
  });

  return `${typesSrcFolder}/index.d.ts`;
}

export function compile(config: webpack.Configuration): Promise<void> {
  const onComplete = logBuildTime({
    stepName: 'Compiling optimized bundle',
    toolName: 'Webpack',
  });
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack);
        if ((err as any).details) {
          console.error((err as any).details);
        }
        reject(new Error('Error while compiling.'));
        return;
      }

      console.log(
        stats?.toString({
          chunks: false,
          colors: true,
        }),
      );
      compiler.close(() => {});
      onComplete();
      if (stats?.hasErrors()) {
        reject(new Error('Error while compiling.'));
        return;
      }
      resolve();
    });
  });
}
