"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deriveStageNameFromCmd(cmdName) {
    if (cmdName === 'build' || cmdName === 'deploy' || cmdName === 'ci') {
        return 'production';
    }
    if (cmdName === 'test' || cmdName === 'e2e') {
        return 'test';
    }
    return 'development';
}
exports.default = deriveStageNameFromCmd;
