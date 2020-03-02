import executeForChangedApps from '../exec-changed';

import { prepareCantara } from '../../cli/cli-tools';

import buildActiveApp from '../build';

interface BuildChangedParam {
  stage: string;
}

export default function buildChanged({ stage }: BuildChangedParam) {
  return executeForChangedApps(async appname => {
    console.log('changed', { appname });
    await prepareCantara({
      cmdName: 'build',
      additionalCliOptions: '',
      appname,
      stage,
    });
    await buildActiveApp();
  });
}
