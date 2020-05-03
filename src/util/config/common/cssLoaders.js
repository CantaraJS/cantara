"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
function getCssLoaders({ useExtractLoader, }) {
    const cssLoaders = (modules, extractCss) => [
        ...(extractCss ? [MiniCssExtractPlugin.loader] : ['style-loader']),
        {
            loader: 'css-loader',
            options: modules
                ? {
                    modules: {
                        localIdentName: '[name]--[hash:base64:5]',
                    },
                    localsConvention: 'camelCase',
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
exports.default = getCssLoaders;
