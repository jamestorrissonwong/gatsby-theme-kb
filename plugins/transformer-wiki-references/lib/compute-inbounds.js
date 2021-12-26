"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateData = void 0;
const path_1 = require("path");
const util_1 = require("./util");
const cache_1 = require("./cache");
const content_tree_1 = require("./content-tree");
function hasChildInArrayExcept(node, array, except, getNode) {
    return node.children.some((id) => {
        if (id === except) {
            return false;
        }
        if (array.some((x) => x.id === id)) {
            return true;
        }
        const child = getNode(id);
        if (!child || !child.children || !child.children.length) {
            return false;
        }
        return hasChildInArrayExcept(child, array, except, getNode);
    });
}
let currentGeneration;
function getFilePathFromCachedNode(x) {
    let filePath;
    if (typeof x.node.fileAbsolutePath === 'string') {
        filePath = x.node.fileAbsolutePath;
    }
    else if (typeof x.node.absolutePath === 'string') {
        filePath = x.node.absolutePath;
    }
    return filePath;
}
async function generateData(cache, getNode) {
    if (currentGeneration) {
        return currentGeneration;
    }
    currentGeneration = Promise.resolve().then(async () => {
        const nodes = await cache_1.getAllCachedNodes(cache, getNode);
        const inboundReferences = {};
        let tree;
        let cachedNodeToContentNodeMap;
        const contextTreeRepr = await cache.get(content_tree_1.CONTEXT_TREE_CACHE_KEY);
        if (contextTreeRepr) {
            tree = content_tree_1.ContentTree.fromRepr(contextTreeRepr);
            cachedNodeToContentNodeMap = new Map();
            nodes.forEach((cachedNode) => {
                const filePath = getFilePathFromCachedNode(cachedNode);
                if (!filePath)
                    return;
                const contentNode = tree.getNode(filePath);
                if (contentNode) {
                    cachedNodeToContentNodeMap.set(cachedNode, contentNode);
                }
            });
        }
        function getRefNode(ref) {
            const title = ref.target;
            if (!title)
                return;
            let node = nodes.find((x) => {
                if (x.title === title || x.aliases.some((alias) => alias === title)) {
                    return true;
                }
                const filePath = getFilePathFromCachedNode(x);
                if (filePath) {
                    if (tree) {
                        if (cachedNodeToContentNodeMap.has(x)) {
                            const contentNodeByTitle = tree.getNode(title);
                            if (contentNodeByTitle === cachedNodeToContentNodeMap.get(x)) {
                                return true;
                            }
                        }
                    }
                    else {
                        return path_1.basename(filePath, path_1.extname(filePath)) === title;
                    }
                }
            });
            return node;
        }
        await Promise.all(nodes
            .map((node) => {
            const mapped = node.outboundReferences.pages
                .map((reference) => {
                const cachedNode = getRefNode(reference);
                if (!cachedNode)
                    return null;
                return {
                    contextLine: reference.contextLine,
                    target: cachedNode.node,
                    referrer: reference.referrerNode,
                    refWord: reference.target,
                    targetAnchor: reference.targetAnchor,
                };
            })
                .filter(util_1.nonNullable);
            mapped.forEach((item) => {
                const nodeId = item.target.id;
                if (!inboundReferences[nodeId]) {
                    inboundReferences[nodeId] = [];
                }
                inboundReferences[nodeId].push({
                    contextLine: item.contextLine,
                    target: item.target,
                    referrer: node.node,
                    refWord: item.refWord,
                });
            });
            return Object.assign(Object.assign({}, node), { resolvedOutboundReferences: mapped });
        })
            .map((data) => cache_1.setCachedNode(cache, data.node.id, data)));
        Object.keys(inboundReferences).forEach((nodeId) => {
            inboundReferences[nodeId] = inboundReferences[nodeId].filter((reference) => getNode(reference.target.parent) &&
                !hasChildInArrayExcept(getNode(reference.target.parent), inboundReferences[nodeId].map((o) => o.target), reference.target.id, getNode));
        });
        await cache_1.setInboundReferences(cache, inboundReferences);
        currentGeneration = undefined;
        return true;
    });
    return currentGeneration;
}
exports.generateData = generateData;
