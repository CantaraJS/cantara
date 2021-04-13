import path from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import slash from 'slash';

import { CantaraApplication } from '../util/types';
import renderTemplate from '../util/configTemplates';

import { externalsAsStringArray } from '../util/externals';
import { createOrUpdatePackageJSON } from './util/yarn';
import { createNodeJestConfig } from './util/testing';
import { createLocalAppTsConfig } from './util/typescript';
import getGlobalConfig from '../cantara-config/global-config';
import getRuntimeConfig from '../cantara-config/runtime-config';
import { generateRuntimePresetCode } from './util/runtime-presets';

const mergeYaml = require('@alexlafroscia/yaml-merge');

interface CreateTempPathForAppOptions {
  app: CantaraApplication;
  fileName: string;
}

/**
 * Creates temporary path for
 * the specified file
 * based on the specified app,
 * this way, each SLS endpoint
 * gets it's own webpack
 * config file etc.
 */
function createTempFilePath({ fileName, app }: CreateTempPathForAppOptions) {
  const globalCantaraConfig = getGlobalConfig();
  return path.join(
    globalCantaraConfig.internalPaths.temp,
    `${app.name}_${fileName}`,
  );
}

function createWebpackAndBabelConfigFromTemplate(app: CantaraApplication) {
  // if skipCacheInvalidation is set to true, exclude typechecking plugin
  // as it would restart with every code change and make the
  // whole process even slower
  const { skipCacheInvalidation } = app.meta;
  const globalCantaraConfig = getGlobalConfig();
  const runtimeConfig = getRuntimeConfig();
  const babelConfigPath = createTempFilePath({
    app,
    fileName: 'serverlessBabelConfig.js',
  });
  const babelConfigTemplate = readFileSync(
    path.join(
      globalCantaraConfig.internalPaths.static,
      'serverlessBabelConfig.template.js',
    ),
  ).toString();
  const webpackConfigTemplate = readFileSync(
    path.join(
      globalCantaraConfig.internalPaths.static,
      'serverlessWebpackConfig.template.js',
    ),
  ).toString();

  const allAliases = {
    ...globalCantaraConfig.aliases.packageAliases,
    ...runtimeConfig.aliases.otherAliases,
    '~': app.paths.src,
  };
  // Externals must not contain aliases
  const externals = externalsAsStringArray({
    ignore: Object.keys(allAliases),
  });

  const allIncludes = [
    app.paths.src,
    ...globalCantaraConfig.includes.internalPackages,
    // TODO: We shouldn't include linked packages during development here,
    // but I really don't see any practical difference for now, as in most cases
    // you won't deploy serverless endpoints directly from your machine
    ...runtimeConfig.includes.linkedPackages,
  ];

  const MODULES_PATH =
    slash(globalCantaraConfig.internalPaths.nodeModules) + '/';
  const templateVariables = {
    BABEL_CONFIG_PATH: slash(babelConfigPath),
    MODULES_PATH,
    TSCONFIG_PATH: slash(path.join(app.paths.root, 'tsconfig.json')),
    INCLUDES: JSON.stringify(allIncludes),
    ALIASES: JSON.stringify(allAliases),
    ENV_VARS: JSON.stringify(runtimeConfig.env || {}),
    EXTERNALS_ARRAY: JSON.stringify(externals),
    ENABLE_TYPECHECKING: JSON.stringify(!skipCacheInvalidation),
    APP_STATIC_PATH: slash(app.paths.static || ''),
    APP_BUILD_PATH: slash(app.paths.build || ''),
    STATIC_FOLDER_EXISTS: app.paths.static
      ? existsSync(app.paths.static)
      : false,
  };

  const newBabelConfig = renderTemplate({
    template: babelConfigTemplate,
    variables: templateVariables,
  });
  const newWebpackConfig = renderTemplate({
    template: webpackConfigTemplate,
    variables: templateVariables,
  });

  writeFileSync(babelConfigPath, newBabelConfig);

  writeFileSync(
    createTempFilePath({
      app,
      fileName: 'serverlessWebpackConfig.js',
    }),
    newWebpackConfig,
  );
}

function createServerlessYml(app: CantaraApplication) {
  const globalCantaraConfig = getGlobalConfig();

  const relativeWebpackConfigPath = slash(
    path.join(
      path.relative(
        app.paths.root,
        createTempFilePath({
          app,
          fileName: 'serverlessWebpackConfig.js',
        }),
      ),
    ),
  );

  const templateVariables = {
    MODULES_PATH: slash(globalCantaraConfig.internalPaths.nodeModules) + '/',
    WEBPACK_CONFIG_PATH: relativeWebpackConfigPath,
  };

  const serverlessYmlTemplate = readFileSync(
    path.join(
      globalCantaraConfig.internalPaths.static,
      'serverlessTemplate.yml',
    ),
  ).toString();

  const newServerlessYmlParts = renderTemplate({
    template: serverlessYmlTemplate,
    variables: templateVariables,
  });

  const serverlessPartsFilePath = path.join(
    globalCantaraConfig.internalPaths.temp,
    'serverless.parts.yml',
  );
  writeFileSync(serverlessPartsFilePath, newServerlessYmlParts);

  const userServerlessYmlPath = path.join(
    app.paths.root,
    'serverless.main.yml',
  );

  const actualServerlessFilePath = path.join(app.paths.root, 'serverless.yml');

  // Merge user's yaml file and this one
  let newServerlessYml = mergeYaml(
    serverlessPartsFilePath,
    userServerlessYmlPath,
  );

  writeFileSync(actualServerlessFilePath, newServerlessYml);
}

/** Prepares Serverless App Folder */
export default async function prepareServerlessApp(app: CantaraApplication) {
  // Create package.json
  await createOrUpdatePackageJSON({ rootDir: app.paths.root });

  // First, create the webpack and the babel config with the correct paths
  createWebpackAndBabelConfigFromTemplate(app);

  // Now, create the custom serverless.yml file with the correct paths
  // The main serverless.yml file needs to inherit from it!
  createServerlessYml(app);

  // Create jest config
  createNodeJestConfig(app);

  // Create local tsconfig which extends from global one.
  // Needed to correctly generate types
  createLocalAppTsConfig({ app, indexFileName: 'index.tsx' });

  await generateRuntimePresetCode(app);
}
