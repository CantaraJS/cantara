import getGlobalConfig from '../../config';
import execCmd from '../../util/exec';
import path = require('path');

export default function startServerlessEndpointDevelopmentServer() {
  const {
    runtime: {
      currentCommand: { app: activeApp },
    },
  } = getGlobalConfig();
  const serverlessCmd = `serverless offline start --stage dev --dontPrintOutput --webpack-no-watch --skipCacheInvalidation`;
  const nodemonCmd = `nodemon --exec "${serverlessCmd}" --watch ${activeApp.paths.root} --ext js,ts,json,graphql`;
  execCmd(nodemonCmd, {
    workingDirectory: activeApp.paths.root,
    redirectIo: true,
  });
}
