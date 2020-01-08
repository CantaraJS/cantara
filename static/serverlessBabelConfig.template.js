/** Serverless webpack will try to load babel/it's plugins from the local node_modules folder.
 * That's why we need to import all packages with their respective absolute path.
 * The string "<--MODULES_PATH-->" will be replaces with Cantara's node_modules folder path.
 */
module.exports = {
  presets: [
    '<--MODULES_PATH-->@babel/preset-typescript',
    ['<--MODULES_PATH-->@babel/preset-env', { targets: { node: '12.0.0' } }],
  ],
  plugins: [
    '<--MODULES_PATH-->babel-plugin-transform-typescript-metadata',
    ['<--MODULES_PATH-->@babel/plugin-proposal-decorators', { legacy: true }],
    [
      '<--MODULES_PATH-->@babel/plugin-proposal-class-properties',
      { loose: true },
    ],
  ],
};
