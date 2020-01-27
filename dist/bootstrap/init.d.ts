interface InitializeCantaraOptions {
    appname?: string;
    cmdName: string;
    additionalCliOptions: string;
    userProjectPath: string;
    stage?: string;
}
/**
 * Sets up the Cantara configuration
 * and executes the the "onPreBootstrap"
 * function which sets up the project
 * folder structure etc
 */
export default function initalizeCantara({ userProjectPath, stage: stageParam, cmdName, additionalCliOptions, appname, }: InitializeCantaraOptions): Promise<void>;
export {};
