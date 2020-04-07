import path from 'path';
import { readFileSync } from 'fs';
import getGlobalConfig from '../../cantara-config';
import renderTemplate from '../../util/configTemplates';
import { CantaraApplication } from '../../util/types';
import { writeJson } from '../../util/fs';

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
  writeJson(appLocalTsConfigPath, JSON.parse(renderedTsConfig));
}
