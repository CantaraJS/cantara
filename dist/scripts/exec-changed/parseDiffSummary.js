"use strict";
// Inspired from https://github.com/steveukx/git-js/blob/HEAD/src/responses/DiffSummary.js
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
var path_1 = __importDefault(require("path"));
function parseDiffSummary(diffSum, projectDir) {
    var lines = diffSum.trim().split('\n');
    var changeObjs = lines.map(function (line) { return textFileChange(line) || binaryFileChange(line); });
    var withAbsolutePaths = changeObjs
        .map(function (obj) {
        if (obj) {
            return __assign(__assign({}, obj), { file: path_1.default.join(projectDir, obj.file) });
        }
        return false;
    })
        .filter(Boolean);
    return withAbsolutePaths;
}
exports.default = parseDiffSummary;
function textFileChange(lineIn) {
    var line = lineIn.trim().match(/^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/);
    if (line) {
        var alterations = (line[3] || '').trim();
        return {
            file: line[1].trim(),
            changes: parseInt(line[2], 10),
            insertions: alterations.replace(/-/g, '').length,
            deletions: alterations.replace(/\+/g, '').length,
            binary: false,
        };
    }
    return undefined;
}
function binaryFileChange(lineIn) {
    var line = lineIn.match(/^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)$/);
    if (line) {
        return {
            file: line[1].trim(),
            before: +line[2],
            after: +line[3],
            binary: true,
        };
    }
    return undefined;
}
