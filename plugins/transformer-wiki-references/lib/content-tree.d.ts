export declare const CONTEXT_TREE_CACHE_KEY = "content-tree-repr";
export declare class ContentNode<T = {
    name: string;
    path: string;
    key: string;
}> {
    data: T;
    constructor(data: T);
}
export declare class ContentTree {
    rootNode: ContentNode;
    pathMap: Map<string, ContentNode<{
        name: string;
        path: string;
        key: string;
    }>>;
    shortPathMap: Map<string, ContentNode<{
        name: string;
        path: string;
        key: string;
    }>>;
    keyMap: Map<string, ContentNode<{
        name: string;
        path: string;
        key: string;
    }>>;
    nodes: Set<unknown>;
    constructor(rootNode: ContentNode);
    static fromRepr(repr: string): ContentTree;
    add(node: ContentNode): void;
    getByName(p: string): ContentNode<{
        name: string;
        path: string;
        key: string;
    }>;
    serialize(): string;
    getNode(input: string): ContentNode<{
        name: string;
        path: string;
        key: string;
    }>;
}
