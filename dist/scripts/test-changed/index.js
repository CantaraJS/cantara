"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec_changed_1 = __importDefault(require("../exec-changed"));
const cli_tools_1 = require("../../cli/cli-tools");
const test_1 = __importDefault(require("../test"));
function testChanged({ stage }) {
    return exec_changed_1.default(async (appname) => {
        await cli_tools_1.prepareCantara({
            cmdName: 'test',
            additionalCliOptions: '',
            appname,
            stage,
        });
        await test_1.default();
    });
}
exports.default = testChanged;
