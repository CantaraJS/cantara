import { startReactAppDevelopmentServer } from './react';
import { startNodeAppDevelopmentServer } from './node';
import startServerlessEndpointDevelopmentServer from './serverless';
import getRuntimeConfig from '../../cantara-config/runtime-config';

export default function startDevelopmentServer() {
  const {
    currentCommand: { app: activeApp },
  } = getRuntimeConfig();
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
