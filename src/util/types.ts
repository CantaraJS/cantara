export type CantaraApplicationType =
  | 'react'
  | 'node'
  | 'js-package'
  | 'react-component'
  | 'serverless';

export interface CantaraApplication {
  name: string;
  paths: {
    src: string;
    build: string;
    root: string;
    assets?: string;
  };
  type: CantaraApplicationType;
  meta: {
    displayName: string;
    /** Used for manifest */
    themeColor?: string;
    /** Object to override/add to config of WebpackPwaManifest plugin */
    pwaManifest?: any;
  };
}
