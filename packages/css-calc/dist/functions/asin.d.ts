import type { Calculation } from '../calculation';
import type { FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
export declare function solveASin(asinNode: FunctionNode, a: TokenNode): Calculation | -1;