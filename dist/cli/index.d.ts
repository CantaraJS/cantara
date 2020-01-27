interface PrepareCantaraOptions {
    appname?: string;
    cmdName: string;
    additionalCliOptions: string;
}
/** Execute this function before each command */
export declare function prepareCantara({ appname, cmdName, additionalCliOptions, }: PrepareCantaraOptions): Promise<void>;
export {};
