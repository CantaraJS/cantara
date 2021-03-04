import { CantaraApplication } from '../types';

type LibraryTarget = 'commonjs' | 'umd' | 'esm';

export interface BundlerConfigParams {
  app: CantaraApplication;
  /** Root of user's project */
  projectDir: string;
  alias?: { [key: string]: string };
  include?: string[];
  mode?: 'production' | 'development';
  libraryTarget?: LibraryTarget;
  /** Set this to true if you want to skip type checks and
   * other things which should just be executed once.
   * Set to true if you need to compile multiple
   * bundles one after another.
   * Only set to false for last compilation.
   */
  noChecks?: boolean;
  /** Environment variables which are replaced
   * in the bundle
   */
  env?: { [key: string]: string };
  resolveModules?: string[];
}
