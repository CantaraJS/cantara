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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
var isDirectory = function (source) { return fs_1.lstatSync(source).isDirectory(); };
var getDirectories = function (source) {
    return fs_1.readdirSync(source)
        .map(function (name) { return path.join(source, name); })
        .filter(isDirectory);
};
/** Requires that at least one of the specified folders exist */
function requireAtLeastOneFolder(paths) {
    var doesOneFolderExist = paths
        .map(function (folderPath) { return fs_1.existsSync(folderPath); })
        .includes(true);
    if (!doesOneFolderExist) {
        throw new Error('No apps or packages folders were detected!');
    }
}
/** Returns list of all React Apps, Packages and Node Apps */
function getAllApps(rootDir) {
    var FOLDER_NAMES = {
        REACT_APPS: 'react-apps',
        NODE_APPS: 'node-apps',
        PACKAGES: 'packages',
    };
    var reactAppsRootDir = path.join(rootDir, FOLDER_NAMES.REACT_APPS);
    var packagesAppsRootDir = path.join(rootDir, FOLDER_NAMES.PACKAGES);
    var nodeAppsRootDir = path.join(rootDir, FOLDER_NAMES.NODE_APPS);
    requireAtLeastOneFolder([
        reactAppsRootDir,
        packagesAppsRootDir,
        nodeAppsRootDir,
    ]);
    var allAppsDirectories = __spreadArrays(getDirectories(reactAppsRootDir).map(function (dir) { return ({ dir: dir, type: 'react' }); }), getDirectories(packagesAppsRootDir).map(function (dir) { return ({
        dir: dir,
        type: 'package',
    }); }), getDirectories(nodeAppsRootDir).map(function (dir) { return ({ dir: dir, type: 'node' }); }));
    var allApps = allAppsDirectories.map(function (_a) {
        var dir = _a.dir, type = _a.type;
        var typeToUse = type;
        var displayName = path.basename(dir);
        var userAddedMetadata = {};
        if (type === 'package') {
            var packageSrc = path.join(dir, 'src');
            typeToUse = fs_1.existsSync(path.join(packageSrc, 'index.tsx'))
                ? 'react-component'
                : 'js-package';
        }
        if (type === 'node') {
            typeToUse = fs_1.existsSync(path.join(dir, 'serverless.yml'))
                ? 'serverless'
                : 'node';
        }
        var packageJsonPath = path.join(dir, 'package.json');
        if (fs_1.existsSync(packageJsonPath)) {
            var packageJSON = JSON.parse(fs_1.readFileSync(packageJsonPath).toString());
            displayName = packageJSON.name;
        }
        var cantaraConfigPath = path.join(dir, 'cantara.config.js');
        if (fs_1.existsSync(cantaraConfigPath)) {
            var userAppConfig = require(cantaraConfigPath);
            userAddedMetadata = userAppConfig.app;
        }
        return {
            name: path.basename(dir),
            type: typeToUse,
            paths: {
                root: dir,
                src: path.join(dir, 'src'),
                build: path.join(dir, 'build'),
                assets: path.join(dir, 'assets'),
            },
            meta: __assign({ displayName: displayName }, userAddedMetadata),
        };
    });
    // Require index.ts(x) file to exist for every app
    allApps.forEach(function (app) {
        var indexTsFileExists = fs_1.existsSync(path.join(app.paths.src, 'index.ts'));
        var indexTsxFileExists = fs_1.existsSync(path.join(app.paths.src, 'index.tsx'));
        var doesIndexFileExist = indexTsFileExists || indexTsxFileExists;
        if (!doesIndexFileExist) {
            throw new Error("Index file for " + app.name + " was not found. Please create it.");
        }
    });
    return allApps;
}
exports.default = getAllApps;
