"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var slash_1 = __importDefault(require("slash"));
var path_1 = __importDefault(require("path"));
var fs_1 = require("../util/fs");
var fs_2 = require("fs");
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
    var doSetAliasesForThisAppType = app.type === 'serverless' || app.type === 'node' || app.type === 'react';
    if (!doSetAliasesForThisAppType)
        return {};
    var dependencies = {};
    var packageJsonPath = path_1.default.join(app.paths.root, 'package.json');
    if (fs_2.existsSync(packageJsonPath)) {
        var packageJson = fs_1.readFileAsJSON(packageJsonPath);
        dependencies = packageJson.dependencies || {};
    }
    var appNodeModules = slash_1.default(path_1.default.join(app.paths.root, 'node_modules'));
    var dependencyAliases = Object.keys(dependencies).reduce(function (depObj, depName) {
        var _a;
        var depPath = path_1.default.join(appNodeModules, depName);
        return __assign(__assign({}, depObj), (_a = {}, _a[depName] = depPath, _a));
    }, {});
    return dependencyAliases;
}
exports.getDependencyAliases = getDependencyAliases;
/** Returns all aliases for packages in the form
 * { 'package-name': 'path/to/package/index.tx }.
 */
function getAllPackageAliases(_a) {
    var allApps = _a.allApps, activeApp = _a.activeApp;
    var packageAliases = allApps
        .filter(function (app) { return app.type === 'js-package' || app.type === 'react-component'; })
        .reduce(function (aliasesObj, currentApp) {
        var _a;
        return __assign(__assign({}, aliasesObj), (_a = {}, _a[currentApp.name] = slash_1.default(currentApp.paths.src), _a));
    }, {});
    return packageAliases;
}
exports.default = getAllPackageAliases;
