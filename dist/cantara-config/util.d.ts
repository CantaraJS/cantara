import { CantaraApplication } from '../util/types';
interface GetAllAppsOptions {
    rootDir: string;
    stage: string;
    /** Name of currently active app */
    activeAppName?: string;
}
/** Returns list of all React Apps, Packages and Node Apps */
export default function getAllApps({ rootDir, stage, activeAppName, }: GetAllAppsOptions): CantaraApplication[];
interface LoadSecretsParams {
    projectDir: string;
    /** Array of secret identifiers, e.g. ['AWS_ACCESS_KEY_ID'] */
    secrets: string[];
}
/** Loads and parses the content from the user's .secrets.json file
 * in the project root. Here, Cantara specific secrets can be stored.
 * E.g. AWS keys. Can also be passed in as environment variables.
 */
export declare function loadSecrets({ projectDir, secrets: identifiers, }: LoadSecretsParams): {
    [key: string]: string | undefined;
};
export {};
