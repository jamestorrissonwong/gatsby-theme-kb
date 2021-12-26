import { Node, GatsbyCache } from 'gatsby';
import { References } from './get-references';
import { NodeReference } from './type';
export declare const cacheDirectory: (cache: any) => string;
export declare type CachedNode = {
    node: Node;
    outboundReferences: References;
    resolvedOutboundReferences?: NodeReference[];
    title: string;
    aliases: string[];
};
export declare type InboundReferences = {
    [id: string]: NodeReference[];
};
export declare const getAllCachedNodes: (cache: GatsbyCache, getNode: Function) => Promise<CachedNode[]>;
export declare const setCachedNode: (cache: GatsbyCache, id: string, data: CachedNode) => Promise<void>;
export declare const getCachedNode: (cache: GatsbyCache, id: string, getNode: Function) => Promise<CachedNode | undefined>;
export declare const setInboundReferences: (cache: any, data: InboundReferences) => Promise<void>;
export declare const getInboundReferences: (cache: any) => Promise<InboundReferences | undefined>;
export declare const clearInboundReferences: (cache: any) => Promise<void>;
