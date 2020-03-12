import webpack from 'webpack';
import path from 'path';

import { CantaraApplication } from '../../util/types';
import getGlobalConfig from '../../cantara-config';
import createLibraryWebpackConfig from '../../util/config/webpackLibraryConfig';
import { readFileAsJSON, writeJson } from '../../util/fs';
import execCmd from '../../util/exec';
import slash from 'slash';

function compile(config: webpack.Configuration) {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run(err => {
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
    allPackages: { include },
    runtime: {
      projectDir,
      aliases: { appDependencyAliases, packageAliases },
    },
    internalPaths: { root: cantaraRoot },
  } = getGlobalConfig();
  const allAliases = { ...appDependencyAliases, ...packageAliases };

  const commonOptions = {
    alias: allAliases,
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
    noChecks: false,
  });

  const { libraryTargets = ['umd', 'commonjs'] } = app.meta;

  if (libraryTargets.includes('commonjs')) {
    await compile(webpackCommonJsConfig);
  }
  if (libraryTargets.includes('umd')) {
    await compile(webpackUmdConfig);
  }

  if (!app.meta.skipTypeGeneration) {
    // Generate types
    const tsConfigPath = path.join(app.paths.root, '.tsconfig.local.json');
    // Suppress error TS2742, which often occurrs when
    // the same typedefinitions are found in packages
    // which require each other. For Cantara projects, this
    // is no problem, as long as the definitions are there.
    await execCmd(`tsc-silent --project ${tsConfigPath} --suppress 2742@`, {
      workingDirectory: cantaraRoot,
      redirectIo: true,
    });
  }

  // Set correct path to index.js in packageJson's "main" field
  const packageJsonPath = path.join(app.paths.root, 'package.json');
  const packageJson = readFileAsJSON(packageJsonPath);
  const newPackageJson = {
    ...packageJson,
    main: `./${slash(
      path.join(
        path.relative(app.paths.root, app.paths.build),
        app.name,
        'src',
        'index.js',
      ),
    )}`,
  };
  writeJson(packageJsonPath, newPackageJson);
}
