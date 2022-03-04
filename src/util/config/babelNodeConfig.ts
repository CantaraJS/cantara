export default {
  presets: [
    '@babel/typescript',
    ['@babel/env', { targets: { node: '14.0.0' } }],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-class-properties'],
  ],
};
