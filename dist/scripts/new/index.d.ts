interface CreateNewOptions {
    name: string;
}
interface CreateNewAppOrPackageOptions extends CreateNewOptions {
    type: 'react-app' | 'node-app' | 'serverless' | 'js-package' | 'react-component' | 'react-cmp';
}
export default function createNewAppOrPackage({ type, name, }: CreateNewAppOrPackageOptions): Promise<void>;
export {};
