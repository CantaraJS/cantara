import c from 'ansi-colors';

import getGlobalConfig from '../../../cantara-config/global-config';
import { readCantaraPersistentData } from '../../../util/persistence';

interface LiveLinkAddParams {
  projectDir: string;
}

export default async function liveLinkList({ projectDir }: LiveLinkAddParams) {
  const {
    internalPaths: { temp: tempFolder },
    liveLinkSuggestions,
  } = getGlobalConfig();

  const persistanceData = readCantaraPersistentData(tempFolder);
  if (!persistanceData) return;
  const projectPersistanceData = persistanceData.projects.find(
    (project) => project.rootPath === projectDir,
  );
  if (!projectPersistanceData) return;

  if (projectPersistanceData.linkedPackages.length === 0) {
    console.log(`
      ${c.bgWhite.black('No active Live Link packages!')}
    `);
    return;
  }

  const allPackages = projectPersistanceData.linkedPackages.join('\n\t  ');
  console.log(`
    ${c.cyan('Currently Live Linked packages')}
    ------------------------------

    ${c.bgWhite.black(allPackages)}

    ------------------------------
  `);
}
