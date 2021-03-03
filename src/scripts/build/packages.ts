import webpack from 'webpack';
import path from 'path';

import { CantaraApplication } from '../../util/types';
import { readFileAsJSON, writeJson } from '../../util/fs';
import execCmd from '../../util/exec';
import slash from 'slash';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import { logBuildTime } from './util';
import buildPackageWithRollup from '../../util/config/buildPackageWithRollup';

function compile(config: webpack.Configuration) {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err) => {
      if (err) {
        reject(new Error('Error while compiling.'));
        return;
      }
      console.log('Successfully compiled!');
      resolve(true);
    });
  });
}

export default async function buildPackage(app: CantaraApplication) {
  const {
    includes: { internalPackages },
    projectDir,
    aliases: { packageAliases },
    internalPaths: { root: cantaraRoot },
  } = getGlobalConfig();

  const { env } = getRuntimeConfig();
  const allAliases = { ...packageAliases };

  let { libraryTargets = ['umd', 'commonjs', 'esm'], skipBundling } = app.meta;

  if (libraryTargets.length === 0) {
    libraryTargets = ['esm'];
  }

  const onBundleCreated = logBuildTime({
    stepName: `Creating distribution bundles (${libraryTargets.join(', ')})`,
    toolName: 'Rollup',
  });
  const buildResult = await buildPackageWithRollup({
    alias: allAliases,
    app,
    env,
    projectDir,
    include: internalPackages,
    libraryTargets,
  });
  onBundleCreated();

  if (!app.meta.skipTypeGeneration) {
    // Generate types
    const tsConfigPath = path.join(app.paths.root, '.tsconfig.local.json');
    const suppress = app.meta.suppressTsErrors
      ? ` --suppress ${app.meta.suppressTsErrors.join(',')}@`
      : '';
    const tsPath = path.join(
      cantaraRoot,
      'node_modules/typescript/lib/typescript.js',
    );

    const tscSilentBin = path.join(cantaraRoot, 'node_modules/.bin/tsc-silent');
    const onTypesGenerated = logBuildTime({
      stepName: 'Generating types',
      toolName: 'TSC',
    });
    await execCmd(
      `"${tscSilentBin}" --compiler "${tsPath}" --project "${tsConfigPath}"${suppress}`,
      {
        workingDirectory: app.paths.root,
        redirectIo: true,
      },
    );
    onTypesGenerated();
  }

  // Set correct path to index.js in packageJson's "main" field
  const packageJsonPath = path.join(app.paths.root, 'package.json');
  const packageJson = readFileAsJSON(packageJsonPath);
  packageJson.main = buildResult.cjs;
  packageJson.module = buildResult.esm;
  packageJson.browser = buildResult.umd;
  writeJson(packageJsonPath, packageJson);
}
