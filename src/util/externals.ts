// Inspired by https://github.com/liady/webpack-node-externals/blob/master/index.js

import path from 'path';
import fs from 'fs';

import { readFileAsJSON } from './fs';
import getGlobalConfig from '../cantara-config';
import { CantaraApplication } from './types';
import { existsSync } from 'fs';

function getAllModulesFromFolder(dirName: string): string[] {
  const atPrefix = new RegExp('^@', 'g');
  if (!fs.existsSync(dirName)) {
    return [];
  }

  try {
    return fs
      .readdirSync(dirName)
      .map(moduleName => {
        if (atPrefix.test(moduleName)) {
          // reset regexp
          atPrefix.lastIndex = 0;
          try {
            return fs
              .readdirSync(path.join(dirName, moduleName))
              .map(function(scopedMod) {
                return moduleName + '/' + scopedMod;
              });
          } catch (e) {
            return [moduleName];
          }
        }
        return moduleName;
      })
      .reduce((prev, next) => {
        return prev.concat(next as any);
      }, []) as string[];
  } catch (e) {
    return [];
  }
}

function getAllInstalledModules(allApps: CantaraApplication[]) {
  const allExistingNodeModuleFolders = allApps
    .map(app => path.join(app.paths.root, 'node_modules'))
    .filter(folderPath => existsSync(folderPath));
  const allModules = allExistingNodeModuleFolders
    .map(getAllModulesFromFolder)
    .reduce((arr, arrToMerge) => [...arr, ...arrToMerge], []);
  return allModules;
}

function getAllPeerDependencies(allApps: CantaraApplication[]) {
  const allPackageJsonPaths = allApps.map(app =>
    path.join(app.paths.root, 'package.json'),
  );
  const allPeerDeps = allPackageJsonPaths
    .map(filePath => {
      try {
        const { peerDependencies } = readFileAsJSON(filePath);
        return peerDependencies;
      } catch {
        return {};
      }
    })
    .reduce((resArr, peerDepsObj) => {
      return [...resArr, ...Object.keys(peerDepsObj)];
    }, []);
  return allPeerDeps;
}

function getModuleName(request: string) {
  var scopedModuleRegex = new RegExp(
    '@[a-zA-Z0-9][\\w-.]+/[a-zA-Z0-9][\\w-.]+([a-zA-Z0-9./]+)?',
    'g',
  );
  var req = request;
  var delimiter = '/';

  // check if scoped module
  if (scopedModuleRegex.test(req)) {
    // reset regexp
    scopedModuleRegex.lastIndex = 0;
    return req.split(delimiter, 2).join(delimiter);
  }
  return req.split(delimiter)[0];
}

interface GetAllWebpackExternalsOptions {
  peerOnly?: boolean;
}

export function webpackExternalsAsStringArray({
  peerOnly,
}: GetAllWebpackExternalsOptions = {}) {
  const { allApps } = getGlobalConfig();
  let externals: string[] = [];

  if (peerOnly) {
    // Read peer deps from package.json
    externals = getAllPeerDependencies(allApps);
  } else {
    // Read all node_modules folders to know which packages to externalize,
    // same as the popular nodeExternals() does
    externals = getAllInstalledModules(allApps);
  }
  return externals;
}

/** Makes sure that all package dependencies
 * are externalized (not included in bundle).
 * Reads every packageJson provided and adds
 * each dependency to the list.
 * If `peerOnly` is set to `true`, only peer
 * dependecies are excluded. Useful for
 * CDN bundles.
 */
export default function getAllWebpackExternals({
  peerOnly,
}: GetAllWebpackExternalsOptions = {}) {
  const externals = webpackExternalsAsStringArray({ peerOnly });

  // const externalsObj = externals.reduce((retObj, externalName) => {
  //   return {
  //     ...retObj,
  //     [externalName]: {
  //       commonjs: externalName,
  //     },
  //   };
  // }, {});

  // For some reason, only works with this function,
  // but not when defining excplictly through object
  // (which should be the same)
  return (
    _: any,
    request: string,
    callback: (err?: string | null, module?: string) => void,
  ) => {
    const moduleName = getModuleName(request);
    if (externals.includes(moduleName)) {
      // mark this module as external
      // https://webpack.js.org/configuration/externals/
      return callback(null, 'commonjs ' + request);
    }
    callback();
  };
}
