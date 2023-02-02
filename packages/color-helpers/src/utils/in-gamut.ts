/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/map-gamut.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function inGamut(x: Color): boolean {
	const [xX, xY, xZ] = x;
	return xX >= -0.0001 && xX <= 1.0001 && xY >= -0.0001 && xY <= 1.0001 && xZ >= -0.0001 && xZ <= 1.0001;
}