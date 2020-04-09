import buildNodeApp from './node';
import buildReactApp from './react';
import buildPackage from './packages';
import getRuntimeConfig from '../../cantara-config/runtime-config';

/** Creates a production build
 * of the currently active app/package */
export default async function buildActiveApp() {
  const {
    currentCommand: { app: activeApp },
  } = getRuntimeConfig();

  if (activeApp.type === 'react') {
    await buildReactApp(activeApp);
  } else if (activeApp.type === 'node') {
    await buildNodeApp(activeApp);
  } else if (
    activeApp.type === 'js-package' ||
    activeApp.type === 'react-component'
  ) {
    await buildPackage(activeApp);
  } else {
    console.log(`Apps of type ${activeApp.type} can't be built.`);
  }
}
