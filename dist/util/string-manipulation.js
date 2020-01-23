"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function camalize(str) {
    if (str.length <= 1)
        return str;
    var camalized = str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, function (_, chr) { return chr.toUpperCase(); });
    var camalizedUpperCase = "" + camalized
        .charAt(0)
        .toUpperCase() + camalized.slice(1);
    return camalizedUpperCase;
}
exports.camalize = camalize;
