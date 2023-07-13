import { RollupOptions, rollup } from 'rollup';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

//@ts-ignore
import replace from '@rollup/plugin-replace';

//@ts-expect-error
import { string } from 'rollup-plugin-string';
import alias from '@rollup/plugin-alias';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
// Removed
import dynamicImportVars from 'rollup-plugin-dynamic-import-vars-for-grown-ups';
import url from '@rollup/plugin-url';
import postcss from 'rollup-plugin-postcss';
//@ts-expect-error
import postCssPresetEnv from 'postcss-preset-env';

import { BundlerConfigParams } from './types';
import { externalsAsStringArray } from '../externals';
import path from 'path';
import { getBabelReactConfig } from './babelReactConfig';
import slash from 'slash';

import { visualizer } from 'rollup-plugin-visualizer';

const postcssUrl = require('postcss-url');

const postcssUrlPlugin = postcssUrl({
  url: 'inline',
  maxSize: Number.MAX_VALUE,
});

/**
 * Create a package production
 * build using the Rollup bundler.
 */
export default async function buildPackageWithRollup({
  alias: buildAliases = {},
  env = {},
  libraryTarget,
  app,
  sourceMaps,
  enableBundleAnalyzer,
}: BundlerConfigParams): Promise<string> {
  // This path just acts as a result of this process
  let relativeEntryPath: string = '';

  // It could be that when using local aliases to other packages
  // that this fails. TODO: Try that out
  const include = ['src/**/*'];

  const isReactComponent = app.type === 'react-component';
  const babelConfig = getBabelReactConfig('production', {
    projectDir: app.paths.root,
  });

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

  if (libraryTarget === 'esm' || libraryTarget === 'commonjs') {
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
    replace({
      values: { 'process.env.NODE_ENV': JSON.stringify('production') },
      preventAssignment: true,
    }),

    resolve({ extensions }), // so Rollup can find commonjs deps
    commonjs(), // so Rollup can convert commonjs deps to ES modules
    postcss({
      namedExports: true,
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: '[local]-[hash:base64:5]',
        // Include css globally for all non-css modules
        globalModulePaths: [/^((?!module).)*$/],
      },
      plugins: [postCssPresetEnv, postcssUrlPlugin],
      include,
    }),
    string({
      include: /\.html?$/,
      exclude: [/node_modules/],
    }),
    alias({
      entries: buildAliases,
    }),
    injectProcessEnv(env),
    babel({
      ...babelConfig,
      babelHelpers: 'runtime',
      include,
      extensions,
    }),
    url({
      exclude: [/\.(js|jsx|ts|tsx|mjs)$/, /\.html?$/, /\.json$/],
      limit: Number.MAX_VALUE,
      include: [
        '**/*.svg',
        '**/*.png',
        '**/*.jp(e)?g',
        '**/*.gif',
        '**/*.webp',
        '**/*.wav',
      ],
    }),
    dynamicImportVars({ include }),
  ];

  if (enableBundleAnalyzer) {
    commonPlugins.push(
      visualizer({
        open: true,
        title: `${app.name} (Rollup: ${libraryTarget})`,
      }),
    );
  }

  let rollupConfig: RollupOptions = {};

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

  if (libraryTarget === 'commonjs') {
    const outDir = path.join(app.paths.build, 'cjs');
    relativeEntryPath = makePathRootRelative(path.join(outDir, 'index.js'));
    const commonJsConfig: RollupOptions = {
      input: entryPath,
      external: createExternalFn(external),
      output: [
        {
          dir: outDir,
          format: 'cjs',
          exports: 'named',
          sourcemap: sourceMaps,
        },
      ],
      plugins: commonPlugins,
    };
    rollupConfig = commonJsConfig;
  }

  if (libraryTarget === 'esm') {
    const outDir = path.join(app.paths.build, 'esm');
    relativeEntryPath = makePathRootRelative(path.join(outDir, 'index.js'));
    const esmConfig: RollupOptions = {
      input: entryPath,
      external: createExternalFn(external),
      output: [
        {
          dir: outDir,
          format: 'es',
          exports: 'named',
          sourcemap: sourceMaps,
        },
      ],
      plugins: commonPlugins,
    };
    rollupConfig = esmConfig;
  }

  const bundle = await rollup(rollupConfig);
  if (rollupConfig.output) {
    const outputs = Array.isArray(rollupConfig.output)
      ? rollupConfig.output
      : [rollupConfig.output];
    await Promise.all(outputs.map(bundle.write));
  }

  process.chdir(workingDirBefore);

  return relativeEntryPath;
}
