export declare type PluginOptions = {
    types?: string[];
    extensions?: string[];
    contentPath?: string;
    ignore?: string[];
};
export declare const resolveOptions: (options?: PluginOptions) => {
    types: string[];
    extensions: string[];
    contentPath?: string;
    ignore?: string[];
};
