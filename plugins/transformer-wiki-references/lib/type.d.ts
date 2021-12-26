import { Node } from 'gatsby';
export interface MdxNode extends Node {
    frontmatter?: {
        title?: string;
        aliases?: string[];
    };
}
/**
 * Used in GraphQL
 */
export declare type NodeReference = {
    target: MdxNode;
    refWord: string;
    targetAnchor?: string;
    referrer: MdxNode;
    contextLine: string;
};
