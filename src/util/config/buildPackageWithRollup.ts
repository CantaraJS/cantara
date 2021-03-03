import { RollupOptions, rollup } from 'rollup';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

//@ts-expect-error
import { string } from 'rollup-plugin-string';
import alias from '@rollup/plugin-alias';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
//@ts-expect-error
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
//@ts-expect-error
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss-modules';
//@ts-expect-error
import postCssPresetEnv from 'postcss-preset-env';

import { BundlerConfigParams } from './types';
import { externalsAsStringArray } from '../externals';
import path from 'path';
import { camalize } from '../string-manipulation';
import { getBabelReactConfig } from './babelReactConfig';
import slash from 'slash';

function pathToGlob(pathStr: string) {
  let slashed = pathStr.replace(new RegExp('\\\\', 'g'), '/');
  if (!slashed.endsWith('/')) {
    slashed += '/';
  }

  slashed += '**/*';

  return slashed;
}

/**
 * Yields relative path of
 * entry files for each build
 */
interface BuildResult {
  cjs?: string;
  esm?: string;
  umd?: string;
}

/**
 * Create a package production
 * build using the Rollup bundler.
 */
export default async function buildPackageWithRollup({
  include: includePaths = [],
  projectDir,
  alias: buildAliases = {},
  env = {},
  libraryTargets = [],
  app,
}: BundlerConfigParams): Promise<BuildResult> {
  const buildResult: BuildResult = {};

  const include = ['src/**/*'];

  const isReactComponent = app.type === 'react-component';
  const babelConfig = getBabelReactConfig('production');

  const entryPath = isReactComponent
    ? path.join(app.paths.src, 'index.tsx')
    : path.join(app.paths.src, 'index.ts');

  const extensions = [
    '.web.js',
    '.mjs',
    '.js',
    '.json',
    '.web.jsx',
    '.jsx',
    '.ts',
    '.tsx',
  ];

  let external: string[] = [];
  let umdExternal: string[] = [];

  if (libraryTargets.includes('umd')) {
    const customExternals = app.meta.externalDependencies
      ? app.meta.externalDependencies.umd
      : {};
    umdExternal = ['react', 'react-dom', ...Object.keys(customExternals || {})];
  }

  if (libraryTargets.includes('esm') || libraryTargets.includes('commonjs')) {
    const customExternals = app.meta.externalDependencies
      ? app.meta.externalDependencies.commonjs
      : {};
    external = [
      ...externalsAsStringArray(),
      ...Object.keys(customExternals || {}),
    ];
  }

  // Change working dir to package, otherwise rollup won't work
  const workingDirBefore = process.cwd();
  process.chdir(app.paths.root);

  const commonPlugins: RollupOptions['plugins'] = [
    resolve({ extensions }), // so Rollup can find commonjs deps
    commonjs(), // so Rollup can convert commonjs deps to ES modules
    postcss({
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: '[local]-[hash:base64:5]',
      },
      plugins: [postCssPresetEnv],
      include,
    }),
    string({
      include: /\.html?$/,
      exclude: [/node_modules/],
    }),
    alias({ entries: buildAliases }),
    injectProcessEnv(env),
    babel({
      ...babelConfig,
      babelHelpers: 'runtime',
      include,
      extensions,
    }),
    dynamicImportVars({ include }),
    url({
      exclude: [/\.(js|jsx|ts|tsx|mjs)$/, /\.html?$/, /\.json$/, /\.css$/],
      limit: Number.MAX_VALUE,
    }),
  ];

  const rollupConfig: RollupOptions[] = [];

  const createExternalFn = (externals: string[]) => {
    return (id: string) => {
      return !!externals.find((m) => id.startsWith(m));
    };
  };

  const makePathRootRelative = (pathStr: string) => {
    let newPath = slash(pathStr.replace(app.paths.root, ''));
    if (newPath.startsWith('/')) {
      newPath = newPath.substr(1);
    }
    return newPath;
  };

  if (libraryTargets.includes('umd')) {
    const outDir = path.join(app.paths.build, 'umd');
    buildResult.umd = makePathRootRelative(path.join(outDir, 'index.js'));
    const umdConfig: RollupOptions = {
      input: entryPath,
      external: createExternalFn(umdExternal),
      output: {
        name: camalize(app.name),
        dir: outDir,
        format: 'umd',
        sourcemap: true,
        exports: 'named',
        // Is this ok?
        inlineDynamicImports: true,
      },
      plugins: commonPlugins,
    };
    rollupConfig.push(umdConfig);
  }

  if (libraryTargets.includes('commonjs')) {
    const outDir = path.join(app.paths.build, 'cjs');
    buildResult.cjs = makePathRootRelative(path.join(outDir, 'index.js'));
    const commonJsConfig: RollupOptions = {
      input: entryPath,
      external: createExternalFn(external),
      output: [
        {
          dir: outDir,
          format: 'cjs',
          exports: 'named',
          sourcemap: true,
        },
      ],
      plugins: commonPlugins,
    };
    rollupConfig.push(commonJsConfig);
  }

  if (libraryTargets.includes('esm')) {
    const outDir = path.join(app.paths.build, 'esm');
    buildResult.esm = makePathRootRelative(path.join(outDir, 'index.js'));
    const esmConfig: RollupOptions = {
      input: entryPath,
      external: createExternalFn(external),
      output: [
        {
          dir: outDir,
          format: 'es',
          exports: 'named',
          sourcemap: true,
        },
      ],
      plugins: commonPlugins,
    };
    rollupConfig.push(esmConfig);
  }

  for (const config of rollupConfig) {
    const buildResult = await rollup(config);
    if (config.output) {
      const outputs = Array.isArray(config.output)
        ? config.output
        : [config.output];
      await Promise.all(outputs.map(buildResult.write));
    }
  }

  process.chdir(workingDirBefore);

  return buildResult;
}
