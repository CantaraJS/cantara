import webpack from "webpack";

interface GetSourceMapLoaderOptions {
    sourceMaps?: boolean | string[]
}

export default function getSourceMapLoader({sourceMaps}:GetSourceMapLoaderOptions): webpack.RuleSetRule[] {

    if(!sourceMaps) {
        return [];
    }

    return [ {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
        include: typeof sourceMaps === 'boolean' ? undefined: sourceMaps
      } ]
}