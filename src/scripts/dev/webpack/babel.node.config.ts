export default {
  presets: [
    '@babel/preset-typescript',
    ['@babel/env', { targets: { node: '12.0.0' } }],
  ],
  plugins: [
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
};
