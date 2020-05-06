import { CantaraApplication } from '../util/types';
import {
  createOrUpdatePackageJSON,
  autoInstallMissingPackages,
} from './util/npm';
import { createNodeJestConfig } from './util/jest';
import { createLocalAppTsConfig } from './util/typescript';

export default async function prepareNodeApp(app: CantaraApplication) {
  await createOrUpdatePackageJSON({ rootDir: app.paths.root });
  // Auto-install packages
  await autoInstallMissingPackages(app.paths.root);
  createNodeJestConfig(app);
  // Create local tsconfig which extends from global one.
  // Needed to correctly generate types
  createLocalAppTsConfig({ app, indexFileName: 'index.ts' });
}
