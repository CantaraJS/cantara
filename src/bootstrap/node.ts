import { CantaraApplication } from '../util/types';
import { createNodeJestConfig, createLocalAppTsConfig } from './util';

export default async function prepareNodeApp(app: CantaraApplication) {
  createNodeJestConfig(app);
  // Create local tsconfig which extends from global one.
  // Needed to correctly generate types
  createLocalAppTsConfig({ app, indexFileName: 'index.tsx' });
}
