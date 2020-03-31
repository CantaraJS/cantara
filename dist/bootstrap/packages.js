"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const util_1 = require("./util");
const cantara_config_1 = __importDefault(require("../cantara-config"));
const fs_1 = require("../util/fs");
const configTemplates_1 = __importDefault(require("../util/configTemplates"));
const fs_2 = require("fs");
function addPeerDeps(packageJsonPath, deps) {
    const packageJson = fs_1.readFileAsJSON(packageJsonPath);
    const newPackageJson = {
        ...packageJson,
        peerDependencies: {
            ...(packageJson.peerDependencies || {}),
            ...deps,
        },
    };
    fs_1.writeJson(packageJsonPath, newPackageJson);
}
/** Prepares a JavaScript package or React Component */
async function prepareJsPackage(app) {
    const { dependencies: { react: reactDeps, testing: testingDeps }, internalPaths: { static: staticFilesFolder }, } = cantara_config_1.default();
    let indexFileName = 'index.ts';
    const isReactComponent = app.type === 'react-component';
    const expectedDevDependencies = isReactComponent
        ? { ...reactDeps, ...testingDeps }
        : {};
    // Create package.json if none exists
    await util_1.createOrUpdatePackageJSON({
        rootDir: app.paths.root,
        expectedDevDependencies,
        expectedDependencies: {},
    });
    if (isReactComponent) {
        // For React Components, add react and react-dom to the peer dependencies
        addPeerDeps(path_1.default.join(app.paths.root, 'package.json'), reactDeps);
        // Create jest config files
        util_1.createReactJestConfig(app);
        indexFileName = 'index.tsx';
    }
    else {
        util_1.createNodeJestConfig(app);
    }
    // Create local tsconfig which extends from global one.
    // Needed to correctly generate types
    const packageTsConfigTemplate = fs_2.readFileSync(path_1.default.join(staticFilesFolder, 'packageTsConfigTemplate.json')).toString();
    const renderedTsConfig = configTemplates_1.default({
        template: packageTsConfigTemplate,
        variables: {
            INDEX_FILE_NAME: indexFileName,
            JEST_SETUP_FILE: './jest.setup.ts',
        },
    });
    const packageTsConfigPath = path_1.default.join(app.paths.root, '.tsconfig.local.json');
    fs_1.writeJson(packageTsConfigPath, JSON.parse(renderedTsConfig));
    // Copy .npmignore ignore file
    const npmignorePath = path_1.default.join(staticFilesFolder, '.npmignore-template');
    const npmignoreDestPath = path_1.default.join(app.paths.root, '.npmignore');
    fs_2.copyFileSync(npmignorePath, npmignoreDestPath);
}
exports.default = prepareJsPackage;
