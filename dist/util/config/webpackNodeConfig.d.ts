import { Configuration } from 'webpack';
import { CreateWebpackConfigParams } from './types';
interface CreateNodeWebpackConfigOptions extends CreateWebpackConfigParams {
    nodemonOptions?: string;
}
export default function createNodeWebpackConfig({ app, mode, alias, env, include, nodemonOptions, }: CreateNodeWebpackConfigOptions): Configuration;
export {};
