import { Configuration } from 'webpack';
import { CreateWebpackConfigParams } from './types';
export default function createNodeWebpackConfig({ app, projectDir, mode, alias, env, }: CreateWebpackConfigParams): Configuration;
