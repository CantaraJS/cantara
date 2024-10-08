interface Options {
  i18n?: any;
  projectDir: string;
}

export function getBabelReactConfig(
  mode: 'development' | 'production',
  { i18n, projectDir }: Options,
) {
  return {
    presets: [
      [
        require('@babel/preset-react'),
        {
          runtime: 'automatic',
        },
      ],
      [
        require('@babel/preset-env'),
        {
          useBuiltIns: 'entry',
          configPath: projectDir,
          corejs: 2,
        },
      ],
      require('@babel/preset-typescript'),
    ],
    plugins: [
      require('@babel/plugin-transform-runtime'),
      ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
      'babel-plugin-transform-typescript-metadata',
      '@babel/plugin-transform-class-properties',
      mode === 'development' ? 'react-refresh/babel' : undefined,
      mode === 'development' && i18n
        ? [require('babel-plugin-i18next-extract'), i18n]
        : undefined,
    ].filter(Boolean) as string[],
    assumptions: {
      setPublicClassFields: false,
    },
  };
}

// So it can be used as input for babel cli
// Since this is only relevant for packages we can always use 'production'
// const reactConfig = getBabelReactConfig('production');
// export default reactConfig;
