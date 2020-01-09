import { Configuration } from 'webpack';
import { CreateWebpackConfigParams } from './types';
export default function createReactWebpackConfig({ app, projectDir, alias, include, mode, }: CreateWebpackConfigParams): Configuration;
