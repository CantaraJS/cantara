export type CantaraApplicationType =
  | 'react'
  | 'node'
  | 'js-package'
  | 'react-component'
  | 'serverless';

export interface CantaraApplicationMetaInformation {
  displayName: string;
  /** Used for manifest */
  themeColor?: string;
  /** Object to override/add to config of WebpackPwaManifest plugin */
  pwaManifest?: any;
  /** If this is set to true, nodemon is used
   * to manually restart serverless offline
   * after each change. Can be used to avoid
   * reaching the maximum number of DB connection
   * and the need to establish a new DB connection
   * for every new call. Depends on your architecture
   * if you need this.
   */
  skipCacheInvalidation?: boolean;
  libraryTargets?: ('umd' | 'commonjs')[];
  /** Required env vars,
   * either defined in process.env or
   * in the current environment's env file
   */
  env?: string[];
}

export interface CantaraApplication {
  name: string;
  paths: {
    src: string;
    build: string;
    root: string;
    static?: string;
    assets?: string;
  };
  /** Environment variables loaded from
   * either a .env.<stage> file or process.env
   */
  env?: { [key: string]: string };
  type: CantaraApplicationType;
  meta: CantaraApplicationMetaInformation;
}
