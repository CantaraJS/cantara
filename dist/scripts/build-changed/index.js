"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec_changed_1 = __importDefault(require("../exec-changed"));
const cli_tools_1 = require("../../cli/cli-tools");
const build_1 = __importDefault(require("../build"));
function buildChanged({ stage }) {
    return exec_changed_1.default(async (appname) => {
        console.log('changed', { appname });
        await cli_tools_1.prepareCantara({
            cmdName: 'build',
            additionalCliOptions: '',
            appname,
            stage,
        });
        await build_1.default();
    });
}
exports.default = buildChanged;
