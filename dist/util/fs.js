"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
function readFileAsJSON(path) {
    return JSON.parse(fs_1.readFileSync(path).toString());
}
exports.readFileAsJSON = readFileAsJSON;
function writeJson(path, content) {
    var prettyPrintedJson = JSON.stringify(content, null, 2);
    fs_1.writeFileSync(path, prettyPrintedJson);
}
exports.writeJson = writeJson;
