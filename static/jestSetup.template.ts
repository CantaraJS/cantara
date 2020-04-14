<--IMPORTS-->
import { readFileSync } from 'fs';

/** Loads envvars from the file cantara created for
 * the testing environment
 */
function loadEnvVars() {
  const cantaraTestEnvVarFile = '<--ENV_FILE_PATH-->';
  try {
    const envJson = JSON.parse(readFileSync(cantaraTestEnvVarFile).toString());
    Object.keys(envJson).forEach(envVarName => {
      process.env[envVarName] = envJson[envVarName];
    });
  } catch (e) {
    console.warn(
      'Could not read generated .env.json. This is likely an error with Cantara itself.',
    );
  }
}

loadEnvVars();
