"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const del_1 = __importDefault(require("del"));
const exec_1 = require("../../util/exec");
const fs_1 = require("fs");
const cantara_config_1 = __importDefault(require("../../cantara-config"));
async function initializeNewProject({ newFolderPath, templateName, }) {
    const { runtime: { projectDir: execDir }, } = cantara_config_1.default();
    let projectDir = path_1.default.join(execDir, templateName);
    if (newFolderPath) {
        if (path_1.default.isAbsolute(newFolderPath)) {
            projectDir = newFolderPath;
        }
        else {
            projectDir = path_1.default.join(execDir, newFolderPath);
        }
    }
    const isDirEmpty = !fs_1.existsSync(projectDir) || fs_1.readdirSync(projectDir).length === 0;
    if (!isDirEmpty) {
        throw new Error(`${projectDir} is not empty. Aborting...`);
    }
    let finalGitLink = templateName;
    if (!templateName.includes('/')) {
        // It's not a link and not a username/repo pair
        finalGitLink = `https://github.com/CantaraJS/${templateName}.git`;
    }
    if (!templateName.includes('.git') && templateName.includes('/')) {
        finalGitLink = `https://github.com/${templateName}.git`;
    }
    await exec_1.spawnCmd(`git clone ${finalGitLink} ${projectDir}`, {
        redirectIo: true,
    });
    const gitFolderToDelete = path_1.default.join(projectDir, '.git');
    // Set force to true because gitFolderToDelete is outside CWD
    await del_1.default(gitFolderToDelete, { force: true });
    await exec_1.spawnCmd(`git init ${projectDir}`);
    console.log('Initialized new Cantara project. Type "ctra dev <app-name>" to start the development. Refer to https://cantara.js.org for more information!');
}
exports.default = initializeNewProject;
