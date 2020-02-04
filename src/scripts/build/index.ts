import buildNodeApp from './node';
import buildReactApp from './react';
import buildPackage from './packages';
import { getActiveApp } from '../../cantara-config';

/** Creates a production build
 * of the currently active app/package */
export default async function buildActiveApp() {
  const activeApp = getActiveApp();

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
