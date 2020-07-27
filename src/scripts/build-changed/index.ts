import { getChangedAppNames } from '../../util/lerna';
import execCmd from '../../util/exec';
import getGlobalConfig from '../../cantara-config/global-config';

export default async function buildChanged(projectDir: string) {
  const changedApps = await getChangedAppNames(projectDir);
  const { allApps } = getGlobalConfig();
  for (const app of changedApps) {
    const foundApp = allApps.find(currApp => currApp.name === app.name);
    if (foundApp && foundApp.type === 'serverless') {
      // Serverless can't be built; they need to be deployed directly
      // using the 'deploy' command
      continue;
    }
    await execCmd(`cantara build ${app.name}`, {
      workingDirectory: projectDir,
      redirectIo: true,
    });
  }
}
