import { CantaraApplication } from '../util/types';
import { createNodeJestConfig } from './util';

export default async function prepareNodeApp(app: CantaraApplication) {
  createNodeJestConfig(app);
}
