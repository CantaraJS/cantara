import { CreateWebpackConfigParams } from './types';
import { Configuration } from 'webpack';
interface GetLibraryExternalsOptions {
    packageJsonPath: string;
    peerOnly?: boolean;
}
export declare function getLibraryExternals({ packageJsonPath, peerOnly, }: GetLibraryExternalsOptions): string[];
/**
 * Build React, isomorphic, node or browser libraries
 */
export default function createLibraryWebpackConfig({ app, projectDir, include, alias, libraryTarget, noChecks, }: CreateWebpackConfigParams): Configuration;
export {};
