import { CreateWebpackConfigParams } from './types';
import { Configuration } from 'webpack';
/**
 * Build React, isomorphic, node or browser libraries
 */
export default function createLibraryWebpackConfig({ app, projectDir, include, alias, libraryTarget, noChecks, }: CreateWebpackConfigParams): Configuration;
