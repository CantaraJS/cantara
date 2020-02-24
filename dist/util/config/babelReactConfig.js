"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBabelReactConfig(mode) {
    return {
        presets: ['@babel/react', '@babel/typescript'],
        plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-optional-chaining',
            mode === 'development' ? 'react-refresh/babel' : undefined,
        ].filter(Boolean),
    };
}
exports.default = getBabelReactConfig;
