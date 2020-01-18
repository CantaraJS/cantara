import { CantaraApplication } from '../util/types';
/**
 * Get all dependencies of the current app
    and create an alias for them to make sure
    that when a package uses the same dependency,
    it uses the dependecy from the app's
    node_modules folder. Some libs require
    that there's only one instance present,
    e.g. React, styled-components, ...
 */
export declare function getDependencyAliases(app: CantaraApplication): {};
interface GetAllPackageAliasesOptions {
    allApps: CantaraApplication[];
    activeApp: CantaraApplication;
}
/** Returns all aliases for packages in the form
 * { 'package-name': 'path/to/package/index.tx }.
 */
export default function getAllPackageAliases({ allApps, activeApp, }: GetAllPackageAliasesOptions): {
    [key: string]: string;
};
export {};
