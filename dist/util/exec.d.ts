interface ExecOptions {
    /** Defaults to current process.cwd() */
    workingDirectory?: string;
    /** Redirect stdin and stdio to current process */
    redirectIo?: boolean;
    /** If set to true, variables defined in user's .secrets.json
     * file are set as env vars for this command
     */
    withSecrets?: boolean;
}
/** Execute commands in different contexts and
 * with different folders in PATH.
 */
export default function execCmd(cmd: string, { workingDirectory, redirectIo, withSecrets, }?: ExecOptions): Promise<unknown>;
export {};
