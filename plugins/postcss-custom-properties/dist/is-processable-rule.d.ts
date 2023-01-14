import type { Rule } from 'postcss';
export declare function isProcessableRule(rule: Rule): boolean;
export declare function isHtmlRule(rule: Rule): number;
export declare function isRootRule(rule: Rule): number;