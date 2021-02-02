import getGlobalConfig from '../../../cantara-config/global-config';
import {
  getProjectPersistentData,
  writeProjectPersistenData,
} from '../../../util/persistence';

interface LiveLinkAddParams {
  liveLinkPackagePath: string;
  projectDir: string;
}

export default async function liveLinkRemove({
  liveLinkPackagePath,
  projectDir,
}: LiveLinkAddParams) {
  const {
    internalPaths: { temp: tempFolder },
  } = getGlobalConfig();

  const projectPersistanceData = await getProjectPersistentData({
    tempFolder,
    rootPath: projectDir,
  });

  if (!projectPersistanceData) return;

  await writeProjectPersistenData({
    tempFolder,
    data: {
      ...projectPersistanceData,
      linkedPackages: projectPersistanceData.linkedPackages.filter(
        (p) => p !== liveLinkPackagePath,
      ),
    },
  });
}
