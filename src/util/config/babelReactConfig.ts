export function getBabelReactConfig(mode: 'development' | 'production') {
  return {
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
      '@babel/typescript',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      mode === 'development' ? 'react-refresh/babel' : undefined,
    ].filter(Boolean),
  };
}

// So it can be used as input for babel cli
// Since this is only relevant for packages we can always use 'production'
const reactConfig = getBabelReactConfig('production');
export default reactConfig;
