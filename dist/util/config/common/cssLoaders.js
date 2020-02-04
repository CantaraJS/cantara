"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var postcssPresetEnv = require('postcss-preset-env');
function getCssLoaders(_a) {
    var useExtractLoader = _a.useExtractLoader;
    var cssLoaders = function (modules, extractCss) { return __spreadArrays((extractCss ? [MiniCssExtractPlugin.loader] : ['style-loader']), [
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
                plugins: function () { return [postcssPresetEnv()]; },
            },
        },
    ]); };
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
