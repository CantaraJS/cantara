import { Configuration } from 'webpack';
import { CreateWebpackConfigParams } from './types';
/**
 * Build React, isomorphic, node or browser libraries
 */
export default function createLibraryWebpackConfig({ app, projectDir, include, alias, libraryTarget, noChecks, env, }: CreateWebpackConfigParams): Configuration;
