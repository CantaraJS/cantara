"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ncp_1 = __importDefault(require("ncp"));
const del_1 = __importDefault(require("del"));
const util_1 = require("util");
const fs_1 = require("fs");
const string_manipulation_1 = require("../../util/string-manipulation");
const cantara_config_1 = __importDefault(require("../../cantara-config"));
const ncp = util_1.promisify(ncp_1.default);
async function createReactComponent({ name }) {
    const { runtime: { projectDir }, internalPaths: { static: staticFolderPath, temp: tempFolderPath }, } = cantara_config_1.default();
    const destinationPath = path_1.default.join(projectDir, 'packages', name);
    // Replace "Index" with actual component name
    const origTemplateFolderPath = path_1.default.join(staticFolderPath, 'app-templates/react-component');
    const templateFolderPath = path_1.default.join(tempFolderPath, 'react-component-app-template');
    if (fs_1.existsSync(templateFolderPath)) {
        await del_1.default(templateFolderPath);
    }
    fs_1.mkdirSync(templateFolderPath);
    await ncp(origTemplateFolderPath, templateFolderPath);
    const reactIndexFilePath = path_1.default.join(templateFolderPath, 'src/index.tsx');
    const origReactIndexFileContent = fs_1.readFileSync(reactIndexFilePath).toString();
    const newReactIndexFileContent = origReactIndexFileContent.replace(new RegExp('Index', 'g'), string_manipulation_1.camalize(name));
    fs_1.writeFileSync(reactIndexFilePath, newReactIndexFileContent);
    return { destinationPath, templateFolderPath };
}
async function createNewAppOrPackage({ type, name, }) {
    const { runtime: { projectDir }, internalPaths: { static: staticFolderPath }, } = cantara_config_1.default();
    let templateFolderPath = '';
    let destinationPath = '';
    if (type === 'react-app') {
        destinationPath = path_1.default.join(projectDir, 'react-apps', name);
        templateFolderPath = path_1.default.join(staticFolderPath, 'app-templates/react-app');
    }
    if (type === 'react-cmp' || type === 'react-component') {
        const resObj = await createReactComponent({
            name,
        });
        templateFolderPath = resObj.templateFolderPath;
        destinationPath = resObj.destinationPath;
    }
    if (type === 'node-app') {
        destinationPath = path_1.default.join(projectDir, 'node-apps', name);
        templateFolderPath = path_1.default.join(staticFolderPath, 'app-templates/node-app');
    }
    if (type === 'serverless') {
        destinationPath = path_1.default.join(projectDir, 'node-apps', name);
        templateFolderPath = path_1.default.join(staticFolderPath, 'app-templates/serverless');
    }
    if (type === 'js-package') {
        destinationPath = path_1.default.join(projectDir, 'packages', name);
        templateFolderPath = path_1.default.join(staticFolderPath, 'app-templates/js-package');
    }
    if (!fs_1.existsSync(templateFolderPath)) {
        throw new Error(`${templateFolderPath} does not exist.`);
    }
    if (fs_1.existsSync(destinationPath)) {
        throw new Error(`${destinationPath} already exists! Delete the folder if you want to override it.`);
    }
    fs_1.mkdirSync(destinationPath, { recursive: true });
    await ncp(templateFolderPath, destinationPath);
    console.log(`Created new ${type} at ${destinationPath}!`);
}
exports.default = createNewAppOrPackage;
