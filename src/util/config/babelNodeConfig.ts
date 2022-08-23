export default {
  presets: [
    ['@babel/env', { targets: { node: '14.0.0' } }],
    '@babel/typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-class-properties'],
  ],
};
