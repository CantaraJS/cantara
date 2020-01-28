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
