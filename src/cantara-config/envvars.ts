import { existsSync, readFileSync } from 'fs';

import path from 'path';

interface LoadEnvVarFromStageOptions {
  envVarName: string;
  stage: string;
  envFileContent: { [key: string]: string };
}

function loadEnvVarFromStage({
  envVarName,
  stage,
  envFileContent,
}: LoadEnvVarFromStageOptions) {
  const processEnvVarName = `${stage.toUpperCase()}_${envVarName}`;
  const envVarValue =
    envFileContent[envVarName] || process.env[processEnvVarName];

  return envVarValue;
}

/**
 * Parses a .env file and returns and object
 * with it's values.
 * If the file is not found, an empty object
 * is returned.
 */
function parseEnvFile(filePath: string): { [key: string]: string } {
  if (!existsSync(filePath)) return {};
  let result: { [key: string]: string } = {};
  const lines = readFileSync(filePath)
    .toString()
    .split('\n');
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

interface LoadAppEnvVarsOptions {
  appRootDir: string;
  /** Can be specified in app's cantara.config.js */
  expectedEnvVars: string[];
  currentStage: string;
  /** if envvar is not defined in currenStage,
   * this function looks if it is defined
   * in the fallbackStage
   */
  fallbackStage?: string;
  /** Set this to true if an error should
   * be thrown if a variable defined
   * in expectedEnvVars is no presetn
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
export default function loadAppEnvVars({
  appRootDir,
  currentStage,
  expectedEnvVars,
  fallbackStage,
  required,
}: LoadAppEnvVarsOptions) {
  let envVarsToReturn: { [key: string]: string } = { STAGE: currentStage };
  if (expectedEnvVars.length === 0) return envVarsToReturn;
  const envFileName = `.env.${currentStage.toLowerCase()}`;
  const currentStageEnvFile = path.join(appRootDir, envFileName);
  const envFileContent = parseEnvFile(currentStageEnvFile);
  const fallbackEnvFileContent = fallbackStage
    ? parseEnvFile(path.join(appRootDir, `.env.${fallbackStage.toLowerCase()}`))
    : {};
  for (const envVarName of expectedEnvVars) {
    let envVarValue = loadEnvVarFromStage({
      envFileContent,
      envVarName,
      stage: currentStage,
    });
    if (!envVarValue && fallbackStage) {
      envVarValue = loadEnvVarFromStage({
        envFileContent: fallbackEnvFileContent,
        envVarName,
        stage: fallbackStage,
      });
    }
    if (envVarValue === undefined || envVarValue === null) {
      const errMsg = `File ${envFileName} contains no variable named "${envVarName}" and process.env.${currentStage.toUpperCase()}_${envVarName} is not defined in the current environment. It is marked as required in cantara.config.js`;
      if (required) {
        throw new Error(errMsg);
      }
    } else {
      envVarsToReturn[envVarName] = envVarValue;
    }
  }

  // Warnings for ignored env vars in .env file
  const allEnvVarsInEnvFile = Object.keys(envFileContent);
  const ignoredEnvVars = allEnvVarsInEnvFile.filter(
    envName => !expectedEnvVars.includes(envName),
  );
  if (ignoredEnvVars.length > 0) {
    console.warn(
      `The following environment variables are ignored, because they are not present in the cantara.config.js file:\n\t${ignoredEnvVars.join(
        '\n\t',
      )}`,
    );
  }

  return envVarsToReturn;
}
