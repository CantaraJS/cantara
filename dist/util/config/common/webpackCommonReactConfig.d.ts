import { Configuration } from 'webpack';
import { CreateWebpackConfigParams } from '../types';
interface CreateCommonReactWebpackConfigParams extends CreateWebpackConfigParams {
    /** Set to true for NPM packages */
    alwaysInlineImages?: boolean;
}
export default function createCommonReactWebpackConfig({ mode, app, env, include, alwaysInlineImages, }: CreateCommonReactWebpackConfigParams): Configuration;
export {};
