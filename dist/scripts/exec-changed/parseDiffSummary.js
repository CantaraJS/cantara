"use strict";
// Inspired from https://github.com/steveukx/git-js/blob/HEAD/src/responses/DiffSummary.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function parseDiffSummary(diffSum, projectDir) {
    const lines = diffSum.trim().split('\n');
    const changeObjs = lines.map(line => textFileChange(line) || binaryFileChange(line));
    const withAbsolutePaths = changeObjs
        .map(obj => {
        if (obj) {
            return {
                ...obj,
                file: path_1.default.join(projectDir, obj.file),
            };
        }
        return false;
    })
        .filter(Boolean);
    return withAbsolutePaths;
}
exports.default = parseDiffSummary;
function textFileChange(lineIn) {
    let line = lineIn.trim().match(/^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/);
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
    let line = lineIn.match(/^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)$/);
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
