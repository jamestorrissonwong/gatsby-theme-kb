"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOptions = void 0;
const defaultOptions = {
    types: ['Mdx'],
    extensions: ['.md', '.mdx'],
};
const resolveOptions = (options) => {
    return Object.assign(Object.assign({}, defaultOptions), options);
};
exports.resolveOptions = resolveOptions;
