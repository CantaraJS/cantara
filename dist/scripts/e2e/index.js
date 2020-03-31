"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cantara_config_1 = __importDefault(require("../../cantara-config"));
const wait_port_1 = __importDefault(require("wait-port"));
const exec_1 = __importDefault(require("../../util/exec"));
async function startEndToEndTests() {
    const { runtime: { globalCantaraSettings: { e2e }, projectDir, }, } = cantara_config_1.default();
    // Execute commands like starting servers etc.
    for (const command of e2e.executeBefore) {
        exec_1.default(command, { workingDirectory: projectDir });
    }
    // Wait for ports to be available
    for (const portToWaitFor of e2e.portsToWaitFor) {
        const isAvailable = await wait_port_1.default({ port: portToWaitFor });
        if (!isAvailable) {
            throw new Error(`No server available at port ${portToWaitFor}`);
        }
    }
    // Execute test command
    await exec_1.default(e2e.testCommand, {
        redirectIo: true,
        workingDirectory: projectDir,
    });
}
exports.default = startEndToEndTests;
