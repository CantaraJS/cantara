import { CantaraApplication } from '../util/types';
/** Returns all aliases for packages in the form
 * { 'package-name': 'path/to/package/index.tx }.
 */
export default function getAllPackageAliases(allApps: CantaraApplication[]): {
    [key: string]: string;
};
