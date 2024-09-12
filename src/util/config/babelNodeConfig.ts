export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: '20.0.0' },
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-transform-class-properties', { loose: true }],
  ],
};
