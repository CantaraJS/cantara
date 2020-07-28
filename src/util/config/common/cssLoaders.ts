const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');

interface GetCssLoadersOptions {
  /** If true, use MiniCssExtractPlugin, otherwise style-loader */
  useExtractLoader: boolean;
}

export default function getCssLoaders({
  useExtractLoader,
}: GetCssLoadersOptions) {
  const cssLoaders = (modules: boolean, extractCss: boolean) => [
    ...(extractCss ? [MiniCssExtractPlugin.loader] : ['style-loader']),
    {
      loader: 'css-loader',
      options: modules
        ? {
            modules: {
              localIdentName: '[name]--[hash:base64:5]',
              exportLocalsConvention: 'camelCase',
            },
            importLoaders: 1,
          }
        : {},
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [postcssPresetEnv()],
      },
    },
  ];

  return [
    {
      test: /\.css$/,
      include: /\.module\.css$/,
      use: cssLoaders(true, useExtractLoader),
    },
    {
      test: /\.css$/,
      exclude: /\.module\.css$/,
      use: cssLoaders(false, useExtractLoader),
    },
  ];
}
