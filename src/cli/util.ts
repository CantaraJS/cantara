import { Command } from 'commander';
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

/** Takes CLI command and removes unknown options
 * from it, so that no error is thrown. Those
 * unknown options are then passed to Cantara,
 * so that they can be used internally to e.g.
 * pass them to another program, for example Jest
 */
export function prepareCmdForCommander(cmd: string[], program: Command) {
  let { unknown } = program.parseOptions(cmd);
  const unknownParams = unknown.join(' ');

  const cmdWithoutUnknownParams = cmd.filter((cmd, i) => {
    if (i <= 2) return true;
    const shouldKeep = !unknown.includes(cmd);
    // Only remove it once
    unknown = unknown.filter(uCmd => uCmd !== cmd);
    return shouldKeep;
  });
  return { cmd: cmdWithoutUnknownParams, unknownParams };
}
