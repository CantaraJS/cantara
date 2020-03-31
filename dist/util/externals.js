"use strict";
// Inspired by https://github.com/liady/webpack-node-externals/blob/master/index.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fs_2 = require("./fs");
const cantara_config_1 = __importDefault(require("../cantara-config"));
const fs_3 = require("fs");
function getAllModulesFromFolder(dirName) {
    const atPrefix = new RegExp('^@', 'g');
    if (!fs_1.default.existsSync(dirName)) {
        return [];
    }
    try {
        return fs_1.default
            .readdirSync(dirName)
            .map(moduleName => {
            if (atPrefix.test(moduleName)) {
                // reset regexp
                atPrefix.lastIndex = 0;
                try {
                    return fs_1.default
                        .readdirSync(path_1.default.join(dirName, moduleName))
                        .map(function (scopedMod) {
                        return moduleName + '/' + scopedMod;
                    });
                }
                catch (e) {
                    return [moduleName];
                }
            }
            return moduleName;
        })
            .reduce((prev, next) => {
            return prev.concat(next);
        }, []);
    }
    catch (e) {
        return [];
    }
}
function getAllInstalledModules(allApps) {
    const allExistingNodeModuleFolders = allApps
        .map(app => path_1.default.join(app.paths.root, 'node_modules'))
        .filter(folderPath => fs_3.existsSync(folderPath));
    const allModules = allExistingNodeModuleFolders
        .map(getAllModulesFromFolder)
        .reduce((arr, arrToMerge) => [...arr, ...arrToMerge], []);
    return allModules;
}
function getAllPeerDependencies(allApps) {
    const allPackageJsonPaths = allApps.map(app => path_1.default.join(app.paths.root, 'package.json'));
    const allPeerDeps = allPackageJsonPaths
        .map(filePath => {
        try {
            const { peerDependencies = {} } = fs_2.readFileAsJSON(filePath);
            return peerDependencies;
        }
        catch {
            return {};
        }
    })
        .reduce((resArr, peerDepsObj) => {
        return [...resArr, ...Object.keys(peerDepsObj)];
    }, []);
    return allPeerDeps;
}
function getModuleName(request) {
    var scopedModuleRegex = new RegExp('@[a-zA-Z0-9][\\w-.]+/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9./]+)?', 'g');
    var req = request;
    var delimiter = '/';
    // check if scoped module
    if (scopedModuleRegex.test(req)) {
        // reset regexp
        scopedModuleRegex.lastIndex = 0;
        return req.split(delimiter, 2).join(delimiter);
    }
    return req.split(delimiter)[0];
}
function webpackExternalsAsStringArray({ peerOnly, } = {}) {
    const { allApps } = cantara_config_1.default();
    let externals = [];
    if (peerOnly) {
        // Read peer deps from package.json
        externals = getAllPeerDependencies(allApps);
    }
    else {
        // Read all node_modules folders to know which packages to externalize,
        // same as the popular nodeExternals() does
        externals = getAllInstalledModules(allApps);
    }
    return externals;
}
exports.webpackExternalsAsStringArray = webpackExternalsAsStringArray;
/** Makes sure that all package dependencies
 * are externalized (not included in bundle).
 * Reads every packageJson provided and adds
 * each dependency to the list.
 * If `peerOnly` is set to `true`, only peer
 * dependecies are excluded. Useful for
 * CDN bundles.
 */
function getAllWebpackExternals({ peerOnly, } = {}) {
    const externals = webpackExternalsAsStringArray({ peerOnly });
    // const externalsObj = externals.reduce((retObj, externalName) => {
    //   return {
    //     ...retObj,
    //     [externalName]: {
    //       commonjs: externalName,
    //     },
    //   };
    // }, {});
    // For some reason, only works with this function,
    // but not when defining excplictly through object
    // (which should be the same)
    return (_, request, callback) => {
        const moduleName = getModuleName(request);
        if (externals.includes(moduleName)) {
            // mark this module as external
            // https://webpack.js.org/configuration/externals/
            return callback(null, 'commonjs ' + request);
        }
        callback();
    };
}
exports.default = getAllWebpackExternals;
