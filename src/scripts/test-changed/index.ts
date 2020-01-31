import executeForChangedApps from '../exec-changed';

import { prepareCantara } from '../../cli/cli-tools';

import executeTests from '../test';

interface TestChangedParam {
  stage: string;
}

export default function testChanged({ stage }: TestChangedParam) {
  return executeForChangedApps(async appname => {
    await prepareCantara({
      cmdName: 'test',
      additionalCliOptions: '',
      appname,
      stage,
    });
    await executeTests();
  });
}
