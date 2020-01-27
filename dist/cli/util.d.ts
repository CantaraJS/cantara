import { Command } from 'commander';
/** "Normalizes" the behaviour of the CLI
 * no matter if Cantara is executed by the user
 * in a project folder or by nodemon in
 * development mode
 */
export declare function setupCliContext(): void;
/** Takes CLI command and removes unknown options
 * from it, so that no error is thrown. Those
 * unknown options are then passed to Cantara,
 * so that they can be used internally to e.g.
 * pass them to another program, for example Jest
 */
export declare function prepareCmdForCommander(cmd: string[], program: Command): {
    cmd: string[];
    unknownParams: string;
};
