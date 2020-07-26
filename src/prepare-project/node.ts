import { CantaraApplication } from '../util/types';
import { createOrUpdatePackageJSON } from './util/yarn';
import { createNodeJestConfig } from './util/testing';
import { createLocalAppTsConfig } from './util/typescript';

export default async function prepareNodeApp(app: CantaraApplication) {
  await createOrUpdatePackageJSON({ rootDir: app.paths.root });
  createNodeJestConfig(app);
  // Create local tsconfig which extends from global one.
  // Needed to correctly generate types
  createLocalAppTsConfig({ app, indexFileName: 'index.ts' });
}
