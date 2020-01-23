import path from 'path';

import { readFileAsJSON } from './fs';
import getGlobalConfig from '../cantara-config';

interface GetLibraryExternalsOptions {
  packageJsonPath: string;
  peerOnly?: boolean;
}

function getLibraryExternals({
  packageJsonPath,
  peerOnly,
}: GetLibraryExternalsOptions) {
  try {
    const { dependencies = {}, peerDependencies = {} } = readFileAsJSON(
      packageJsonPath,
    );
    if (peerOnly) return Object.keys(peerDependencies);
    return [...Object.keys(dependencies), ...Object.keys(peerDependencies)];
  } catch {
    // package.json does not exist
    return [];
  }
}

interface GetAllExternalsOptions {
  packageJsonPaths: string[];
  peerOnly?: boolean;
}

/** Makes sure that all package dependencies
 * are externalized (not included in bundle).
 * Reads every packageJson provided and adds
 * each dependency to the list.
 * If `peerOnly` is set to `true`, only peer
 * dependecies are excluded. Useful for
 * CDN bundles.
 */
function getAllExternals({
  packageJsonPaths,
  peerOnly,
}: GetAllExternalsOptions) {
  const allDeps = packageJsonPaths
    .map(packageJsonPath => getLibraryExternals({ packageJsonPath, peerOnly }))
    .reduce((resArr, currArr) => resArr.concat(currArr), []);

  return allDeps;
}

interface GetAllWebpackExternalsOptions {
  peerOnly?: boolean;
}

export default function getAllWebpackExternals({
  peerOnly,
}: GetAllWebpackExternalsOptions = {}) {
  const { allApps } = getGlobalConfig();
  const allPackageJsonPaths = allApps.map(app =>
    path.join(app.paths.root, 'package.json'),
  );
  const allWebpackExternals = getAllExternals({
    packageJsonPaths: allPackageJsonPaths,
    peerOnly,
  });
  return allWebpackExternals;
}
