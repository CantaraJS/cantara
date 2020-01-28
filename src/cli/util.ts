import path from 'path';

/** "Normalizes" the behaviour of the CLI
 * no matter if Cantara is executed by the user
 * in a project folder or by nodemon in
 * development mode
 */
export function setupCliContext() {
  // Set CWD to path of Cantara
  process.chdir(path.join(__dirname, '..', '..'));
}
