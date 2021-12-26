import { CreateSchemaCustomizationArgs, SetFieldsOnGraphQLNodeTypeArgs, Node } from 'gatsby';
import { PluginOptions } from './options';
import { NodeReference } from './type';
export declare const createSchemaCustomization: ({ actions }: CreateSchemaCustomizationArgs, _options?: PluginOptions) => void;
export declare const setFieldsOnGraphQLNodeType: ({ cache, type, getNode }: SetFieldsOnGraphQLNodeTypeArgs, _options?: PluginOptions) => {
    outboundReferences?: undefined;
    inboundReferences?: undefined;
} | {
    outboundReferences: {
        type: string;
        resolve: (node: Node) => Promise<NodeReference[]>;
    };
    inboundReferences: {
        type: string;
        resolve: (node: Node) => Promise<NodeReference[]>;
    };
};
