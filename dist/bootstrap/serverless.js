"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const slash_1 = __importDefault(require("slash"));
const cantara_config_1 = __importDefault(require("../cantara-config"));
const configTemplates_1 = __importDefault(require("../util/configTemplates"));
const util_1 = require("./util");
const externals_1 = require("../util/externals");
const mergeYaml = require('@alexlafroscia/yaml-merge');
function createWebpackAndBabelConfigFromTemplate(app) {
    // if skipCacheInvalidation is set to true, exclude typechecking plugin
    // as it would restart with every code change and make the
    // whole process even slower
    const { skipCacheInvalidation } = app.meta;
    const globalCantaraConfig = cantara_config_1.default();
    const babelConfigTemplate = fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, 'serverlessBabelConfig.template.js')).toString();
    const webpackConfigTemplate = fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, 'serverlessWebpackConfig.template.js')).toString();
    const allAliases = {
        ...globalCantaraConfig.runtime.aliases.appDependencyAliases,
        ...globalCantaraConfig.runtime.aliases.packageAliases,
    };
    const externals = externals_1.webpackExternalsAsStringArray();
    const allIncludes = [
        app.paths.src,
        ...globalCantaraConfig.allPackages.include,
    ];
    const MODULES_PATH = slash_1.default(globalCantaraConfig.internalPaths.nodeModules) + '/';
    const templateVariables = {
        MODULES_PATH,
        TSCONFIG_PATH: slash_1.default(path_1.default.join(app.paths.root, '.tsconfig.local.json')),
        INCLUDES: JSON.stringify(allIncludes),
        ALIASES: JSON.stringify(allAliases),
        ENV_VARS: JSON.stringify(app.env || {}),
        EXTERNALS_ARRAY: JSON.stringify(externals),
        ENABLE_TYPECHECKING: JSON.stringify(!skipCacheInvalidation),
        APP_STATIC_PATH: slash_1.default(app.paths.static || '') + '/**',
    };
    const newBabelConfig = configTemplates_1.default({
        template: babelConfigTemplate,
        variables: templateVariables,
    });
    const newWebpackConfig = configTemplates_1.default({
        template: webpackConfigTemplate,
        variables: templateVariables,
    });
    fs_1.writeFileSync(path_1.default.join(globalCantaraConfig.internalPaths.temp, 'serverlessBabelConfig.js'), newBabelConfig);
    fs_1.writeFileSync(path_1.default.join(globalCantaraConfig.internalPaths.temp, 'serverlessWebpackConfig.js'), newWebpackConfig);
}
function createServerlessYml(app) {
    const globalCantaraConfig = cantara_config_1.default();
    const relativeWebpackConfigPath = slash_1.default(path_1.default.join(path_1.default.relative(app.paths.root, globalCantaraConfig.internalPaths.temp), 'serverlessWebpackConfig.js'));
    const templateVariables = {
        MODULES_PATH: slash_1.default(globalCantaraConfig.internalPaths.nodeModules) + '/',
        WEBPACK_CONFIG_PATH: relativeWebpackConfigPath,
    };
    const serverlessYmlTemplate = fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, 'serverlessTemplate.yml')).toString();
    const newServerlessYmlParts = configTemplates_1.default({
        template: serverlessYmlTemplate,
        variables: templateVariables,
    });
    const serverlessPartsFilePath = path_1.default.join(globalCantaraConfig.internalPaths.temp, 'serverless.parts.yml');
    fs_1.writeFileSync(serverlessPartsFilePath, newServerlessYmlParts);
    const userServerlessYmlPath = path_1.default.join(app.paths.root, 'serverless.yml');
    // Merge user's yaml file and this one
    const newServerlessYml = mergeYaml(userServerlessYmlPath, serverlessPartsFilePath);
    fs_1.writeFileSync(userServerlessYmlPath, newServerlessYml);
}
/** Prepares Serverless App Folder */
async function prepareServerlessApp(app) {
    // First, create the webpack and the babel config with the correct paths
    createWebpackAndBabelConfigFromTemplate(app);
    // Now, create the custom serverless.yml file with the correct paths
    // The main serverless.yml file needs to inherit from it!
    createServerlessYml(app);
    // Create jest config
    util_1.createNodeJestConfig(app);
    // Create package.json
    await util_1.createOrUpdatePackageJSON({ rootDir: app.paths.root });
    // Create local tsconfig which extends from global one.
    // Needed to correctly generate types
    util_1.createLocalAppTsConfig({ app, indexFileName: 'index.tsx' });
}
exports.default = prepareServerlessApp;
