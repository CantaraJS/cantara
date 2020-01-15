import { CantaraApplication } from '../util/types';
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
