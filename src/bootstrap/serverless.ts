import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import slash from 'slash';

import getGlobalConfig from '../cantara-config';
import { CantaraApplication } from '../util/types';
import renderTemplate from '../util/configTemplates';

const mergeYaml = require('@alexlafroscia/yaml-merge');

function createWebpackAndBabelConfigFromTemplate(app: CantaraApplication) {
  const globalCantaraConfig = getGlobalConfig();
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

  const templateVariables = {
    MODULES_PATH:
      slash(path.join(globalCantaraConfig.internalPaths.root, 'node_modules')) +
      '/',
    TSCONFIG_PATH: slash(
      path.join(globalCantaraConfig.runtime.projectDir, 'tsconfig.json'),
    ),
    ROOT_PATH: app.paths.src.replace(new RegExp('\\\\', 'g'), '\\\\'),
  };

  const newBabelConfig = renderTemplate({
    template: babelConfigTemplate,
    variables: templateVariables,
  });
  const newWebpackConfig = renderTemplate({
    template: webpackConfigTemplate,
    variables: templateVariables,
  });

  writeFileSync(
    path.join(
      globalCantaraConfig.internalPaths.static,
      'serverlessBabelConfig.js',
    ),
    newBabelConfig,
  );

  writeFileSync(
    path.join(
      globalCantaraConfig.internalPaths.static,
      'serverlessWebpackConfig.js',
    ),
    newWebpackConfig,
  );
}

function createServerlessYml(app: CantaraApplication) {
  const globalCantaraConfig = getGlobalConfig();

  const relativeWebpackConfigPath = slash(
    path.join(
      path.relative(app.paths.root, globalCantaraConfig.internalPaths.static),
      'serverlessWebpackConfig.js',
    ),
  );
  const templateVariables = {
    MODULES_PATH:
      slash(path.join(globalCantaraConfig.internalPaths.root, 'node_modules')) +
      '/',
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
    globalCantaraConfig.internalPaths.static,
    'serverless.parts.yml',
  );
  writeFileSync(serverlessPartsFilePath, newServerlessYmlParts);

  const userServerlessYmlPath = path.join(app.paths.root, 'serverless.yml');

  // Merge user's yaml file and this one
  const newServerlessYml = mergeYaml(
    serverlessPartsFilePath,
    userServerlessYmlPath,
  );
  writeFileSync(userServerlessYmlPath, newServerlessYml);
}

/** Prepares Serverless App Folder */
export default async function prepareServerlessApp(app: CantaraApplication) {
  // First, create the webpack and the babel config with the correct paths
  createWebpackAndBabelConfigFromTemplate(app);

  // Now, create the custom serverless.yml file with the correct paths
  // The main serverless.yml file needs to inherit from it!
  createServerlessYml(app);
}
