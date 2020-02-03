import { Configuration } from 'webpack';
import { CreateWebpackConfigParams } from './types';
export default function createReactWebpackConfig({ app, alias, mode, env, include, projectDir, }: CreateWebpackConfigParams): Configuration;
