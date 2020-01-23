"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = require("./fs");
var cantara_config_1 = __importDefault(require("../cantara-config"));
function getLibraryExternals(_a) {
    var packageJsonPath = _a.packageJsonPath, peerOnly = _a.peerOnly;
    try {
        var _b = fs_1.readFileAsJSON(packageJsonPath), _c = _b.dependencies, dependencies = _c === void 0 ? {} : _c, _d = _b.peerDependencies, peerDependencies = _d === void 0 ? {} : _d;
        if (peerOnly)
            return Object.keys(peerDependencies);
        return __spreadArrays(Object.keys(dependencies), Object.keys(peerDependencies));
    }
    catch (_e) {
        // package.json does not exist
        return [];
    }
}
/** Makes sure that all package dependencies
 * are externalized (not included in bundle).
 * Reads every packageJson provided and adds
 * each dependency to the list.
 * If `peerOnly` is set to `true`, only peer
 * dependecies are excluded. Useful for
 * CDN bundles.
 */
function getAllExternals(_a) {
    var packageJsonPaths = _a.packageJsonPaths, peerOnly = _a.peerOnly;
    var allDeps = packageJsonPaths
        .map(function (packageJsonPath) { return getLibraryExternals({ packageJsonPath: packageJsonPath, peerOnly: peerOnly }); })
        .reduce(function (resArr, currArr) { return resArr.concat(currArr); }, []);
    return allDeps;
}
function getAllWebpackExternals(_a) {
    var peerOnly = (_a === void 0 ? {} : _a).peerOnly;
    var allApps = cantara_config_1.default().allApps;
    var allPackageJsonPaths = allApps.map(function (app) {
        return path_1.default.join(app.paths.root, 'package.json');
    });
    var allWebpackExternals = getAllExternals({
        packageJsonPaths: allPackageJsonPaths,
        peerOnly: peerOnly,
    });
    return allWebpackExternals;
}
exports.default = getAllWebpackExternals;
