interface CreateOrUpdatePackageJSONParams {
    expectedDependencies?: {
        [key: string]: string;
    };
    expectedDevDependencies?: {
        [key: string]: string;
    };
    rootDir: string;
}
/** Updates/installs the specified dependecies in the
 * specified folder. Creates a package.json if none exists.
 */
export declare function createOrUpdatePackageJSON({ rootDir, expectedDependencies, expectedDevDependencies, }: CreateOrUpdatePackageJSONParams): Promise<void>;
export {};
