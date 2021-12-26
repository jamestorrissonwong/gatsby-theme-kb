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
exports.clearInboundReferences = exports.getInboundReferences = exports.setInboundReferences = exports.getCachedNode = exports.setCachedNode = exports.getAllCachedNodes = exports.cacheDirectory = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("./util");
const cacheDirectory = (cache) => {
    return cache.directory;
};
exports.cacheDirectory = cacheDirectory;
const inboundFile = `___inboundReferences.json`;
const getAllCachedNodes = async (cache, getNode) => {
    const dir = exports.cacheDirectory(cache);
    const files = await fs.promises.readdir(dir);
    return (await Promise.all(files.map((f) => {
        if (f === inboundFile) {
            return;
        }
        const id = decodeURIComponent(f.replace(/\.json$/, ''));
        return exports.getCachedNode(cache, id, getNode);
    }))).filter(util_1.nonNullable);
};
exports.getAllCachedNodes = getAllCachedNodes;
const setCachedNode = (cache, id, data) => {
    return fs.promises.writeFile(path.join(exports.cacheDirectory(cache), `${encodeURIComponent(id)}.json`), JSON.stringify({
        outboundReferences: data.outboundReferences,
        title: data.title,
        aliases: data.aliases,
        resolvedOutboundReferences: data.resolvedOutboundReferences,
    }));
};
exports.setCachedNode = setCachedNode;
const getCachedNode = async (cache, id, getNode) => {
    const node = getNode(id);
    if (!node) {
        try {
            // clean up the cache if we have some file that aren't node
            await fs.promises.unlink(path.join(exports.cacheDirectory(cache), `${encodeURIComponent(id)}.json`));
        }
        catch (err) { }
        return undefined;
    }
    try {
        const data = JSON.parse(await fs.promises.readFile(path.join(exports.cacheDirectory(cache), `${encodeURIComponent(id)}.json`), 'utf8'));
        return Object.assign({ node }, data);
    }
    catch (err) {
        return undefined;
    }
};
exports.getCachedNode = getCachedNode;
const setInboundReferences = (cache, data) => {
    return fs.promises.writeFile(path.join(exports.cacheDirectory(cache), inboundFile), JSON.stringify(data));
};
exports.setInboundReferences = setInboundReferences;
const getInboundReferences = async (cache) => {
    try {
        return JSON.parse(await fs.promises.readFile(path.join(exports.cacheDirectory(cache), inboundFile), 'utf8'));
    }
    catch (err) {
        return undefined;
    }
};
exports.getInboundReferences = getInboundReferences;
const clearInboundReferences = async (cache) => {
    try {
        await fs.promises.unlink(path.join(exports.cacheDirectory(cache), inboundFile));
    }
    catch (e) { }
};
exports.clearInboundReferences = clearInboundReferences;
