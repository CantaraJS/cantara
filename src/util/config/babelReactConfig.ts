export default function getBabelReactConfig(
  mode: 'development' | 'production',
) {
  return {
    presets: ['@babel/react', '@babel/typescript'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      mode === 'development' ? 'react-refresh/babel' : undefined,
    ].filter(Boolean),
  };
}
