import getGlobalConfig from '../../cantara-config';
import execCmd from '../../util/exec';

export default function startServerlessEndpointDevelopmentServer() {
  const {
    runtime: {
      currentCommand: { app: activeApp },
    },
  } = getGlobalConfig();
  const { skipCacheInvalidation } = activeApp.meta;
  const serverlessParametersToAdd = skipCacheInvalidation
    ? '--webpack-no-watch --skipCacheInvalidation'
    : '';
  const serverlessCmd = `serverless offline start --stage dev --dontPrintOutput ${serverlessParametersToAdd}`;
  const nodemonCmd = `nodemon --exec "${serverlessCmd}" --watch ${activeApp.paths.root} --ext js,ts,json,graphql`;

  const cmdToExecute = skipCacheInvalidation ? nodemonCmd : serverlessCmd;
  execCmd(cmdToExecute, {
    workingDirectory: activeApp.paths.root,
    redirectIo: true,
  });
}
