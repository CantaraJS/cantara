export type CantaraApplicationType =
  | 'react'
  | 'node'
  | 'js-package'
  | 'react-component'
  | 'serverless';

export interface CantaraApplicationMetaInformation {
  /**
   * webpack dev server configurations
   */
  devServer?: {
    port?: number;
  };
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
  /**
   * If set to true, no types will
   * be generated. Only applies to
   * packages.
   */
  skipTypeGeneration?: boolean;
  /**
   * List of TS errors to suppress when
   * generating types for packages.
   */
  suppressTsErrors?: string[];
  /**
   * If set to true source maps are generated for production
   * and cantara will try to load source maps of all dependencies as well.
   * By specifing an array of paths, one can narrow down,
   * which dependencies cantara will consider.
   */
  sourceMaps?: true | string[];
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
  type: CantaraApplicationType;
  meta: CantaraApplicationMetaInformation;
}
