"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const fs_2 = require("../util/fs");
const envvars_1 = __importDefault(require("./envvars"));
const isDirectory = (source) => fs_1.lstatSync(source).isDirectory();
const getDirectories = (source) => fs_1.readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);
/**
 * Returns node_modules path of
 * Cantara's dependecies,
 * as this may differ depending
 * on how it was installed. Do
 * that by requiring a module
 * which will never be removed,
 * @babel/core, and resolve it's
 * absolute path.
 */
function getCantaraDepenciesInstallationPath() {
    const absolutePath = require.resolve('@babel/core');
    const nodeModulesPos = absolutePath.lastIndexOf('node_modules');
    const nodeModulesPath = absolutePath.slice(0, nodeModulesPos + 'node_modules'.length);
    return nodeModulesPath;
}
exports.getCantaraDepenciesInstallationPath = getCantaraDepenciesInstallationPath;
/** Requires that at least one of the specified folders exist */
function requireAtLeastOneFolder(paths) {
    const doesOneFolderExist = paths
        .map(folderPath => fs_1.existsSync(folderPath))
        .includes(true);
    if (!doesOneFolderExist) {
        throw new Error('No apps or packages folders were detected!');
    }
}
/** Returns list of all React Apps, Packages and Node Apps */
async function getAllApps({ rootDir, stage, activeAppName, }) {
    const FOLDER_NAMES = {
        REACT_APPS: 'react-apps',
        NODE_APPS: 'node-apps',
        PACKAGES: 'packages',
    };
    const reactAppsRootDir = path.join(rootDir, FOLDER_NAMES.REACT_APPS);
    const packagesAppsRootDir = path.join(rootDir, FOLDER_NAMES.PACKAGES);
    const nodeAppsRootDir = path.join(rootDir, FOLDER_NAMES.NODE_APPS);
    requireAtLeastOneFolder([
        reactAppsRootDir,
        packagesAppsRootDir,
        nodeAppsRootDir,
    ]);
    const allAppsDirectories = [
        ...getDirectories(reactAppsRootDir).map(dir => ({ dir, type: 'react' })),
        ...getDirectories(packagesAppsRootDir).map(dir => ({
            dir,
            type: 'package',
        })),
        ...getDirectories(nodeAppsRootDir).map(dir => ({ dir, type: 'node' })),
    ];
    const allApps = await Promise.all(allAppsDirectories.map(async ({ dir, type }) => {
        let typeToUse = type;
        let displayName = path.basename(dir);
        let appName = displayName;
        let userAddedMetadata = undefined;
        const packageJsonPath = path.join(dir, 'package.json');
        let packageJsonName = '';
        if (fs_1.existsSync(packageJsonPath)) {
            const packageJSON = JSON.parse(fs_1.readFileSync(packageJsonPath).toString());
            packageJsonName = packageJSON.name;
        }
        if (packageJsonName) {
            displayName = packageJsonName;
        }
        if (type === 'package') {
            // For packages, if a package.json file is already available,
            // use the name defined at the "name" field instead
            // of the foldername. This way, org scoped packages
            // also work with cantara, e.g. @acme/package
            if (packageJsonName) {
                appName = packageJsonName;
            }
            const packageSrc = path.join(dir, 'src');
            typeToUse = fs_1.existsSync(path.join(packageSrc, 'index.tsx'))
                ? 'react-component'
                : 'js-package';
        }
        if (type === 'node') {
            typeToUse = fs_1.existsSync(path.join(dir, 'serverless.yml'))
                ? 'serverless'
                : 'node';
        }
        const cantaraConfigPath = path.join(dir, 'cantara.config.js');
        if (fs_1.existsSync(cantaraConfigPath)) {
            userAddedMetadata = require(cantaraConfigPath);
        }
        const envVars = await envvars_1.default({
            projectRootDir: rootDir,
            appRootDir: dir,
            currentStage: stage,
            expectedEnvVars: userAddedMetadata ? userAddedMetadata.env || [] : [],
            fallbackStage: 'development',
            /** If this is the currently active app,
             * the env vars defined in cantara.config.js
             * are required and an error is thrown
             * if some are missing
             */
            required: appName === activeAppName,
        });
        return {
            name: appName,
            type: typeToUse,
            env: envVars,
            paths: {
                root: dir,
                src: path.join(dir, 'src'),
                build: path.join(dir, 'build'),
                assets: path.join(dir, 'assets'),
                static: path.join(dir, 'static'),
            },
            meta: {
                displayName,
                ...userAddedMetadata,
            },
        };
    }));
    // Require index.ts(x) file to exist for every app
    // and react component
    allApps.forEach(app => {
        let doesIndexFileExist = false;
        if (app.type === 'js-package') {
            doesIndexFileExist = true;
        }
        if (app.type === 'node') {
            doesIndexFileExist = fs_1.existsSync(path.join(app.paths.src, 'index.ts'));
        }
        if (app.type === 'react' || app.type === 'react-component') {
            doesIndexFileExist = fs_1.existsSync(path.join(app.paths.src, 'index.tsx'));
        }
        if (app.type === 'serverless') {
            doesIndexFileExist = fs_1.existsSync(path.join(app.paths.root, 'handler.js'));
        }
        if (!doesIndexFileExist) {
            throw new Error(`Entry file for "${app.name}" was not found. Please create it.`);
        }
    });
    return allApps;
}
exports.default = getAllApps;
/** Loads and parses the content from the user's .secrets.json file
 * in the project root. Here, Cantara specific secrets can be stored.
 * E.g. AWS keys. Can also be passed in as environment variables.
 */
function loadSecrets({ projectDir, secrets: identifiers, }) {
    const secretsFilePath = path.join(projectDir, '.secrets.json');
    let secrets = {};
    if (fs_1.existsSync(secretsFilePath)) {
        secrets = fs_2.readFileAsJSON(secretsFilePath);
    }
    for (const secretId of identifiers) {
        if (!secrets[secretId]) {
            secrets[secretId] = process.env[secretId];
        }
    }
    return secrets;
}
exports.loadSecrets = loadSecrets;
