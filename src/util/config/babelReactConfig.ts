export default function getBabelReactConfig(
  mode: 'development' | 'production',
) {
  return {
    presets: ['@babel/react', '@babel/typescript'],
    plugins: [
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      mode === 'development' ? 'react-refresh/babel' : undefined,
    ].filter(Boolean),
  };
}
