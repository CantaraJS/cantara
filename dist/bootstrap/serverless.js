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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = require("fs");
var slash_1 = __importDefault(require("slash"));
var cantara_config_1 = __importDefault(require("../cantara-config"));
var configTemplates_1 = __importDefault(require("../util/configTemplates"));
var util_1 = require("./util");
var externals_1 = require("../util/externals");
var mergeYaml = require('@alexlafroscia/yaml-merge');
function createWebpackAndBabelConfigFromTemplate(app) {
    var globalCantaraConfig = cantara_config_1.default();
    var babelConfigTemplate = fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, 'serverlessBabelConfig.template.js')).toString();
    var webpackConfigTemplate = fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, 'serverlessWebpackConfig.template.js')).toString();
    var allAliases = __assign(__assign({}, globalCantaraConfig.runtime.aliases.appDependencyAliases), globalCantaraConfig.runtime.aliases.packageAliases);
    var externals = externals_1.webpackExternalsAsStringArray();
    var templateVariables = {
        MODULES_PATH: slash_1.default(path_1.default.join(globalCantaraConfig.internalPaths.root, 'node_modules')) +
            '/',
        TSCONFIG_PATH: slash_1.default(path_1.default.join(app.paths.root, 'tsconfig.local.json')),
        ROOT_PATH: app.paths.src.replace(new RegExp('\\\\', 'g'), '\\\\'),
        ALIASES: JSON.stringify(allAliases),
        ENV_VARS: JSON.stringify(app.env || {}),
        EXTERNALS_ARRAY: JSON.stringify(externals),
    };
    var newBabelConfig = configTemplates_1.default({
        template: babelConfigTemplate,
        variables: templateVariables,
    });
    var newWebpackConfig = configTemplates_1.default({
        template: webpackConfigTemplate,
        variables: templateVariables,
    });
    fs_1.writeFileSync(path_1.default.join(globalCantaraConfig.internalPaths.temp, 'serverlessBabelConfig.js'), newBabelConfig);
    fs_1.writeFileSync(path_1.default.join(globalCantaraConfig.internalPaths.temp, 'serverlessWebpackConfig.js'), newWebpackConfig);
}
function createServerlessYml(app) {
    var globalCantaraConfig = cantara_config_1.default();
    var relativeWebpackConfigPath = slash_1.default(path_1.default.join(path_1.default.relative(app.paths.root, globalCantaraConfig.internalPaths.temp), 'serverlessWebpackConfig.js'));
    var templateVariables = {
        MODULES_PATH: slash_1.default(path_1.default.join(globalCantaraConfig.internalPaths.root, 'node_modules')) +
            '/',
        WEBPACK_CONFIG_PATH: relativeWebpackConfigPath,
    };
    var serverlessYmlTemplate = fs_1.readFileSync(path_1.default.join(globalCantaraConfig.internalPaths.static, 'serverlessTemplate.yml')).toString();
    var newServerlessYmlParts = configTemplates_1.default({
        template: serverlessYmlTemplate,
        variables: templateVariables,
    });
    var serverlessPartsFilePath = path_1.default.join(globalCantaraConfig.internalPaths.temp, 'serverless.parts.yml');
    fs_1.writeFileSync(serverlessPartsFilePath, newServerlessYmlParts);
    var userServerlessYmlPath = path_1.default.join(app.paths.root, 'serverless.yml');
    // Merge user's yaml file and this one
    var newServerlessYml = mergeYaml(userServerlessYmlPath, serverlessPartsFilePath);
    fs_1.writeFileSync(userServerlessYmlPath, newServerlessYml);
}
/** Prepares Serverless App Folder */
function prepareServerlessApp(app) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // First, create the webpack and the babel config with the correct paths
            createWebpackAndBabelConfigFromTemplate(app);
            // Now, create the custom serverless.yml file with the correct paths
            // The main serverless.yml file needs to inherit from it!
            createServerlessYml(app);
            // Create jest config
            util_1.createNodeJestConfig(app);
            // Create package.json
            util_1.createOrUpdatePackageJSON({ rootDir: app.paths.root });
            // Create local tsconfig which extends from global one.
            // Needed to correctly generate types
            util_1.createLocalAppTsConfig({ app: app, indexFileName: 'index.tsx' });
            return [2 /*return*/];
        });
    });
}
exports.default = prepareServerlessApp;
