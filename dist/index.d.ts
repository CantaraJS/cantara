#!/usr/bin/env node
interface CliCommand {
    commands: string[];
    parameters: {
        name: string;
        value: boolean | string;
    }[];
}
declare function parseCliCommand(command: string[]): void;
declare function main(): void;
