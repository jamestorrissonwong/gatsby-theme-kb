"use strict";
/**
 * Adapted from vscode-markdown/src/util.ts
 * https://github.com/yzhang-gh/vscode-markdown/blob/master/src/util.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInMarkdownLines = exports.findInMarkdown = exports.cleanupMarkdown = exports.findTopLevelHeading = exports.rxMarkdownHeading = exports.markdownHeadingToPlainText = exports.REGEX_FENCED_CODE_BLOCK = void 0;
exports.REGEX_FENCED_CODE_BLOCK = /^( {0,3}|\t)```[^`\r\n]*$[\w\W]+?^( {0,3}|\t)``` *$/gm;
const SETTEXT_REGEX = /(.*)\n={3,}/;
function markdownHeadingToPlainText(text) {
    // Remove Markdown syntax (bold, italic, links etc.) in a heading
    // For example: `_italic_` -> `italic`
    return text.replace(/\[([^\]]*)\]\[[^\]]*\]/, (_, g1) => g1);
}
exports.markdownHeadingToPlainText = markdownHeadingToPlainText;
function rxMarkdownHeading(level) {
    const pattern = `^#{${level}}\\s+(.+)$`;
    return new RegExp(pattern, 'im');
}
exports.rxMarkdownHeading = rxMarkdownHeading;
function findTopLevelHeading(md) {
    if (typeof md !== 'string') {
        return null;
    }
    const headingRegex = rxMarkdownHeading(1);
    const headingMatch = headingRegex.exec(md);
    const settextMatch = SETTEXT_REGEX.exec(md);
    let match = headingMatch;
    if (settextMatch && (!headingMatch || settextMatch.index < headingMatch.index)) {
        match = settextMatch;
    }
    if (match) {
        return markdownHeadingToPlainText(match[1]);
    }
    return null;
}
exports.findTopLevelHeading = findTopLevelHeading;
function cleanupMarkdown(markdown) {
    const replacer = (foundStr) => foundStr.replace(/[^\r\n]/g, '');
    return markdown
        .replace(exports.REGEX_FENCED_CODE_BLOCK, replacer) //// Remove fenced code blocks
        .replace(/<!--[\W\w]+?-->/g, replacer) //// Remove comments
        .replace(/^---[\W\w]+?(\r?\n)---/, replacer); //// Remove YAML front matter
}
exports.cleanupMarkdown = cleanupMarkdown;
function findInMarkdown(markdown, regex) {
    const unique = new Set();
    let match;
    while ((match = regex.exec(markdown))) {
        const [, name] = match;
        if (name) {
            unique.add(name);
        }
    }
    return Array.from(unique);
}
exports.findInMarkdown = findInMarkdown;
function findInMarkdownLines(markdown, regex) {
    const lines = markdown.split('\n');
    const result = [];
    lines.forEach((lineContent, lineNum) => {
        let match;
        regex.lastIndex = 0;
        while ((match = regex.exec(lineContent))) {
            const [, name] = match;
            if (name) {
                result.push({ matchStr: name, lineContent });
            }
        }
    });
    return result;
}
exports.findInMarkdownLines = findInMarkdownLines;
