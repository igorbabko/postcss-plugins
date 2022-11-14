import { checkIfFourCodePointsWouldStartCDO } from './checks/four-code-points-would-start-cdo';
import { checkIfThreeCodePointsWouldStartAnIdentSequence } from './checks/three-code-points-would-start-ident-sequence';
import { checkIfThreeCodePointsWouldStartANumber } from './checks/three-code-points-would-start-number';
import { checkIfTwoCodePointsStartAComment } from './checks/two-code-points-start-comment';
import { checkIfThreeCodePointsWouldStartCDC } from './checks/three-code-points-would-start-cdc';
import { APOSTROPHE, COLON, COMMA, COMMERCIAL_AT, FULL_STOP, HYPHEN_MINUS, LEFT_CURLY_BRACKET, LEFT_PARENTHESIS, LEFT_SQUARE_BRACKET, LESS_THAN_SIGN, NUMBER_SIGN, PLUS_SIGN, QUOTATION_MARK, REVERSE_SOLIDUS, RIGHT_CURLY_BRACKET, RIGHT_PARENTHESIS, RIGHT_SQUARE_BRACKET, SEMICOLON } from './code-points/code-points';
import { isDigitCodePoint, isIdentStartCodePoint, isWhitespace } from './code-points/ranges';
import { consumeComment } from './consume/comment';
import { consumeHashToken } from './consume/hash-token';
import { consumeIdentSequence } from './consume/ident-sequence';
import { consumeNumericToken } from './consume/numeric-token';
import { consumeWhiteSpace } from './consume/whitespace-token';
import { CSSToken, TokenType } from './interfaces/token';
import { Reader } from './reader';
import { consumeStringToken } from './consume/string-token';
import { consumeIdentLikeToken } from './consume/ident-like-token';
import { checkIfTwoCodePointsAreAValidEscape } from './checks/two-code-points-are-valid-escape';
import { ParserError } from './interfaces/error';
import { codePointsToString } from './code-points/code-points-to-string';

interface Stringer {
	valueOf(): string
}

export function tokenizer(input: { css: Stringer }, options?: { commentsAreTokens?: boolean, onParseError?: (error: ParserError) => void }) {
	const css = input.css.valueOf();

	const reader = new Reader(css);

	const ctx = {
		onParseError: options?.onParseError ?? (() => { /* noop */ }),
	};

	function endOfFile() {
		return reader.peekOneCodePoint() === false;
	}

	function nextToken(): CSSToken | undefined {
		reader.resetRepresentation();

		if (checkIfTwoCodePointsStartAComment(ctx, reader)) {
			if (options?.commentsAreTokens) {
				return consumeComment(ctx, reader);
			} else {
				consumeComment(ctx, reader);
			}
		}

		reader.resetRepresentation();

		const peeked = reader.peekOneCodePoint();
		if (peeked === false) {
			return [TokenType.EOF, '', -1, -1, undefined];
		}

		// Simple, one character tokens:
		switch (peeked) {
			case COMMA: {
				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.Comma, reader.representationString(), representation[0], representation[1], undefined];
			}
			case COLON: {
				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.Colon, reader.representationString(), representation[0], representation[1], undefined];
			}
			case SEMICOLON: {
				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.Semicolon, reader.representationString(), representation[0], representation[1], undefined];
			}
			case LEFT_PARENTHESIS: {
				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.OpenParen, reader.representationString(), representation[0], representation[1], undefined];
			}
			case RIGHT_PARENTHESIS: {
				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.CloseParen, reader.representationString(), representation[0], representation[1], undefined];
			}
			case LEFT_SQUARE_BRACKET: {
				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.OpenSquare, reader.representationString(), representation[0], representation[1], undefined];
			}
			case RIGHT_SQUARE_BRACKET: {
				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.CloseSquare, reader.representationString(), representation[0], representation[1], undefined];
			}
			case LEFT_CURLY_BRACKET: {
				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.OpenCurly, reader.representationString(), representation[0], representation[1], undefined];
			}
			case RIGHT_CURLY_BRACKET: {
				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.CloseCurly, reader.representationString(), representation[0], representation[1], undefined];
			}
		}

		switch (peeked) {
			case APOSTROPHE:
			case QUOTATION_MARK:
				return consumeStringToken(ctx, reader);
			case NUMBER_SIGN:
				return consumeHashToken(ctx, reader);

			case PLUS_SIGN:
			case FULL_STOP: {
				if (checkIfThreeCodePointsWouldStartANumber(ctx, reader)) {
					return consumeNumericToken(ctx, reader);
				}

				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.Delim, reader.representationString(), representation[0], representation[1], {
					value: String.fromCharCode(peeked),
				}];
			}

			case HYPHEN_MINUS: {
				if (checkIfThreeCodePointsWouldStartANumber(ctx, reader)) {
					return consumeNumericToken(ctx, reader);
				}

				if (checkIfThreeCodePointsWouldStartCDC(ctx, reader)) {
					reader.readCodePoint();
					reader.readCodePoint();
					reader.readCodePoint();

					const representation = reader.representation();
					return [TokenType.CDC, reader.representationString(), representation[0], representation[1], undefined];
				}

				if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
					return consumeIdentLikeToken(ctx, reader);
				}

				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.Delim, reader.representationString(), representation[0], representation[1], {
					value: '-',
				}];
			}

			case LESS_THAN_SIGN: {
				if (checkIfFourCodePointsWouldStartCDO(ctx, reader)) {
					reader.readCodePoint();
					reader.readCodePoint();
					reader.readCodePoint();
					reader.readCodePoint();

					const representation = reader.representation();
					return [TokenType.CDO, reader.representationString(), representation[0], representation[1], undefined];
				}

				reader.readCodePoint();
				const representation = reader.representation();
				return [TokenType.Delim, reader.representationString(), representation[0], representation[1], {
					value: '<',
				}];
			}

			case COMMERCIAL_AT: {
				reader.readCodePoint();
				if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
					const identSequence = consumeIdentSequence(ctx, reader);

					const representation = reader.representation();
					return [TokenType.AtKeyword, reader.representationString(), representation[0], representation[1], {
						value: codePointsToString(identSequence),
					}];
				}

				const representation = reader.representation();
				return [TokenType.Delim, reader.representationString(), representation[0], representation[1], {
					value: '@',
				}];
			}

			case REVERSE_SOLIDUS: {
				if (checkIfTwoCodePointsAreAValidEscape(ctx, reader)) {
					return consumeIdentLikeToken(ctx, reader);
				}

				reader.readCodePoint();

				const representation = reader.representation();
				ctx.onParseError({
					message: 'Invalid escape sequence after "\\"',
					start: representation[0],
					end: representation[1],
					state: [
						'4.3.1. Consume a token',
						'U+005C REVERSE SOLIDUS (\\)',
						'The input stream does not start with a valid escape sequence',
					],
				});

				return [TokenType.Delim, reader.representationString(), representation[0], representation[1], {
					value: '\\',
				}];
			}
		}

		if (isWhitespace(peeked)) {
			return consumeWhiteSpace(ctx, reader);
		}

		if (isDigitCodePoint(peeked)) {
			return consumeNumericToken(ctx, reader);
		}

		if (isIdentStartCodePoint(peeked)) {
			return consumeIdentLikeToken(ctx, reader);
		}

		reader.readCodePoint();
		const representation = reader.representation();
		return [TokenType.Delim, reader.representationString(), representation[0], representation[1], {
			value: String.fromCharCode(peeked),
		}];
	}

	return {
		nextToken: nextToken,
		endOfFile: endOfFile,
	};
}