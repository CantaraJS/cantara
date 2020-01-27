interface CommonOptions {
    /** Defaults to current process.cwd() */
    workingDirectory?: string;
    /** Redirect stdin and stdio to current process */
    redirectIo?: boolean;
}
interface SpawnOptions extends CommonOptions {
    env?: {
        [key: string]: string | undefined;
    };
}
export declare function spawnCmd(cmd: string, { workingDirectory, redirectIo, env }?: SpawnOptions): Promise<string | number>;
interface ExecOptions extends CommonOptions {
    withSecrets?: boolean;
}
/** Execute commands in different contexts and
 * with different folders in PATH.
 */
export default function execCmd(cmd: string, { workingDirectory, redirectIo, withSecrets, }?: ExecOptions): Promise<string | number>;
export {};
