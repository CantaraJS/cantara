import { CantaraApplication } from '../util/types';
import { createOrUpdatePackageJSON } from './util/npm';
import { createNodeJestConfig } from './util/jest';
import { createLocalAppTsConfig } from './util/typescript';

export default async function prepareNodeApp(app: CantaraApplication) {
  await createOrUpdatePackageJSON({ rootDir: app.paths.root });
  createNodeJestConfig(app);
  // Create local tsconfig which extends from global one.
  // Needed to correctly generate types
  createLocalAppTsConfig({ app, indexFileName: 'index.tsx' });
}
