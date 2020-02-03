export interface CantaraCommand {
    /** e.g. dev, build, run, ... */
    actionName: string;
    /** Parameters value depends on position in command */
    parameters?: {
        name: string;
        required?: boolean;
    }[];
    exec: (parameters: {
        parameters: {
            [key: string]: string;
        };
        originalCommand: string[];
        stage: string;
    }) => any;
}
interface PrepareCantaraOptions {
    appname?: string;
    cmdName: string;
    additionalCliOptions: string;
    stage: string;
}
/** Execute this function before each command */
export declare function prepareCantara({ appname, cmdName, additionalCliOptions, stage, }: PrepareCantaraOptions): Promise<void>;
interface ExecCantaraCommandParams {
    allCantaraCommands: CantaraCommand[];
    parsedCommand: CliCommand;
    originalCommand: string[];
}
export declare function execCantaraCommand({ allCantaraCommands, parsedCommand, originalCommand, }: ExecCantaraCommandParams): Promise<void>;
export interface CliCommand {
    commands: string[];
    flags: {
        name: string;
        value: boolean | string;
    }[];
}
export declare function parseCliCommand(command: string[]): CliCommand;
export {};
