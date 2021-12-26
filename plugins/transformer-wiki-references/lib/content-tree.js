"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTree = exports.ContentNode = exports.CONTEXT_TREE_CACHE_KEY = void 0;
const path = __importStar(require("path"));
exports.CONTEXT_TREE_CACHE_KEY = 'content-tree-repr';
class ContentNode {
    constructor(data) {
        this.data = data;
    }
}
exports.ContentNode = ContentNode;
class ContentTree {
    constructor(rootNode) {
        this.rootNode = rootNode;
        this.pathMap = new Map();
        this.shortPathMap = new Map();
        this.keyMap = new Map();
        this.nodes = new Set();
    }
    static fromRepr(repr) {
        const { nodes, rootPath } = JSON.parse(repr);
        const tree = new ContentTree(new ContentNode({
            name: rootPath,
            path: rootPath,
            key: rootPath,
        }));
        nodes.forEach((node) => {
            tree.add(node);
        });
        return tree;
    }
    add(node) {
        const p = node.data.path;
        this.pathMap.set(node.data.path, node);
        this.keyMap.set(node.data.key, node);
        const extLength = path.extname(p).length;
        const pathWithoutExt = p.slice(0, -extLength);
        this.shortPathMap.set(pathWithoutExt, node);
        this.nodes.add(node);
    }
    getByName(p) {
        return this.keyMap.get(p);
    }
    serialize() {
        const nodes = Array.from(this.nodes);
        return JSON.stringify({ nodes, rootPath: this.rootNode.data.name }, null, 2);
    }
    getNode(input) {
        const relPath = path.relative(this.rootNode.data.name, input);
        const key = path.basename(relPath);
        if (this.pathMap.has(relPath))
            return this.pathMap.get(relPath);
        if (this.shortPathMap.has(relPath))
            return this.shortPathMap.get(relPath);
        if (this.keyMap.has(key))
            return this.keyMap.get(key);
    }
}
exports.ContentTree = ContentTree;
