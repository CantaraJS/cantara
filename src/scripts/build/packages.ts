import webpack from 'webpack';
import path from 'path';

import { CantaraApplication } from '../../util/types';
import createLibraryWebpackConfig from '../../util/config/webpackLibraryConfig';
import { readFileAsJSON, writeJson } from '../../util/fs';
import execCmd from '../../util/exec';
import slash from 'slash';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import { transpile } from '../../util/babel';
import { logBuildTime } from './util';

function compile(config: webpack.Configuration) {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err) => {
      if (err) {
        reject(new Error('Error while compiling.'));
        return;
      }
      compiler.close((err) => {
        if (err) {
          reject(new Error('Error while compiling.'));
        } else {
          resolve(true);
        }
      });
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

  const commonOptions = {
    alias: allAliases,
    app,
    env,
    projectDir,
    include: internalPackages,
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

  const { libraryTargets = ['umd', 'commonjs'], skipBundling } = app.meta;

  if (libraryTargets.includes('commonjs')) {
    if (skipBundling) {
      const onTranspiled = logBuildTime({
        stepName: 'Transpiling',
        toolName: 'Babel',
      });
      await transpile(app);
      onTranspiled();
    } else {
      const onCompiled = logBuildTime({
        stepName: 'Bundling as CommonJS module',
        toolName: 'Webpack',
      });
      await compile(webpackCommonJsConfig);
      onCompiled();
    }
  }
  if (libraryTargets.includes('umd')) {
    const onCompiled = logBuildTime({
      stepName: 'Creating optimized UMD build',
      toolName: 'Webpack',
    });
    await compile(webpackUmdConfig);
    onCompiled();
  }

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
  const newPackageJson = {
    ...packageJson,
    main: `./${slash(
      path.join(
        path.relative(app.paths.root, app.paths.build),
        path.basename(app.name),
        'src',
        'index.js',
      ),
    )}`,
  };
  writeJson(packageJsonPath, newPackageJson);
}
