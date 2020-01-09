interface CreateOrUpdatePackageJSONParams {
    expectedDependencies: {
        [key: string]: string;
    };
    rootDir: string;
}
/** Updates/installs the specified dependecies in the
 * specified folder. Creates a package.json if none exists.
 */
export declare function createOrUpdatePackageJSON({ rootDir, expectedDependencies, }: CreateOrUpdatePackageJSONParams): Promise<void>;
interface RenderTemplateOptions {
    template: string;
    variables: {
        [key: string]: string | number | boolean;
    };
}
/** Takes a template and variables in the form of "<--VARIABLE_NAME-->" and replaces
 * all variables with the values passed */
export declare function renderTemplate({ template, variables }: RenderTemplateOptions): string;
export {};
