import { MdxNode } from './type';
export declare type References = {
    pages: Reference[];
};
export declare type Reference = {
    /** target page slug */
    target: string;
    targetAnchor?: string;
    contextLine: string;
    referrerNode?: MdxNode;
};
export declare function rxWikiLink(): RegExp;
export declare function rxBlockLink(): RegExp;
export declare function rxHashtagLink(): RegExp;
export declare const getReferences: (string: string, onReferenceAdd?: (ref: Reference) => Reference) => References;
