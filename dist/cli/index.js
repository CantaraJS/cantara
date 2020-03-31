"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_tools_1 = require("./cli-tools");
const arbitrary_1 = __importDefault(require("../scripts/arbitrary"));
const dev_1 = __importDefault(require("../scripts/dev"));
const deploy_1 = __importDefault(require("../scripts/deploy"));
const build_1 = __importDefault(require("../scripts/build"));
const test_1 = __importDefault(require("../scripts/test"));
const new_1 = __importDefault(require("../scripts/new"));
const init_1 = __importDefault(require("../scripts/init"));
const e2e_1 = __importDefault(require("../scripts/e2e"));
const test_changed_1 = __importDefault(require("../scripts/test-changed"));
const build_changed_1 = __importDefault(require("../scripts/build-changed"));
const exec_changed_1 = require("../scripts/exec-changed");
process.on('uncaughtException', err => {
    console.log(err);
    process.exit(1);
});
process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});
const allCantaraCommands = [
    {
        actionName: 'dev',
        parameters: [{ name: 'appname', required: true }],
        exec: () => {
            return dev_1.default();
        },
    },
    {
        actionName: 'deploy',
        parameters: [{ name: 'appname', required: true }],
        exec: () => {
            return deploy_1.default();
        },
    },
    {
        actionName: 'build',
        parameters: [{ name: 'appname', required: true }],
        exec: () => {
            return build_1.default();
        },
    },
    {
        actionName: 'test',
        parameters: [{ name: 'appname', required: true }],
        exec: () => {
            return test_1.default();
        },
    },
    {
        actionName: 'run',
        parameters: [{ name: 'appname', required: true }],
        exec: ({ originalCommand }) => {
            return arbitrary_1.default(originalCommand);
        },
    },
    {
        actionName: 'new',
        parameters: [
            { name: 'type', required: true },
            { name: 'name', required: true },
        ],
        exec: ({ parameters: { name, type } }) => {
            return new_1.default({ type: type, name });
        },
    },
    {
        actionName: 'init',
        noSetup: true,
        parameters: [{ name: 'path' }, { name: 'template' }],
        exec: ({ parameters: { path: userPath, template } }) => {
            const templateToUse = template ? template : 'cantara-simple-starter';
            return init_1.default({
                newFolderPath: userPath,
                templateName: templateToUse,
            });
        },
    },
    {
        actionName: 'build-changed',
        exec: ({ stage }) => {
            return build_changed_1.default({ stage });
        },
    },
    {
        actionName: 'test-changed',
        exec: ({ stage }) => {
            return test_changed_1.default({ stage });
        },
    },
    {
        actionName: 'e2e',
        exec: () => {
            return e2e_1.default();
        },
    },
    {
        actionName: 'ci',
        exec: async ({ stage }) => {
            await test_changed_1.default({ stage });
            await build_changed_1.default({ stage });
        },
    },
    {
        actionName: 'exec-changed',
        parameters: [{ name: 'appname', required: true }],
        exec: ({ parameters: { appname }, originalCommand }) => {
            const [, , ...userCmd] = originalCommand;
            return exec_changed_1.execUserCmdForChangedApp({ appname, userCmd: userCmd.join(' ') });
        },
    },
];
function setupCliInterface() {
    const TEST_CMD = (process.env.DEV_CANTARA_COMMAND || '').split(' ');
    const cmdToUse = process.env.NODE_ENV === 'development' ? TEST_CMD : process.argv.slice(2);
    const parsedCommand = cli_tools_1.parseCliCommand(cmdToUse);
    return cli_tools_1.execCantaraCommand({
        allCantaraCommands,
        parsedCommand,
        originalCommand: cmdToUse,
    });
}
exports.default = setupCliInterface;
