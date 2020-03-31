"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const util_1 = require("../util");
const init_1 = __importDefault(require("../../bootstrap/init"));
if (process.env.NODE_ENV === 'development') {
    dotenv_1.default.config();
}
const userProjectPath = process.env.NODE_ENV === 'development'
    ? process.env.DEV_PROJECT_PATH
    : process.cwd();
if (!userProjectPath) {
    throw new Error(`No project path was set. Set DEV_PROJECT_PATH in .env file to continue development!`);
}
/** Execute this function before each command */
async function prepareCantara({ appname, cmdName, additionalCliOptions, stage, skipBootstrap, }) {
    util_1.setupCliContext();
    await init_1.default({
        additionalCliOptions,
        appname,
        cmdName,
        stage,
        userProjectPath: userProjectPath,
        skipBootstrap,
    });
}
exports.prepareCantara = prepareCantara;
async function execCantaraCommand({ allCantaraCommands, parsedCommand, originalCommand, }) {
    if (parsedCommand.commands.length === 0) {
        throw new Error(`You must specify an action, e.g.: cantara e2e`);
    }
    const userDefinedStage = parsedCommand.flags.find(flag => flag.name === 'stage');
    const stage = userDefinedStage ? userDefinedStage.value : 'not_set';
    const [actionName, ...parameters] = parsedCommand.commands;
    const foundAction = allCantaraCommands.find(cmd => cmd.actionName === actionName);
    if (!foundAction) {
        throw new Error(`There is no command named '${actionName}'.`);
    }
    const [, , ...additionalCliOptionsUnsanitized] = originalCommand;
    const additionalCliOptions = additionalCliOptionsUnsanitized
        .join(' ')
        .replace(/--stage [^\s\\]*/, '');
    const actionParameters = parsedCommand.commands
        .slice(1)
        .reduce((obj, cmd, i) => {
        const foundParam = foundAction.parameters && foundAction.parameters[i];
        if (foundParam) {
            return {
                ...obj,
                [foundParam.name]: cmd,
            };
        }
        return obj;
    }, {});
    await prepareCantara({
        appname: actionParameters.appname,
        cmdName: actionName,
        stage: stage.toString(),
        additionalCliOptions,
        skipBootstrap: foundAction.noSetup,
    });
    await Promise.resolve(foundAction.exec({
        parameters: actionParameters,
        originalCommand,
        stage: stage.toString(),
    }));
}
exports.execCantaraCommand = execCantaraCommand;
function parseCliCommand(command) {
    const parsed = command.reduce((acc, str, i) => {
        const wasStringPartAlreadyHandled = acc.commands.includes(str) ||
            !!acc.flags.find(flag => str.startsWith(`--${flag.name}`) || str === flag.value);
        if (wasStringPartAlreadyHandled) {
            return acc;
        }
        const isFlag = str.startsWith('--');
        if (isFlag) {
            let flagValue = true;
            let flagName = str.replace('--', '');
            const hasFlagValue = command[i + 1] !== undefined && command[i + 1] !== null;
            if (hasFlagValue) {
                flagValue = command[i + 1];
                if (flagValue === 'false') {
                    flagValue = false;
                }
            }
            return {
                ...acc,
                flags: [...acc.flags, { name: flagName, value: flagValue }],
            };
        }
        return {
            ...acc,
            commands: [...acc.commands, str],
        };
    }, { commands: [], flags: [] });
    return parsed;
}
exports.parseCliCommand = parseCliCommand;
