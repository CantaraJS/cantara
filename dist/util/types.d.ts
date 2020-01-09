export declare type CantaraApplicationType = 'react' | 'node' | 'js-package' | 'react-component' | 'serverless';
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
        /** If this is set to true, nodemon is used
         * to manually restart serverless offline
         * after each change. Can be used to avoid
         * reaching the maximum number of DB connection
         * and the need to establish a new DB connection
         * for every new call. Depends on your architecture
         * if you need this.
         */
        skipCacheInvalidation?: boolean;
    };
}
