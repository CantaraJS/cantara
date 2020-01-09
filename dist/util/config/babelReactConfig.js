"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBabelReactConfig(mode) {
    return {
        presets: ['@babel/react', '@babel/typescript'],
        plugins: [
            '@babel/proposal-class-properties',
            '@babel/proposal-object-rest-spread',
            mode === 'development' ? 'react-refresh/babel' : undefined,
        ].filter(Boolean),
    };
}
exports.default = getBabelReactConfig;
