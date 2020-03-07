"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    presets: [
        '@babel/typescript',
        ['@babel/env', { targets: { node: '12.0.0' } }],
    ],
    plugins: [
        'babel-plugin-transform-typescript-metadata',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
};
