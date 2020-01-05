import { spawn, exec } from 'child_process';

interface ExecOptions {
  /** Defaults to current process.cwd() */
  workingDirectory?: string;
  /** Redirect stdin and stdio to current process */
  redirectIo?: boolean;
}

/** Execute commands in different contexts and
 * with different folders in PATH.
 */
export default function execCmd(
  cmd: string,
  { workingDirectory = process.cwd(), redirectIo }: ExecOptions = {},
) {
  return new Promise((resolve, reject) => {
    const newProcess = exec(
      cmd,
      { cwd: workingDirectory },
      (err, stdout, stderr) => {
        if (err) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      },
    );

    if (redirectIo && newProcess.stdout && newProcess.stderr) {
      newProcess.stdout.pipe(process.stdout);
      newProcess.stderr.pipe(process.stderr);
    }
  });
}
