export default function getBabelReactConfig(
  mode: 'development' | 'production',
) {
  return {
    presets: ['@babel/react', '@babel/typescript'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      mode === 'development' ? 'react-refresh/babel' : undefined,
    ].filter(Boolean),
  };
}
