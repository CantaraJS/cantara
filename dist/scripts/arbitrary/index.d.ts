/**
 * This function is executed if no cantara command
 * was matched. First, look if it is an NPM command.
 * If not, try to execute it as an arbitrary command
 * with the package's/app's root as the CWD.
 */
export default function executeArbitraryCmdWithinApp(args: string[]): void;
