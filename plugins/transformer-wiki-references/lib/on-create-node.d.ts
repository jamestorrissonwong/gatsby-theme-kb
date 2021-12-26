import { CreateNodeArgs } from 'gatsby';
import { PluginOptions } from './options';
export declare const onCreateNode: ({ cache, node, loadNodeContent, getNode }: CreateNodeArgs, _options?: PluginOptions) => Promise<void>;
