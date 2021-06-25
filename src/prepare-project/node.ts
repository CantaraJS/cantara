import { CantaraApplication } from '../util/types';
import { createOrUpdatePackageJSON } from './util/yarn';
import { createNodeJestConfig } from './util/testing';
import { createLocalTsConfig } from './util/typescript';
import { generateRuntimePresetCode } from './util/runtime-presets';

export default async function prepareNodeApp(app: CantaraApplication) {
  await createOrUpdatePackageJSON({ rootDir: app.paths.root });
  createNodeJestConfig(app);
  // Create local tsconfig which extends from global one.
  // Needed to correctly generate types
  createLocalTsConfig({
    app,
    indexFileName: 'index.ts',
    templateFileName: 'appLocalTsConfigTemplate.json',
  });

  await generateRuntimePresetCode(app);
}
