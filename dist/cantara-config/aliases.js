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
/** Returns all aliases for packages in the form
 * { 'package-name': 'path/to/package/index.tx }.
 */
function getAllPackageAliases(allApps) {
    var aliases = allApps
        .filter(function (app) { return app.type === 'js-package' || app.type === 'react-component'; })
        .reduce(function (aliasesObj, currentApp) {
        var _a;
        return __assign(__assign({}, aliasesObj), (_a = {}, _a[currentApp.name] = slash_1.default(currentApp.paths.src), _a));
    }, {});
    return aliases;
}
exports.default = getAllPackageAliases;
