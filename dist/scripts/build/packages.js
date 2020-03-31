"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const path_1 = __importDefault(require("path"));
const cantara_config_1 = __importDefault(require("../../cantara-config"));
const webpackLibraryConfig_1 = __importDefault(require("../../util/config/webpackLibraryConfig"));
const fs_1 = require("../../util/fs");
const exec_1 = __importDefault(require("../../util/exec"));
const slash_1 = __importDefault(require("slash"));
function compile(config) {
    const compiler = webpack_1.default(config);
    return new Promise((resolve, reject) => {
        compiler.run(err => {
            if (err) {
                reject(new Error('Error while compiling.'));
                return;
            }
            console.log('Successfully compiled!');
            resolve();
        });
    });
}
async function buildPackage(app) {
    const { allPackages: { include }, runtime: { projectDir, aliases: { appDependencyAliases, packageAliases }, }, internalPaths: { root: cantaraRoot }, } = cantara_config_1.default();
    const allAliases = { ...appDependencyAliases, ...packageAliases };
    const commonOptions = {
        alias: allAliases,
        app,
        projectDir,
        include,
    };
    const webpackCommonJsConfig = webpackLibraryConfig_1.default({
        ...commonOptions,
        libraryTarget: 'commonjs2',
        noChecks: true,
    });
    const webpackUmdConfig = webpackLibraryConfig_1.default({
        ...commonOptions,
        libraryTarget: 'umd',
        noChecks: false,
    });
    const { libraryTargets = ['umd', 'commonjs'] } = app.meta;
    if (libraryTargets.includes('commonjs')) {
        await compile(webpackCommonJsConfig);
    }
    if (libraryTargets.includes('umd')) {
        await compile(webpackUmdConfig);
    }
    if (!app.meta.skipTypeGeneration) {
        // Generate types
        const tsConfigPath = path_1.default.join(app.paths.root, '.tsconfig.local.json');
        const suppress = app.meta.suppressTsErrors
            ? ` --suppress ${app.meta.suppressTsErrors.join(',')}@`
            : '';
        const tsPath = path_1.default.join(cantaraRoot, 'node_modules/typescript/lib/typescript.js');
        await exec_1.default(`tsc-silent --compiler ${tsPath} --project ${tsConfigPath}${suppress}`, {
            workingDirectory: app.paths.root,
            redirectIo: true,
        });
    }
    // Set correct path to index.js in packageJson's "main" field
    const packageJsonPath = path_1.default.join(app.paths.root, 'package.json');
    const packageJson = fs_1.readFileAsJSON(packageJsonPath);
    const newPackageJson = {
        ...packageJson,
        main: `./${slash_1.default(path_1.default.join(path_1.default.relative(app.paths.root, app.paths.build), path_1.default.basename(app.name), 'src', 'index.js'))}`,
    };
    fs_1.writeJson(packageJsonPath, newPackageJson);
}
exports.default = buildPackage;
