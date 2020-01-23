interface CreateNewOptions {
    name: string;
    /** Root of user's project */
    projectDir: string;
    staticFolderPath: string;
    tempFolderPath: string;
}
interface CreateNewAppOrPackageOptions extends CreateNewOptions {
    type: 'react-app' | 'node-app' | 'serverless' | 'package' | 'react-component' | 'react-cmp';
}
export default function createNewAppOrPackage({ type, name, staticFolderPath, tempFolderPath, projectDir, }: CreateNewAppOrPackageOptions): Promise<void>;
export {};
