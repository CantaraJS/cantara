interface ExecOptions {
    /** Defaults to current process.cwd() */
    workingDirectory?: string;
    /** Redirect stdin and stdio to current process */
    redirectIo?: boolean;
}
/** Execute commands in different contexts and
 * with different folders in PATH.
 */
export default function execCmd(cmd: string, { workingDirectory, redirectIo }?: ExecOptions): Promise<unknown>;
export {};
