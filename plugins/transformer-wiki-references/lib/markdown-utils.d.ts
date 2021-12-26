/**
 * Adapted from vscode-markdown/src/util.ts
 * https://github.com/yzhang-gh/vscode-markdown/blob/master/src/util.ts
 */
export declare const REGEX_FENCED_CODE_BLOCK: RegExp;
export declare function markdownHeadingToPlainText(text: string): string;
export declare function rxMarkdownHeading(level: number): RegExp;
export declare function findTopLevelHeading(md: unknown): string | null;
export declare function cleanupMarkdown(markdown: string): string;
export declare function findInMarkdown(markdown: string, regex: RegExp): string[];
export declare function findInMarkdownLines(markdown: string, regex: RegExp): {
    matchStr: string;
    lineContent: string;
}[];
