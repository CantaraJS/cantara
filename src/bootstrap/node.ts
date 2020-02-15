import { CantaraApplication } from '../util/types';
import {
  createNodeJestConfig,
  createLocalAppTsConfig,
  createOrUpdatePackageJSON,
} from './util';

export default async function prepareNodeApp(app: CantaraApplication) {
  await createOrUpdatePackageJSON({ rootDir: app.paths.root });
  createNodeJestConfig(app);
  // Create local tsconfig which extends from global one.
  // Needed to correctly generate types
  createLocalAppTsConfig({ app, indexFileName: 'index.tsx' });
}
