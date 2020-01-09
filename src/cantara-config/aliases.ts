import slash from 'slash';
import { CantaraApplication } from '../util/types';

/** Returns all aliases for packages in the form
 * { 'package-name': 'path/to/package/index.tx }.
 */
export default function getAllPackageAliases(
  allApps: CantaraApplication[],
): { [key: string]: string } {
  const aliases = allApps
    .filter(app => app.type === 'js-package' || app.type === 'react-component')
    .reduce((aliasesObj, currentApp) => {
      return {
        ...aliasesObj,
        [currentApp.name]: slash(currentApp.paths.src),
      };
    }, {});
  return aliases;
}
