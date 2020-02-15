"use strict";
// Inspired by https://github.com/liady/webpack-node-externals/blob/master/index.js
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var fs_2 = require("./fs");
var cantara_config_1 = __importStar(require("../cantara-config"));
var fs_3 = require("fs");
function getAllModulesFromFolder(dirName) {
    var atPrefix = new RegExp('^@', 'g');
    if (!fs_1.default.existsSync(dirName)) {
        return [];
    }
    try {
        return fs_1.default
            .readdirSync(dirName)
            .map(function (moduleName) {
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
            .reduce(function (prev, next) {
            return prev.concat(next);
        }, []);
    }
    catch (e) {
        return [];
    }
}
function getAllInstalledModules(allApps) {
    var allExistingNodeModuleFolders = allApps
        .map(function (app) { return path_1.default.join(app.paths.root, 'node_modules'); })
        .filter(function (folderPath) { return fs_3.existsSync(folderPath); });
    var allModules = allExistingNodeModuleFolders
        .map(getAllModulesFromFolder)
        .reduce(function (arr, arrToMerge) { return __spreadArrays(arr, arrToMerge); }, []);
    return allModules;
}
function getAllPeerDependencies(allApps) {
    var allPackageJsonPaths = allApps.map(function (app) {
        return path_1.default.join(app.paths.root, 'package.json');
    });
    var allPeerDeps = allPackageJsonPaths
        .map(function (filePath) {
        try {
            var _a = fs_2.readFileAsJSON(filePath).peerDependencies, peerDependencies = _a === void 0 ? {} : _a;
            return peerDependencies;
        }
        catch (_b) {
            return {};
        }
    })
        .reduce(function (resArr, peerDepsObj) {
        return __spreadArrays(resArr, Object.keys(peerDepsObj));
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
function webpackExternalsAsStringArray(_a) {
    var peerOnly = (_a === void 0 ? {} : _a).peerOnly;
    var activeApp = cantara_config_1.getActiveApp();
    var allApps = cantara_config_1.default().allApps;
    var externals = [];
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
function getAllWebpackExternals(_a) {
    var peerOnly = (_a === void 0 ? {} : _a).peerOnly;
    var externals = webpackExternalsAsStringArray({ peerOnly: peerOnly });
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
    return function (_, request, callback) {
        var moduleName = getModuleName(request);
        if (externals.includes(moduleName)) {
            // mark this module as external
            // https://webpack.js.org/configuration/externals/
            return callback(null, 'commonjs ' + request);
        }
        callback();
    };
}
exports.default = getAllWebpackExternals;
