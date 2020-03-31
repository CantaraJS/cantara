"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const deriveStage_1 = __importDefault(require("../util/deriveStage"));
const cantara_config_1 = require("../cantara-config");
const _1 = __importDefault(require("."));
/**
 * Sets up the Cantara configuration
 * and executes the the "onPreBootstrap"
 * function which sets up the project
 * folder structure etc
 */
async function initalizeCantara({ userProjectPath, stage: stageParam, cmdName, additionalCliOptions, appname, skipBootstrap, }) {
    const stage = !stageParam || stageParam === 'not_set'
        ? deriveStage_1.default(cmdName)
        : stageParam;
    const cantaraRootDir = path_1.default.join(__dirname, '..', '..');
    await cantara_config_1.configureCantara({
        additionalCliOptions,
        projectDir: userProjectPath,
        packageRootDir: cantaraRootDir,
        currentCommand: {
            appname,
            name: cmdName,
        },
        stage,
    });
    if (!skipBootstrap) {
        await _1.default();
    }
}
exports.default = initalizeCantara;
