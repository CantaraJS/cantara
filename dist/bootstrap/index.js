"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ncp_1 = __importDefault(require("ncp"));
const fs_1 = require("fs");
const util_1 = require("util");
const cantara_config_1 = __importDefault(require("../cantara-config"));
const react_1 = __importDefault(require("./react"));
const util_2 = require("./util");
const serverless_1 = __importDefault(require("./serverless"));
const packages_1 = __importDefault(require("./packages"));
const fs_2 = require("../util/fs");
const node_1 = __importDefault(require("./node"));
const ncp = util_1.promisify(ncp_1.default);
/** Make paths relative for typescript */
function aliasesAbsoluteToRelative(aliases) {
    return Object.keys(aliases).reduce((newObj, currAliasName) => {
        const currPath = aliases[currAliasName];
        const newPath = currPath.slice(currPath.lastIndexOf('packages'));
        return {
            ...newObj,
            [currAliasName]: [newPath],
        };
    }, {});
}
/** Prepares user's project */
async function prepareCantaraProject() {
    const globalCantaraConfig = cantara_config_1.default();
    const rootDir = globalCantaraConfig.runtime.projectDir;
    // Static files/folders to copy to the project's root
    // Copy global.d.ts file to project's root:
    // This way, static assets like images and CSS files can be imported using "import" syntax
    const STATIC_PATHS_TO_COPY = [
        '.vscode',
        '.gitignore',
        '.prettierrc',
        'global.d.ts',
    ];
    for (const pathToCopy of STATIC_PATHS_TO_COPY) {
        const fullPath = path_1.default.join(rootDir, pathToCopy);
        if (!fs_1.existsSync(fullPath)) {
            await ncp(path_1.default.join(globalCantaraConfig.internalPaths.static, pathToCopy), fullPath);
        }
    }
    // Read tsconfig.json and add package aliases
    const tsConfig = JSON.parse(fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, 'tsconfig.json')).toString());
    const { runtime: { aliases: { packageAliases }, }, } = globalCantaraConfig;
    const newTsConfig = {
        ...tsConfig,
        compilerOptions: {
            ...tsConfig.compilerOptions,
            paths: aliasesAbsoluteToRelative(packageAliases),
        },
    };
    fs_2.writeJson(path_1.default.join(rootDir, 'tsconfig.json'), newTsConfig);
    // Install React + Typescript dependencies globally for project
    await util_2.createOrUpdatePackageJSON({
        rootDir,
        expectedDependencies: globalCantaraConfig.dependencies.react,
        expectedDevDependencies: {
            ...globalCantaraConfig.dependencies.typescript,
            // ...globalCantaraConfig.dependencies.testing,
            ...globalCantaraConfig.dependencies.common,
        },
    });
    // Create .temp folder if it doesn't exist yet
    if (!fs_1.existsSync(globalCantaraConfig.internalPaths.temp)) {
        fs_1.mkdirSync(globalCantaraConfig.internalPaths.temp);
    }
    util_2.createTempEnvJsonFile();
    // Copy global jest.config.js (needed so that correct typings are used when e.g. also cypress is installed)
    util_2.createJestConfig({
        dir: rootDir,
        configTemplateFileName: 'jestGlobalConfig.template.js',
    });
}
/**
 * Prepares the application folders if not done already.
 * Gets only executed if there's an active application
 */
async function onPreBootstrap() {
    await prepareCantaraProject();
    const globalCantaraConfig = cantara_config_1.default();
    const isAnAppActive = !!globalCantaraConfig.runtime.currentCommand.app;
    if (!isAnAppActive)
        return;
    for (const app of globalCantaraConfig.allApps) {
        // Each app type is bootstrapped slightly different
        if (app.type === 'react') {
            await react_1.default(app);
        }
        if (app.type === 'serverless') {
            await serverless_1.default(app);
        }
        if (app.type === 'react-component' || app.type === 'js-package') {
            await packages_1.default(app);
        }
        if (app.type === 'node') {
            await node_1.default(app);
        }
    }
}
exports.default = onPreBootstrap;
