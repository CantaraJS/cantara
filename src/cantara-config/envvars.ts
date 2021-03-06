import { existsSync } from 'fs';

import path from 'path';
import { fsReadFile } from '../util/fs';
/**
 * Parses a .env file and returns and object
 * with it's values.
 * If the file is not found, an empty object
 * is returned.
 */
async function parseEnvFile(
  filePath: string,
): Promise<{ [key: string]: string }> {
  if (!existsSync(filePath)) return {};
  let result: { [key: string]: string } = {};
  const lines = (await fsReadFile(filePath)).toString().split('\n');

  for (const line of lines) {
    const match = line.match(/^([^=:#]+?)[=:](.*)/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      result[key] = value;
    }
  }
  return result;
}

/**
 * Loads, parses and merges multiple
 * env files
 */
async function loadMultipleEnvFiles(envFilePaths: string[]) {
  let mergedEnvVars: { [key: string]: string } = {};
  for (const envFilePath of envFilePaths) {
    const envFileContent = await parseEnvFile(envFilePath);
    mergedEnvVars = {
      ...mergedEnvVars,
      ...envFileContent,
    };
  }
  return mergedEnvVars;
}

interface LoadEnvVarFromStageOptions {
  envVarName: string;
  stage: string;
  envFilesContent: { [key: string]: string };
}

function loadEnvVarFromStage({
  envVarName,
  stage,
  envFilesContent,
}: LoadEnvVarFromStageOptions) {
  const processEnvVarName = `${stage.toUpperCase()}_${envVarName}`;
  const envVarValue =
    process.env[processEnvVarName] || envFilesContent[envVarName];
  return envVarValue;
}

interface GetEnvFilePathsOptions {
  currentStage: string;
  appRootDir: string;
  projectRootDir: string;
}

/**
 * Returns an array of .env file paths
 * which may be parsed if they exist,
 * based on the current stage
 */
function getEnvFilePaths({
  currentStage,
  appRootDir,
  projectRootDir,
}: GetEnvFilePathsOptions): { path: string; type: string }[] {
  const fileNames = Array.from(
    new Set(
      ['.env', `.env.${currentStage.toLowerCase()}`].filter(
        Boolean,
      ) as string[],
    ),
  );
  const rootDirs = [
    { path: appRootDir, type: 'local' },
    { path: projectRootDir, type: 'global' },
  ];
  return fileNames
    .map((envFileName) => {
      const envFilePaths = rootDirs.map((rootDir) => ({
        path: path.join(rootDir.path, envFileName),
        type: rootDir.type,
      }));
      return envFilePaths;
    })
    .flat();
}

interface LoadAppEnvVarsOptions {
  appRootDir: string;
  projectRootDir: string;
  /** Can be specified in app's cantara.config.js */
  expectedEnvVars: (string | { var: string; optional?: boolean })[];
  currentStage: string;
  /** Set this to true if an error should
   * be thrown if a variable defined
   * in expectedEnvVars is no present
   */
  required?: boolean;
}

/**
 * Loads env vars from either the current
 * stage's env file (.env.<stage>) or, if
 * not defined, from process.env.STAGENAME_*.
 * If neither of both is defined,
 * you can define a fallback stage. If that
 * is set, the envvars of thats stage
 * are used if defined.
 * If an env var in the array expectedEnvVars
 * is not defined, an error is thrown.
 * Additional env vars in the .env file
 * are ignored and a warning is shown.
 * The resulting object can later on
 * be used by the WebpackDefinePlugin.
 * If an environment variable is needed
 * in more than one app (e.g. two
 * serverless endpoints), you can create
 * a .env.<stage> file in the root
 * of your project.
 *
 * Example:
 * Assume the envvar DB_CONNECTION_STR is required
 * and you want to compile and deploy the project
 * (e.g. CI server).
 * You can either define it in the environment
 * by setting process.env.PRODUCTION_DB_CONNECTION_STR
 * or by genereating the file .env.production with
 * DB_CONNECTION_STR defined in it at runtime.
 * Prefixing the envvars prevents you from accidently
 * using the wrong envvars.
 */
export default async function loadAppEnvVars({
  appRootDir,
  currentStage,
  expectedEnvVars,
  required,
  projectRootDir,
}: LoadAppEnvVarsOptions) {
  let envVarsToReturn: { [key: string]: string } = { STAGE: currentStage };
  if (expectedEnvVars.length === 0) return envVarsToReturn;
  const envFilePaths = getEnvFilePaths({
    appRootDir,
    currentStage,
    projectRootDir,
  });
  const globalEnvVars = await loadMultipleEnvFiles(
    envFilePaths.filter((p) => p.type === 'global').map((p) => p.path),
  );
  const localEnvVars = await loadMultipleEnvFiles(
    envFilePaths.filter((p) => p.type === 'local').map((p) => p.path),
  );

  const envFilesContent = {
    ...globalEnvVars,
    ...localEnvVars,
  };

  for (const currentEnvVar of expectedEnvVars) {
    let envVarName =
      typeof currentEnvVar == 'string' ? currentEnvVar : currentEnvVar.var;
    let envVarOptional = (currentEnvVar as any).optional || false;
    let envVarValue =
      loadEnvVarFromStage({
        envFilesContent,
        envVarName,
        stage: currentStage,
      }) || (currentEnvVar as any).value;
    if (envVarValue === undefined || envVarValue === null) {
      const errMsg = `[${envFilePaths
        .map((f) => f.path)
        .join(
          ', ',
        )}] contain no variable named "${envVarName}" and process.env.${currentStage.toUpperCase()}_${envVarName} is not defined in the current environment. It is marked as required in cantara.config.js`;
      if (required && envVarOptional == false) {
        throw new Error(errMsg);
      }
    } else {
      envVarsToReturn[envVarName] = envVarValue;
    }
  }

  // Warnings for ignored env vars in local .env file
  const allEnvVarsInEnvFile = Object.keys(localEnvVars);
  const ignoredEnvVars = allEnvVarsInEnvFile.filter(
    (envName) =>
      !!!expectedEnvVars.find((v) =>
        typeof v == 'string' ? v == envName : v.var == envName,
      ),
  );
  if (ignoredEnvVars.length > 0) {
    console.warn(
      `The following environment variables are ignored, because they are not present in the cantara.config.js file:\n\t${ignoredEnvVars.join(
        '\n\t',
      )}`,
    );
  }

  // Set stage env var
  envVarsToReturn.STAGE = currentStage;

  return envVarsToReturn;
}
