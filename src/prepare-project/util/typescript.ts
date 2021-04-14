import path from 'path';
import { readFileSync } from 'fs';
import renderTemplate from '../../util/configTemplates';
import { CantaraApplication } from '../../util/types';
import { writeJson } from '../../util/fs';
import getGlobalConfig from '../../cantara-config/global-config';
import slash from 'slash';
import getRuntimeConfig from '../../cantara-config/runtime-config';

/** Make paths relative for typescript */
function aliasesToTypeScriptPaths(aliases: { [key: string]: string }) {
  return Object.keys(aliases).reduce((newObj, currAliasName) => {
    const currPath = aliases[currAliasName];
    // const newPath = currPath.slice(currPath.lastIndexOf('packages'));
    return {
      ...newObj,
      [currAliasName]: [currPath],
      [`${currAliasName}/*`]: [`${currPath}/*`],
    };
  }, {});
}

interface createLocalTsConfigOptions {
  indexFileName: string;
  app: CantaraApplication;
  templateFileName: string;
}
/**
 * Create local tsconfig which extends from global one.
 * Needed to correctly generate types
 */
export function createLocalTsConfig({
  indexFileName,
  app,
  templateFileName,
}: createLocalTsConfigOptions) {
  const globalCantaraConfig = getGlobalConfig();
  const { tsFilesToInclude } = getRuntimeConfig();
  const appLocalTsConfigTemplate = readFileSync(
    path.join(globalCantaraConfig.internalPaths.static, templateFileName),
  ).toString();

  const renderedTsConfig = renderTemplate({
    template: appLocalTsConfigTemplate,
    variables: {
      INDEX_FILE_NAME: indexFileName,
    },
  });

  const appLocalTsConfigPath = path.join(app.paths.root, 'tsconfig.json');

  let {
    aliases: { packageAliases },
  } = globalCantaraConfig;

  const {
    aliases: { linkedPackageAliases, otherAliases },
  } = getRuntimeConfig();

  let tsConfig = JSON.parse(renderedTsConfig);
  const customTypes = app.meta.customTypes || [];

  // Create app root alias (for Node and React Apps only)
  let appRootPathAlias = {};
  if (
    app.type === 'react' ||
    app.type === 'node' ||
    app.type === 'serverless'
  ) {
    appRootPathAlias = { '~': app.paths.src };
  }

  tsConfig = {
    ...tsConfig,
    include: [...(tsConfig.include || []), ...customTypes, ...tsFilesToInclude],
    compilerOptions: {
      ...tsConfig.compilerOptions,
      paths: aliasesToTypeScriptPaths({
        ...appRootPathAlias,
        ...packageAliases,
        ...linkedPackageAliases,
        ...otherAliases,
      }),
    },
  };

  writeJson(appLocalTsConfigPath, tsConfig);
}

export function createGlobalTsConfig() {
  const globalCantaraConfig = getGlobalConfig();

  // Read tsconfig.json and add package aliases
  let tsConfigTemplate = readFileSync(
    path.join(
      globalCantaraConfig.internalPaths.static,
      'tsConfigTemplate.json',
    ),
  ).toString();

  tsConfigTemplate = tsConfigTemplate.replace(
    '<--MODULES_PATH-->',
    slash(globalCantaraConfig.internalPaths.nodeModules),
  );

  const tsConfig = JSON.parse(tsConfigTemplate);
  const {
    aliases: { packageAliases },
  } = globalCantaraConfig;

  writeJson(
    path.join(globalCantaraConfig.projectDir, 'tsconfig.json'),
    tsConfig,
  );
}
