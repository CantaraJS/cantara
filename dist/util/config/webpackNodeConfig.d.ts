import { Configuration } from 'webpack';
import { CreateWebpackConfigParams } from './types';
export default function createNodeWebpackConfig({ app, mode, alias, env, include, }: CreateWebpackConfigParams): Configuration;
