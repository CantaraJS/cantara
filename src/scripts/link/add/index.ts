import getGlobalConfig from '../../../cantara-config/global-config';
import { writeProjectPersistenData } from '../../../util/persistence';

interface LiveLinkAddParams {
  liveLinkPackagePath: string;
  projectDir: string;
}

export default async function liveLinkAdd({
  liveLinkPackagePath,
  projectDir,
}: LiveLinkAddParams) {
  const {
    internalPaths: { temp: tempFolder },
  } = getGlobalConfig();

  await writeProjectPersistenData({
    tempFolder,
    data: {
      rootPath: projectDir,
      linkedPackages: [liveLinkPackagePath],
    },
  });
}
