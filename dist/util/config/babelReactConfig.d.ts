export default function getBabelReactConfig(mode: 'development' | 'production'): {
    presets: string[];
    plugins: (string | undefined)[];
};
