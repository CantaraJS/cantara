import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import slash from 'slash';
import renderTemplate from '../../util/configTemplates';
import { CantaraApplication } from '../../util/types';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';

interface CreateJestConfigOptions {
  /** Path where to save jest.config.js */
  dir: string;
  configTemplateFileName: string;
  setupScriptImports?: string[];
}

export function createJestConfig({
  dir,
  configTemplateFileName,
  setupScriptImports = [],
}: CreateJestConfigOptions) {
  const globalCantaraConfig = getGlobalConfig();
  const jestAliases = getJestAliases();

  // Copy setup file to project root
  const setupFileTemplatePath = path.join(
    globalCantaraConfig.internalPaths.static,
    'jestSetup.template.ts',
  );
  const renderedSetupFile = renderTemplate({
    template: readFileSync(setupFileTemplatePath).toString(),
    variables: {
      ENV_FILE_PATH: slash(
        path.join(globalCantaraConfig.internalPaths.temp, '.env.json'),
      ),
      IMPORTS: setupScriptImports.reduce((importStr, importName) => {
        return `${importStr}import '${importName}'\n`;
      }, ''),
    },
  });
  const setupFileDestination = path.join(dir, 'jest.setup.ts');
  writeFileSync(setupFileDestination, renderedSetupFile);

  // create jest.config.js
  const jestConfigTemplate = readFileSync(
    path.join(globalCantaraConfig.internalPaths.static, configTemplateFileName),
  ).toString();

  // Map all package aliases and mock all possible import file types
  const styleMockFilePath = path.join(
    globalCantaraConfig.internalPaths.static,
    'jestStyleMock.js',
  );
  const fileMockFilePath = path.join(
    globalCantaraConfig.internalPaths.static,
    'jestFileMock.js',
  );
  const moduleNameMapper = {
    ...jestAliases,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': fileMockFilePath,
    '\\.(css|less)$': styleMockFilePath,
  };

  const templateVariables = {
    MODULES_PATH: slash(globalCantaraConfig.internalPaths.nodeModules) + '/',
    MODULE_NAME_MAPPER: JSON.stringify(moduleNameMapper, null, 2),
  };

  const newJestConfig = renderTemplate({
    template: jestConfigTemplate,
    variables: templateVariables,
  });
  const newJestConfigPath = path.join(dir, 'jest.config.js');

  writeFileSync(newJestConfigPath, newJestConfig);
}

export function createNodeJestConfig(app: CantaraApplication) {
  createJestConfig({
    dir: app.paths.root,
    configTemplateFileName: 'jestNodeConfig.template.js',
  });
}

export function createReactJestConfig(app: CantaraApplication) {
  createJestConfig({
    dir: app.paths.root,
    configTemplateFileName: 'jestReactConfig.template.js',
    setupScriptImports: [
      '@testing-library/jest-dom',
      '@testing-library/jest-dom/extend-expect',
    ],
  });
}

/** Converts webpack compatible aliases
 * into Jest's `moduleNameMapper` aliases
 */
function getJestAliases() {
  const {
    aliases: { packageAliases },
  } = getGlobalConfig();
  try {
    const {
      currentCommand: { app },
    } = getRuntimeConfig();
    const jestAliases = Object.keys(packageAliases).reduce(
      (aliasObj, packageName) => {
        const packageAbsolutePath = packageAliases[packageName];
        const relativePathToPackage = path.relative(
          app.paths.root,
          packageAbsolutePath,
        );
        return {
          ...aliasObj,
          [`^${packageName}$`]: `<rootDir>/${slash(relativePathToPackage)}`,
        };
      },
      {},
    );
    return jestAliases;
  } catch (e) {
    // No active app, skipping...
    return {};
  }
}
