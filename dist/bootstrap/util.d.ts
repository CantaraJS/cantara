import { CantaraApplication } from '../util/types';
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
interface CreateJestConfigOptions {
    app: CantaraApplication;
    configTemplateFileName: string;
    setupScriptImports?: string[];
}
export declare function createJestConfig({ app, configTemplateFileName, setupScriptImports, }: CreateJestConfigOptions): void;
export declare function createNodeJestConfig(app: CantaraApplication): void;
export declare function createReactJestConfig(app: CantaraApplication): void;
/** Takes all env vars defined
 * for the current stage and writes them
 * to 'static/.temp/.env.json'
 * so that parts of the application
 * which don't have access to the runtime
 * can read them, e.g. the Jest setup file
 * in the user's project
 */
export declare function createTempEnvJsonFile(): void;
export {};
