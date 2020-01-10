import { CantaraApplication } from '../types';

export interface CreateWebpackConfigParams {
  app: CantaraApplication;
  /** Root of user's project */
  projectDir: string;
  alias?: { [key: string]: string };
  include?: string[];
  mode?: 'production' | 'development';
  libraryTarget?: 'commonjs2' | 'umd';
  /** Set this to true if you want to skip type checks and
   * other things which should just be executed once.
   * Set to true if you need to compile multiple
   * bundles one after another.
   * Only set to false for last compilation.
   */
  noChecks?: boolean;
}
