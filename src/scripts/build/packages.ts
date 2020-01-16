import webpack from 'webpack';
import path from 'path';

import { CantaraApplication } from '../../util/types';
import getGlobalConfig from '../../cantara-config';
import createLibraryWebpackConfig from '../../util/config/webpackLibraryConfig';
import { readFileAsJSON, writeJson } from '../../util/fs';
import execCmd from '../../util/exec';
import { unlinkSync } from 'fs';

function compile(config: webpack.Configuration) {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(new Error('Error while compiling.'));
        return;
      }
      console.log('Successfully compiled!');
      resolve();
    });
  });
}

export default async function buildPackage(app: CantaraApplication) {
  const {
    allPackages: { aliases, include },
    runtime: { projectDir },
  } = getGlobalConfig();
  const commonOptions = {
    alias: aliases,
    app,
    projectDir,
    include,
  };
  const webpackCommonJsConfig = createLibraryWebpackConfig({
    ...commonOptions,
    libraryTarget: 'commonjs2',
    noChecks: true,
  });

  const webpackUmdConfig = createLibraryWebpackConfig({
    ...commonOptions,
    libraryTarget: 'umd',
  });

  const { libraryTargets = [] } = app.meta;

  if (libraryTargets.includes('commonjs')) {
    await compile(webpackCommonJsConfig);
  }
  if (libraryTargets.includes('umd')) {
    await compile(webpackUmdConfig);
  }

  // Generate types
  await execCmd('tsc', { workingDirectory: app.paths.root, redirectIo: true });

  // Set correct path to index.js in packageJson's "main" field
  const packageJsonPath = path.join(app.paths.root, 'package.json');
  const packageJson = readFileAsJSON(packageJsonPath);
  const newPackageJson = {
    ...packageJson,
    main: `./${path.relative(app.paths.root, app.paths.build)}/index.js`,
  };
  writeJson(packageJsonPath, newPackageJson);

  // Delete generated declaration files for jest setup script
  try {
    unlinkSync(path.join(app.paths.build, 'jest.setup.d.ts'));
    unlinkSync(path.join(app.paths.build, 'jest.setup.d.ts.map'));
  } catch (e) {
    console.log('err', e);
  }
}
