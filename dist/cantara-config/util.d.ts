import { CantaraApplication } from '../util/types';
interface GetAllAppsOptions {
    rootDir: string;
    stage: string;
    /** Name of currently active app */
    activeAppName?: string;
}
/** Returns list of all React Apps, Packages and Node Apps */
export default function getAllApps({ rootDir, stage, activeAppName, }: GetAllAppsOptions): CantaraApplication[];
/** Loads and parses the content from the user's .secrets.json file
 * in the project root. Here, Cantara specific secrets can be stored.
 * E.g. AWS keys
 */
export declare function loadSecrets(projectDir: string): {};
export {};
