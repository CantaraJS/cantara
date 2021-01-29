import path from 'path';
import dotenv from 'dotenv';
import updateNotifier from 'update-notifier';
import { fsReadFile } from '../util/fs';

/** "Normalizes" the behaviour of the CLI
 * no matter if Cantara is executed by the user
 * in a project folder or by nodemon in
 * development mode
 */
export function setupCliContext() {
  // Set CWD to path of Cantara
  process.chdir(path.join(__dirname, '..', '..'));
}

/**
 * Loads .env file for development
 * (only during development)
 */
export function loadEnv() {
  if (process.env.NODE_ENV === 'development') {
    dotenv.config();
  }
}

/**
 * Catch uncaught errors
 */
export function setupErrorHandling() {
  process.on('uncaughtException', (err) => {
    console.log(err);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
  });
}

/**
 * Returns the path of the
 * user's project.
 * Only call this function after
 * dotenv has been executed!
 */
export function getProjectPath(): string {
  const userProjectPath =
    process.env.NODE_ENV === 'development'
      ? (process.env.DEV_PROJECT_PATH as string)
      : process.cwd();
  return userProjectPath;
}

export async function loadPackageJson() {
  const packageJsonPath = path.resolve('package.json');
  const fileContent = (await fsReadFile(packageJsonPath)).toString();
  return JSON.parse(fileContent);
}

/**
 * Display an info message if
 * an update is available
 */
export function checkForUpdates(packageJson: any) {
  updateNotifier({ pkg: packageJson }).notify({
    boxenOptions: {
      borderColor: 'cyan',
      borderStyle: {
        bottomLeft: 'round',
        bottomRight: 'round',
        topLeft: 'round',
        topRight: 'round',
        horizontal: 'round',
        vertical: 'round',
      },
    },
  });
}
