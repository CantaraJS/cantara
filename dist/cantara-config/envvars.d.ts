interface LoadAppEnvVarsOptions {
    appRootDir: string;
    /** Can be specified in app's cantara.config.js */
    expectedEnvVars: string[];
    currentStage: string;
    /** if envvar is not defined in currenStage,
     * this function looks if it is defined
     * in the fallbackStage
     */
    fallbackStage?: string;
    /** Set this to true if an error should
     * be thrown if a variable defined
     * in expectedEnvVars is no presetn
     */
    required?: boolean;
}
/**
 * Loads env vars from either the current
 * stage's env file (.env.<stage>) or, if
 * not defined, from process.env.STAGENAME_*.
 * If neither of both is defined,
 * you can define a fallback stage. If that
 * is set, the envvars of thats stage
 * are used if defined.
 * If an env var in the array expectedEnvVars
 * is not defined, an error is thrown.
 * Additional env vars in the .env file
 * are ignored and a warning is shown.
 * The resulting object can later on
 * be used by the WebpackDefinePlugin.
 *
 * Example:
 * Assume the envvar DB_CONNECTION_STR is required
 * and you want to compile and deploy the project
 * (e.g. CI server).
 * You can either define it in the environment
 * by setting process.env.PRODUCTION_DB_CONNECTION_STR
 * or by genereating the file .env.production with
 * DB_CONNECTION_STR defined in it at runtime.
 * Prefixing the envvars prevents you from accidently
 * using the wrong envvars.
 */
export default function loadAppEnvVars({ appRootDir, currentStage, expectedEnvVars, fallbackStage, required, }: LoadAppEnvVarsOptions): {
    [key: string]: string;
};
export {};
