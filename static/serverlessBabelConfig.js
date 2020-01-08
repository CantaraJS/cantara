/** Serverless webpack will try to load babel/it's plugins from the local node_modules folder.
 * That's why we need to import all packages with their respective absolute path.
 * The string "C:/Users/maxim/DEV/cantara/node_modules/" will be replaces with Cantara's node_modules folder path.
 */
module.exports = {
  presets: [
    'C:/Users/maxim/DEV/cantara/node_modules/@babel/preset-typescript',
    ['C:/Users/maxim/DEV/cantara/node_modules/@babel/preset-env', { targets: { node: '12.0.0' } }],
  ],
  plugins: [
    'C:/Users/maxim/DEV/cantara/node_modules/babel-plugin-transform-typescript-metadata',
    ['C:/Users/maxim/DEV/cantara/node_modules/@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'C:/Users/maxim/DEV/cantara/node_modules/@babel/plugin-proposal-class-properties',
      { loose: true },
    ],
  ],
};
