import slash from 'slash';
import path from 'path';
import { CantaraApplication } from '../util/types';
import { readFileAsJSON } from '../util/fs';
import { existsSync } from 'fs';
/**
 * Get all dependencies of the current app
    and create an alias for them to make sure
    that when a package uses the same dependency,
    it uses the dependecy from the app's
    node_modules folder. Some libs require
    that there's only one instance present,
    e.g. React, styled-components, ...
 */
export function getDependencyAliases(app: CantaraApplication) {
  const doSetAliasesForThisAppType =
    app.type === 'serverless' || app.type === 'node' || app.type === 'react';

  if (!doSetAliasesForThisAppType) return {};
  let dependencies = {};
  const packageJsonPath = path.join(app.paths.root, 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = readFileAsJSON(packageJsonPath);
    dependencies = packageJson.dependencies || {};
  }
  const appNodeModules = slash(path.join(app.paths.root, 'node_modules'));
  const dependencyAliases = Object.keys(dependencies).reduce(
    (depObj, depName) => {
      const depPath = path.join(appNodeModules, depName);
      return {
        ...depObj,
        [depName]: depPath,
      };
    },
    {},
  );
  return dependencyAliases;
}

interface GetAllPackageAliasesOptions {
  allApps: CantaraApplication[];
}

/** Returns all aliases for packages in the form
 * { 'package-name': 'path/to/package/index.tx }.
 */
export default function getAllPackageAliases({
  allApps,
}: GetAllPackageAliasesOptions): { [key: string]: string } {
  const packageAliases = allApps
    .filter(app => app.type === 'js-package' || app.type === 'react-component')
    .reduce((aliasesObj, currentApp) => {
      return {
        ...aliasesObj,
        [currentApp.name]: slash(currentApp.paths.src),
      };
    }, {});

  return packageAliases;
}
