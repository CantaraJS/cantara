"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const cantara_config_1 = __importDefault(require("../cantara-config"));
const util_1 = require("./util");
/** Prepares React App Folder */
async function prepareReactApps(app) {
    const globalCantaraConfig = cantara_config_1.default();
    // Copy index.html to asssets folder if not already there
    const defaultIndexHtmlTemplatePath = path_1.default.join(globalCantaraConfig.internalPaths.static, 'default-index.html');
    if (!app.paths.assets)
        return;
    if (!fs_1.existsSync(app.paths.assets)) {
        fs_1.mkdirSync(app.paths.assets);
    }
    const indexHtmlDestinationPath = path_1.default.join(app.paths.assets, 'index.html');
    if (!fs_1.existsSync(indexHtmlDestinationPath)) {
        fs_1.copyFileSync(defaultIndexHtmlTemplatePath, indexHtmlDestinationPath);
    }
    // Install/update dependencies
    await util_1.createOrUpdatePackageJSON({
        expectedDependencies: globalCantaraConfig.dependencies.react,
        expectedDevDependencies: {
            ...globalCantaraConfig.dependencies.testing,
            ...globalCantaraConfig.dependencies.typescript,
        },
        rootDir: app.paths.root,
    });
    // Create react Jest config file and copy to current project
    util_1.createReactJestConfig(app);
    // Create local tsconfig which extends from global one.
    // Needed to correctly generate types
    util_1.createLocalAppTsConfig({ app, indexFileName: 'index.tsx' });
}
exports.default = prepareReactApps;
