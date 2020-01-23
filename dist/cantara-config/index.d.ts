import { CantaraApplication } from '../util/types';
interface CantaraInitialConfig {
    /** Where the cantara package itself lives */
    packageRootDir: string;
    /** Path of Cantara project */
    projectDir?: string;
    currentCommand: {
        name: string;
        appname: string;
    };
    stage: string;
    /** Unknown options for 3rd party CLI programs, e.g. Jest.
     * Options which are foreign to Cantara are included
     * in this string.
     */
    additionalCliOptions?: string;
}
declare type Dependencies = {
    [key: string]: string;
};
interface CantaraGlobalConfig {
    allApps: CantaraApplication[];
    allPackages: {
        /** Include all those paths into webpack configs */
        include: string[];
    };
    aliases: {
        packageAliases: {
            [key: string]: string;
        };
        appDependencyAliases: {
            [key: string]: string;
        };
    };
    dependencies: {
        /** Current React and React DOM version */
        react: Dependencies;
        /** Dependencies needed for TS
         * (including all type declarations packages)
         */
        typescript: Dependencies;
        /** Dependecies needed for testing */
        testing: Dependencies;
    };
    /** Paths used internally by Cantara */
    internalPaths: {
        static: string;
        /** Where the cantara package itself lives */
        root: string;
        /** Folder for temporary files (excluded from version control) */
        temp: string;
    };
    /** Current runtime configuration (e.g. the command the user executed, the location of it etc.) */
    runtime: {
        /** Working directory where user executed Cantara */
        projectDir: string;
        /** Information about current command */
        currentCommand: {
            name: string;
            additionalCliOptions: string;
            app: CantaraApplication;
        };
        /** Secrets from user's .secrets.json file */
        secrets: {
            AWS_ACCESS_KEY_ID?: string;
            AWS_SECRET_ACCESS_KEY?: string;
        };
    };
}
export default function getGlobalConfig(): CantaraGlobalConfig;
/** Config can only be set once */
export declare function configureCantara(config: CantaraInitialConfig): CantaraGlobalConfig;
export {};
