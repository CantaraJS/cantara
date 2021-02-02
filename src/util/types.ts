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
   * in the current environment's env file.
   * By default the env var is required, by setting
   * optional = true, the env var does not have to be defined
   * at build time.
   * Instead via the env file, the value can also be set directly
   */
  env?: (string | { var: string; optional?: boolean; value?: boolean })[];
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
   * If set to true source maps are generated for production as well.
   */
  sourceMaps?: boolean;
  /**
   * Define external dependencies mapping for webpack.
   * Can be configured for either of the build targets.
   */
  externalDependencies?: {
    umd?: {
      [key: string]: string;
    };
    commonjs?: {
      [key: string]: string;
    };
  };
  /**
   * Optionally, the default folder location
   * of an application ('/static')
   * can be overwritten.
   * always relative to the current app.
   */
  staticFolder?: string;
  /**
   * Folders or files which contain
   * custom types.
   * always relative to the current app.
   */
  customTypes?: string[];
  /**
   * If Set to true, the commonjs target will not be bundled.
   */
  skipBundling?: boolean;
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

/**
 * Package which could be live linked
 */
export interface LiveLinkedPackageSuggestion {
  projectRoot: string;
  packageRoot: string;
  /**
   * Name in package.json
   */
  packageName: string;
}

export interface CantaraProjectPersistenceData {
  rootPath: string;
  linkedPackages: string[];
}

/**
 * Saves temporary data about
 * all Cantara projects on disk.
 * This way, we always know which
 * Cantara projects are installed
 * and where
 */
export interface CantaraPersistenceData {
  projects: CantaraProjectPersistenceData[];
}
