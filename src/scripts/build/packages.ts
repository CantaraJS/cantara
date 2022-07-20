import webpack from 'webpack';
import path from 'path';

import { CantaraApplication } from '../../util/types';
import { fsReaddir, readFileAsJSON, writeJson } from '../../util/fs';
import execCmd from '../../util/exec';
import getGlobalConfig from '../../cantara-config/global-config';
import getRuntimeConfig from '../../cantara-config/runtime-config';
import { compile, logBuildTime, prepareTypesOutputFolder } from './util';
import buildPackageWithRollup from '../../util/config/buildPackageWithRollup';
import createLibraryWebpackConfig from '../../util/config/webpackLibraryConfig';
import { BundlerConfigParams } from '../../util/config/types';
import slash from 'slash';
import del from 'del';
import { existsSync } from 'fs';

interface BuildResult {
  cjs?: string;
  umd?: string;
  esm?: string;
}

export default async function buildPackage(app: CantaraApplication) {
  console.log('Build package', app.type);

  const {
    includes: { internalPackages },
    projectDir,
    aliases: { packageAliases },
    internalPaths: { root: cantaraRoot },
    globalCantaraSettings,
  } = getGlobalConfig();

  const { env } = getRuntimeConfig();
  const allAliases = { ...packageAliases };

  let { libraryTargets = ['umd', 'commonjs', 'esm'], sourceMaps } = app.meta;

  if (libraryTargets.length === 0) {
    libraryTargets = ['esm'];
  }

  // Delete build folder
  await del(app.paths.build, { force: true });

  const commonBundlerConfig: BundlerConfigParams = {
    alias: allAliases,
    app,
    env,
    projectDir,
    include: internalPackages,
    sourceMaps,
    enableBundleAnalyzer: globalCantaraSettings.bundleAnalyzer,
  };

  const buildResult: BuildResult = {};

  if (libraryTargets.includes('esm')) {
    const onBundleCreated = logBuildTime({
      stepName: `Creating ESM bundle`,
      toolName: 'Rollup',
    });
    buildResult.esm = await buildPackageWithRollup({
      ...commonBundlerConfig,
      libraryTarget: 'esm',
    });
    onBundleCreated();
  }

  if (libraryTargets.includes('commonjs')) {
    const onBundleCreated = logBuildTime({
      stepName: `Creating CommonJS bundle`,
      toolName: 'Rollup',
    });
    buildResult.cjs = await buildPackageWithRollup({
      ...commonBundlerConfig,
      libraryTarget: 'commonjs',
    });
    onBundleCreated();
  }

  if (libraryTargets.includes('umd')) {
    // Create UMD build using webpack because it supports lazy loading
    const webpackUmdConfig = createLibraryWebpackConfig({
      ...commonBundlerConfig,
      libraryTarget: 'umd',
    });
    await compile(webpackUmdConfig);

    const relativeBuildPath = path.relative(
      app.paths.root,
      webpackUmdConfig.output!.path!,
    );

    const realtiveOutPath = path.join(
      relativeBuildPath,
      webpackUmdConfig.output!.filename as string,
    );

    buildResult.umd = slash(realtiveOutPath);
  }

  if (!app.meta.skipTypeGeneration) {
    // Generate types

    const tsConfigPath = path.join(app.paths.root, 'tsconfig.json');
    const suppress = app.meta.suppressTsErrors
      ? ` --suppress ${app.meta.suppressTsErrors.join(',')}@`
      : '';
    const tsPath = path.join(
      cantaraRoot,
      'node_modules/typescript/lib/typescript.js',
    );

    const tsConfigExists = existsSync(tsPath);
    console.log(
      '<<<<<<<<<<<<<<<<<<<<<<< tsConfigExists <<<<<<<<<<<<<<<<<<<<<<<',
      tsConfigExists,
    );

    const dirContents = await fsReaddir(path.join(cantaraRoot, 'node_modules'));
    console.log(`node_modules`, dirContents);

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

  const customTypeFiles = (app.meta.customTypes ?? []).map((relativePath) =>
    path.join(app.paths.root, relativePath),
  );

  // Set correct path to index.js in packageJson's "main" field
  const packageJsonPath = path.join(app.paths.root, 'package.json');
  const typesFolder = path.join(app.paths.build, 'types');
  const packageFolderName = path.basename(app.paths.root);
  const packageJson = readFileAsJSON(packageJsonPath);
  packageJson.main = buildResult.cjs;
  packageJson.module = buildResult.esm;
  packageJson.types = await prepareTypesOutputFolder({
    packageFolderName,
    typesFolder,
    customTypeFiles,
    appRootPath: app.paths.root,
  });
  writeJson(packageJsonPath, packageJson);
}
