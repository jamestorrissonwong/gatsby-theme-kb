"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCreateNode = void 0;
const get_references_1 = require("./get-references");
const options_1 = require("./options");
const cache_1 = require("./cache");
const markdown_utils_1 = require("./markdown-utils");
function getTitle(node, content) {
    if (typeof node.frontmatter === 'object' &&
        node.frontmatter &&
        'title' in node.frontmatter &&
        node.frontmatter['title']) {
        return node.frontmatter['title'];
    }
    return markdown_utils_1.findTopLevelHeading(content) || '';
}
function getAliases(node) {
    if (typeof node.frontmatter === 'object' &&
        node.frontmatter &&
        'aliases' in node.frontmatter &&
        Array.isArray(node.frontmatter['aliases'])) {
        return node.frontmatter['aliases'];
    }
    return [];
}
const onCreateNode = async ({ cache, node, loadNodeContent, getNode }, _options) => {
    const options = options_1.resolveOptions(_options);
    // if we shouldn't process this node, then return
    if (!options.types.includes(node.internal.type)) {
        return;
    }
    const content = await loadNodeContent(node);
    const outboundReferences = get_references_1.getReferences(content, (ref) => {
        ref.referrerNode = node;
        return ref;
    });
    const title = getTitle(node, content);
    const aliases = getAliases(node);
    await cache_1.clearInboundReferences(cache);
    await cache_1.setCachedNode(cache, node.id, {
        node,
        outboundReferences,
        title,
        aliases,
    });
};
exports.onCreateNode = onCreateNode;
