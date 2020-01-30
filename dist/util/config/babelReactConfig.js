"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBabelReactConfig(mode) {
    return {
        presets: ['@babel/react', '@babel/typescript'],
        plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread',
            mode === 'development' ? 'react-refresh/babel' : undefined,
        ].filter(Boolean),
    };
}
exports.default = getBabelReactConfig;
