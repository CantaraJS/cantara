interface GetCssLoadersOptions {
    /** If true, use MiniCssExtractPlugin, otherwise style-loader */
    useExtractLoader: boolean;
}
export default function getCssLoaders({ useExtractLoader, }: GetCssLoadersOptions): ({
    test: RegExp;
    include: RegExp;
    use: any[];
    exclude?: undefined;
} | {
    test: RegExp;
    exclude: RegExp;
    use: any[];
    include?: undefined;
})[];
export {};
