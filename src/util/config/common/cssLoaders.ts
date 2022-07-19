const MiniCssExtractPlugin = require('mini-css-extract-plugin');

interface GetCssLoadersOptions {
  /** If true, use MiniCssExtractPlugin, otherwise style-loader */
  useExtractLoader: boolean;
  pathToTailwindCss?: string;
}

export default function getCssLoaders({
  useExtractLoader,
  pathToTailwindCss,
}: GetCssLoadersOptions) {
  const postCssPlugins: { [key: string]: any } = {
    'postcss-preset-env': {},
    // autoprefixer: {},
  };

  if (pathToTailwindCss) {
    postCssPlugins[pathToTailwindCss] = {};
  }

  const cssLoaders = (modules: boolean, extractCss: boolean) => [
    ...(extractCss
      ? [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
              // modules: {
              //   namedExport: true,
              // },
            },
          },
        ]
      : [
          {
            loader: 'style-loader',
            // options: {
            //   modules: {
            //     namedExport: true,
            //   },
            // },
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
          plugins: postCssPlugins,
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
