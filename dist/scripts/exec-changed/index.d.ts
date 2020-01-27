declare type ExecChangeCallback = (changedAppName: string) => Promise<void>;
/** Executes a function for all
 * applications/packages whose code
 * has changed since the last commit.
 * Accepts a function as a parameter
 * which gets executed with the name
 * of the app that changed as it's first
 * parameter
 */
export default function executeForChangedApps(cb: ExecChangeCallback): Promise<void>;
export {};
