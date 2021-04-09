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

interface CreateLocalAppTsConfigOptions {
  indexFileName: string;
  app: CantaraApplication;
}
/**
 * Create local tsconfig which extends from global one.
 * Needed to correctly generate types
 */
export function createLocalAppTsConfig({
  indexFileName,
  app,
}: CreateLocalAppTsConfigOptions) {
  const globalCantaraConfig = getGlobalConfig();
  const { tsFilesToInclude } = getRuntimeConfig();
  const appLocalTsConfigTemplate = readFileSync(
    path.join(
      globalCantaraConfig.internalPaths.static,
      'appLocalTsConfigTemplate.json',
    ),
  ).toString();
  const renderedTsConfig = renderTemplate({
    template: appLocalTsConfigTemplate,
    variables: {
      INDEX_FILE_NAME: indexFileName,
    },
  });
  const appLocalTsConfigPath = path.join(
    app.paths.root,
    '.tsconfig.local.json',
  );

  let tsConfig = JSON.parse(renderedTsConfig);
  const customTypes = app.meta.customTypes || [];
  tsConfig = {
    ...tsConfig,
    include: [...(tsConfig.include || []), ...customTypes, ...tsFilesToInclude],
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

  const {
    aliases: { linkedPackageAliases, otherAliases },
    currentCommand: { app },
  } = getRuntimeConfig();

  const appRootAlias = { '~': app.paths.src };

  const newTsConfig = {
    ...tsConfig,
    compilerOptions: {
      ...tsConfig.compilerOptions,
      paths: aliasesToTypeScriptPaths({
        ...packageAliases,
        ...linkedPackageAliases,
        ...otherAliases,
        ...appRootAlias,
      }),
    },
  };
  writeJson(
    path.join(globalCantaraConfig.projectDir, 'tsconfig.json'),
    newTsConfig,
  );
}
