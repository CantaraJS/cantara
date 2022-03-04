import execCmd from '../../util/exec';
import getRuntimeConfig from '../../cantara-config/runtime-config';

export default function startServerlessEndpointDevelopmentServer() {
  const {
    currentCommand: { app: activeApp },
  } = getRuntimeConfig();
  const { skipCacheInvalidation } = activeApp.meta;
  const serverlessParametersToAdd = skipCacheInvalidation
    ? '--webpack-no-watch --skipCacheInvalidation'
    : '';
  const serverlessCmd = `serverless offline start --stage dev ${serverlessParametersToAdd}`;
  const nodemonCmd = `nodemon --exec "${serverlessCmd}" --watch ${activeApp.paths.root} --ext js,ts,json,graphql`;

  const cmdToExecute = skipCacheInvalidation ? nodemonCmd : serverlessCmd;
  execCmd(cmdToExecute, {
    workingDirectory: activeApp.paths.root,
    redirectIo: true,
  });
}
