const MiniCssExtractPlugin = require('mini-css-extract-plugin');

interface GetCssLoadersOptions {
  /** If true, use MiniCssExtractPlugin, otherwise style-loader */
  useExtractLoader: boolean;
}

export default function getCssLoaders({
  useExtractLoader,
}: GetCssLoadersOptions) {
  const cssLoaders = (modules: boolean, extractCss: boolean) => [
    ...(extractCss
      ? [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
              modules: {
                namedExport: true,
              },
            },
          },
        ]
      : [
          {
            loader: 'style-loader',
            options: {
              esModule: true,
              modules: {
                namedExport: true,
              },
            },
          },
        ]),
    {
      loader: 'css-loader',
      options: modules
        ? {
            modules: {
              localIdentName: '[name]--[hash:base64:5]',
              exportLocalsConvention: 'camelCaseOnly',
              namedExport: true,
            },
            esModule: true,
          }
        : {},
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env'],
        },
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
