interface CreateNewAppOrPackageOptions {
    type: 'react-app' | 'node-app' | 'serverless' | 'package' | 'react-component' | 'react-cmp';
    name: string;
    /** Root of user's project */
    projectDir: string;
    staticFolderPath: string;
}
export default function createNewAppOrPackage({ type, name, staticFolderPath, projectDir, }: CreateNewAppOrPackageOptions): Promise<void>;
export {};
