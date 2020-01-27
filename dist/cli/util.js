"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
/** "Normalizes" the behaviour of the CLI
 * no matter if Cantara is executed by the user
 * in a project folder or by nodemon in
 * development mode
 */
function setupCliContext() {
    // Set CWD to path of Cantara
    process.chdir(path_1.default.join(__dirname, '..', '..'));
}
exports.setupCliContext = setupCliContext;
/** Takes CLI command and removes unknown options
 * from it, so that no error is thrown. Those
 * unknown options are then passed to Cantara,
 * so that they can be used internally to e.g.
 * pass them to another program, for example Jest
 */
function prepareCmdForCommander(cmd, program) {
    var unknown = program.parseOptions(cmd).unknown;
    var unknownParams = unknown.join(' ');
    var cmdWithoutUnknownParams = cmd.filter(function (cmd, i) {
        if (i <= 2)
            return true;
        var shouldKeep = !unknown.includes(cmd);
        // Only remove it once
        unknown = unknown.filter(function (uCmd) { return uCmd !== cmd; });
        return shouldKeep;
    });
    return { cmd: cmdWithoutUnknownParams, unknownParams: unknownParams };
}
exports.prepareCmdForCommander = prepareCmdForCommander;
