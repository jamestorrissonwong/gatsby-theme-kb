"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferences = exports.rxHashtagLink = exports.rxBlockLink = exports.rxWikiLink = void 0;
const markdown_utils_1 = require("./markdown-utils");
function rxWikiLink() {
    const pattern = '\\[\\[([^\\]]+)\\]\\]'; // [[wiki-link-regex]]
    return new RegExp(pattern, 'ig');
}
exports.rxWikiLink = rxWikiLink;
function rxBlockLink() {
    const pattern = '\\(\\(([^\\]]+)\\)\\)'; // ((block-link-regex))
    return new RegExp(pattern, 'ig');
}
exports.rxBlockLink = rxBlockLink;
function rxHashtagLink() {
    const pattern = '(?:^|\\s)#([^\\s]+)'; // #hashtag
    return new RegExp(pattern, 'ig');
}
exports.rxHashtagLink = rxHashtagLink;
const getLinkDefinitionPattern = () => /^\[([\d\w-_]+)\]\s+(.*)/ig; // [defintion]: target
function findReferenceWithPattern(md, pattern) {
    return markdown_utils_1.findInMarkdownLines(md, pattern).map(({ lineContent, matchStr }) => {
        let target = matchStr;
        let targetAnchor;
        const hashIndex = matchStr.indexOf('#');
        if (hashIndex > -1) {
            target = matchStr.substring(0, hashIndex);
            targetAnchor = matchStr.substring(hashIndex + 1);
        }
        const ref = {
            target,
            contextLine: lineContent,
        };
        if (targetAnchor !== undefined) {
            ref.targetAnchor = targetAnchor;
        }
        return ref;
    });
}
const getReferences = (string, onReferenceAdd) => {
    const md = markdown_utils_1.cleanupMarkdown(string);
    onReferenceAdd = onReferenceAdd || ((o) => o);
    const references = {
        pages: [
            ...findReferenceWithPattern(md, rxHashtagLink()),
            ...findReferenceWithPattern(md, rxWikiLink()),
            ...findReferenceWithPattern(md, getLinkDefinitionPattern()),
        ].map(o => onReferenceAdd(o)),
    };
    return references;
};
exports.getReferences = getReferences;
