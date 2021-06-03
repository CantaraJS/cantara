import webpack from 'webpack';

interface GetSourceMapLoaderOptions {
  sourceMaps?: boolean | string[];
}

export default function getSourceMapLoader({
  sourceMaps,
}: GetSourceMapLoaderOptions): webpack.RuleSetRule[] {
  if (!sourceMaps) {
    return [];
  }

  return [
    {
      test: [/\.js$/, /\.jsx$/, /\.ts$/, /\.tsx$/],
      use: ['source-map-loader'],
      enforce: 'pre',
      exclude: /node_modules/,
      include: typeof sourceMaps === 'boolean' ? undefined : sourceMaps,
    },
  ];
}
