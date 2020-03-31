"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
async function prepareNodeApp(app) {
    await util_1.createOrUpdatePackageJSON({ rootDir: app.paths.root });
    util_1.createNodeJestConfig(app);
    // Create local tsconfig which extends from global one.
    // Needed to correctly generate types
    util_1.createLocalAppTsConfig({ app, indexFileName: 'index.tsx' });
}
exports.default = prepareNodeApp;
