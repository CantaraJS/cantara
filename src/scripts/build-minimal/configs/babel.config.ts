export default {
  presets: [
    [
      require('@babel/preset-react'),
      {
        runtime: 'automatic',
      },
    ],
    require('@babel/preset-typescript'),
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 2,
      },
    ],
  ],
  plugins: [require('@babel/plugin-transform-runtime')],
};
