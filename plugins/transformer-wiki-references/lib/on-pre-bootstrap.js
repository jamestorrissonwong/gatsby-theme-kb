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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPreBootstrap = void 0;
const path = __importStar(require("path"));
const fsWalk = __importStar(require("@nodelib/fs.walk"));
const options_1 = require("./options");
const content_tree_1 = require("./content-tree");
const anymatch_1 = __importDefault(require("anymatch"));
const onPreBootstrap = async ({ cache }, _options) => {
    const options = options_1.resolveOptions(_options);
    const { contentPath, extensions, ignore } = options;
    if (!options.contentPath)
        return;
    const tree = new content_tree_1.ContentTree(new content_tree_1.ContentNode({
        name: contentPath,
        path: contentPath,
        key: contentPath,
    }));
    const entries = fsWalk
        .walkSync(contentPath, {
        basePath: '',
        deepFilter: (entry) => {
            return !/\/node_modules\//.test(entry.path);
        },
        entryFilter: (entry) => {
            if (ignore) {
                return !anymatch_1.default(ignore, entry.path);
            }
            return true;
        }
    })
        .filter((entry) => {
        if (entry.dirent.isDirectory())
            return false;
        if (!extensions.includes(path.extname(entry.name))) {
            return false;
        }
        return true;
    });
    // walk the contentPath and collect all possible files,
    //   then write the constructed file tree to gatsby cache for further usage in `setFieldsOnGraphQLNodeType` phase
    entries.forEach((entry) => {
        const node = new content_tree_1.ContentNode({
            name: entry.name,
            path: entry.path,
            key: path.basename(entry.name, path.extname(entry.name)),
        });
        tree.add(node);
    });
    const repr = tree.serialize();
    await cache.set(content_tree_1.CONTEXT_TREE_CACHE_KEY, repr);
};
exports.onPreBootstrap = onPreBootstrap;
