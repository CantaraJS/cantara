import { getChangedAppNames } from '../../util/lerna';
import execCmd from '../../util/exec';
import getGlobalConfig from '../../cantara-config/global-config';

interface BuildChangedParams {
  projectDir: string;
  exclude?: string[];
}

export default async function buildChanged({
  projectDir,
  exclude = [],
}: BuildChangedParams) {
  const { allApps } = getGlobalConfig();

  const changedApps = await getChangedAppNames(
    projectDir,
    allApps.map((app) => app.name),
  );
  for (const app of changedApps) {
    const foundApp = allApps.find((currApp) => currApp.name === app.name);
    if (
      foundApp &&
      (foundApp.type === 'serverless' || exclude.includes(foundApp.name))
    ) {
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
