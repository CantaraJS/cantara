import buildNodeApp from './node';
import buildReactApp from './react';
import buildPackage from './packages';
import getGlobalConfig from '../../cantara-config';

/** Creates a production build
 * of the currently active app/package */
export default function buildActiveApp() {
  const {
    runtime: {
      currentCommand: { app: activeApp },
    },
  } = getGlobalConfig();

  if (activeApp.type === 'react') {
    buildReactApp(activeApp);
  }

  if (activeApp.type === 'node') {
    buildNodeApp(activeApp);
  }

  if (activeApp.type === 'js-package' || activeApp.type === 'react-component') {
    buildPackage(activeApp);
  }
}
