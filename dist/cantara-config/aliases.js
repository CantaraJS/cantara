"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slash_1 = __importDefault(require("slash"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("../util/fs");
const fs_2 = require("fs");
/**
 * Get all dependencies of the current app
    and create an alias for them to make sure
    that when a package uses the same dependency,
    it uses the dependecy from the app's
    node_modules folder. Some libs require
    that there's only one instance present,
    e.g. React, styled-components, ...
 */
function getDependencyAliases(app) {
    const doSetAliasesForThisAppType = app.type === 'serverless' || app.type === 'node' || app.type === 'react';
    if (!doSetAliasesForThisAppType)
        return {};
    let dependencies = {};
    const packageJsonPath = path_1.default.join(app.paths.root, 'package.json');
    if (fs_2.existsSync(packageJsonPath)) {
        const packageJson = fs_1.readFileAsJSON(packageJsonPath);
        dependencies = packageJson.dependencies || {};
    }
    const appNodeModules = slash_1.default(path_1.default.join(app.paths.root, 'node_modules'));
    const dependencyAliases = Object.keys(dependencies).reduce((depObj, depName) => {
        const depPath = path_1.default.join(appNodeModules, depName);
        return {
            ...depObj,
            [depName]: depPath,
        };
    }, {});
    return dependencyAliases;
}
exports.getDependencyAliases = getDependencyAliases;
/** Returns all aliases for packages in the form
 * { 'package-name': 'path/to/package/index.tx }.
 */
function getAllPackageAliases({ allApps, activeApp, }) {
    const packageAliases = allApps
        .filter(app => app.type === 'js-package' || app.type === 'react-component')
        .reduce((aliasesObj, currentApp) => {
        return {
            ...aliasesObj,
            [currentApp.name]: slash_1.default(currentApp.paths.src),
        };
    }, {});
    return packageAliases;
}
exports.default = getAllPackageAliases;
