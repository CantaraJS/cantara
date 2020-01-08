import WebpackDevServer from 'webpack-dev-server';
import webpack, { Configuration } from 'webpack';
import createReactWebpackDevConfig from './webpack/reactDev.config';
import getGlobalConfig from '../../config';
import clearConsole from '../../util/clearConsole';
import createNodeWebpackDevConfig from './webpack/nodeDev.config';
import { startReactAppDevelopmentServer } from './react';
import { startNodeAppDevelopmentServer } from './node';
import startServerlessEndpointDevelopmentServer from './serverless';

export default function startDevelopmentServer() {
  const {
    runtime: {
      currentCommand: { app: activeApp },
      projectDir,
    },
  } = getGlobalConfig();
  switch (activeApp.type) {
    case 'react':
      startReactAppDevelopmentServer();
      break;
    case 'node':
      startNodeAppDevelopmentServer();
      break;
    case 'serverless':
      startServerlessEndpointDevelopmentServer();
      break;
    default:
      throw new Error(
        `"${activeApp.meta.displayName}" cannot be started in development mode. This is only possible for React Apps, NodeJS Apps and Serverless Endpoints!`,
      );
  }
}
