"use strict";class ParseError extends Error{sourceStart;sourceEnd;parserState;constructor(e,o,r,n){super(e),this.name="ParseError",this.sourceStart=o,this.sourceEnd=r,this.parserState=n}}class Reader{cursor;source="";codePointSource=[];length=0;representationStart=0;representationEnd=-1;constructor(e){this.cursor=0,this.source=e,this.length=e.length,this.codePointSource=new Array(this.length);for(let e=0;e<this.length;e++)this.codePointSource[e]=this.source.charCodeAt(e)}cursorPositionOfLastReadCodePoint(){return this.cursor-1}advanceCodePoint(e=1){this.cursor+=e,this.representationEnd=this.cursor-1}readCodePoint(e=1){const o=this.codePointSource[this.cursor];return void 0!==o&&(this.cursor+=e,this.representationEnd=this.cursor-1,o)}unreadCodePoint(e=1){return 0!==this.cursor&&(this.cursor-=e,this.representationEnd=this.cursor-1,!0)}}var e,o,r;exports.TokenType=void 0,(e=exports.TokenType||(exports.TokenType={})).Comment="comment",e.AtKeyword="at-keyword-token",e.BadString="bad-string-token",e.BadURL="bad-url-token",e.CDC="CDC-token",e.CDO="CDO-token",e.Colon="colon-token",e.Comma="comma-token",e.Delim="delim-token",e.Dimension="dimension-token",e.EOF="EOF-token",e.Function="function-token",e.Hash="hash-token",e.Ident="ident-token",e.Number="number-token",e.Percentage="percentage-token",e.Semicolon="semicolon-token",e.String="string-token",e.URL="url-token",e.Whitespace="whitespace-token",e.OpenParen="(-token",e.CloseParen=")-token",e.OpenSquare="[-token",e.CloseSquare="]-token",e.OpenCurly="{-token",e.CloseCurly="}-token",exports.NumberType=void 0,(o=exports.NumberType||(exports.NumberType={})).Integer="integer",o.Number="number",function(e){e.Unrestricted="unrestricted",e.ID="id"}(r||(r={}));const n=45,t=65533;function checkIfFourCodePointsWouldStartCDO(e,o){return 60===o.codePointSource[o.cursor]&&33===o.codePointSource[o.cursor+1]&&o.codePointSource[o.cursor+2]===n&&o.codePointSource[o.cursor+3]===n}function isDigitCodePoint(e){return e>=48&&e<=57}function isUppercaseLetterCodePoint(e){return e>=65&&e<=90}function isLowercaseLetterCodePoint(e){return e>=97&&e<=122}function isHexDigitCodePoint(e){return isDigitCodePoint(e)||e>=97&&e<=102||e>=65&&e<=70}function isLetterCodePoint(e){return isLowercaseLetterCodePoint(e)||isUppercaseLetterCodePoint(e)}function isNonASCIICodePoint(e){return e>=128}function isIdentStartCodePoint(e){return isLetterCodePoint(e)||isNonASCIICodePoint(e)||95===e}function isIdentCodePoint(e){return isIdentStartCodePoint(e)||isDigitCodePoint(e)||e===n}function isNewLine(e){return 10===e||13===e||12===e}function isWhitespace(e){return 32===e||10===e||9===e||13===e||12===e}function checkIfTwoCodePointsAreAValidEscape(e,o){return 92===o.codePointSource[o.cursor]&&!isNewLine(o.codePointSource[o.cursor+1])}function checkIfThreeCodePointsWouldStartAnIdentSequence(e,o){return o.codePointSource[o.cursor]===n?o.codePointSource[o.cursor+1]===n||(!!isIdentStartCodePoint(o.codePointSource[o.cursor+1])||92===o.codePointSource[o.cursor+1]&&10!==o.codePointSource[o.cursor+2]):!!isIdentStartCodePoint(o.codePointSource[o.cursor])||checkIfTwoCodePointsAreAValidEscape(0,o)}function checkIfThreeCodePointsWouldStartANumber(e,o){return 43===o.codePointSource[o.cursor]||o.codePointSource[o.cursor]===n?!!isDigitCodePoint(o.codePointSource[o.cursor+1])||46===o.codePointSource[o.cursor+1]&&isDigitCodePoint(o.codePointSource[o.cursor+2]):46===o.codePointSource[o.cursor]?isDigitCodePoint(o.codePointSource[o.cursor+1]):!!isDigitCodePoint(o.codePointSource[o.cursor])}function checkIfTwoCodePointsStartAComment(e,o){return 47===o.codePointSource[o.cursor]&&42===o.codePointSource[o.cursor+1]}function checkIfThreeCodePointsWouldStartCDC(e,o){return o.codePointSource[o.cursor]===n&&o.codePointSource[o.cursor+1]===n&&62===o.codePointSource[o.cursor+2]}function consumeComment(e,o){for(o.advanceCodePoint(2);;){const r=o.readCodePoint();if(!1===r){e.onParseError(new ParseError("Unexpected EOF while consuming a comment.",o.representationStart,o.representationEnd,["4.3.2. Consume comments","Unexpected EOF"]));break}if(42===r&&(void 0!==o.codePointSource[o.cursor]&&47===o.codePointSource[o.cursor])){o.advanceCodePoint();break}}return[exports.TokenType.Comment,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}function consumeEscapedCodePoint(e,o){const r=o.readCodePoint();if(!1===r)return e.onParseError(new ParseError("Unexpected EOF while consuming an escaped code point.",o.representationStart,o.representationEnd,["4.3.7. Consume an escaped code point","Unexpected EOF"])),t;if(isHexDigitCodePoint(r)){const e=[r];for(;void 0!==o.codePointSource[o.cursor]&&isHexDigitCodePoint(o.codePointSource[o.cursor])&&e.length<6;)e.push(o.codePointSource[o.cursor]),o.advanceCodePoint();isWhitespace(o.codePointSource[o.cursor])&&o.advanceCodePoint();const i=parseInt(String.fromCharCode(...e),16);return 0===i?t:(n=i)>=55296&&n<=57343||i>1114111?t:i}var n;return r}function consumeIdentSequence(e,o){const r=[];for(;;)if(isIdentCodePoint(o.codePointSource[o.cursor]))r.push(o.codePointSource[o.cursor]),o.advanceCodePoint();else{if(!checkIfTwoCodePointsAreAValidEscape(0,o))return r;o.advanceCodePoint(),r.push(consumeEscapedCodePoint(e,o))}}function consumeHashToken(e,o){if(o.advanceCodePoint(),void 0!==o.codePointSource[o.cursor]&&isIdentCodePoint(o.codePointSource[o.cursor])||checkIfTwoCodePointsAreAValidEscape(0,o)){let n=r.Unrestricted;checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)&&(n=r.ID);const t=consumeIdentSequence(e,o);return[exports.TokenType.Hash,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCharCode(...t),type:n}]}return[exports.TokenType.Delim,"#",o.representationStart,o.representationEnd,{value:"#"}]}function consumeNumber(e,o){let r=exports.NumberType.Integer;for(43!==o.codePointSource[o.cursor]&&o.codePointSource[o.cursor]!==n||o.advanceCodePoint();isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if(46===o.codePointSource[o.cursor]&&isDigitCodePoint(o.codePointSource[o.cursor+1]))for(o.advanceCodePoint(2),r=exports.NumberType.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if((101===o.codePointSource[o.cursor]||69===o.codePointSource[o.cursor])&&isDigitCodePoint(o.codePointSource[o.cursor+1]))for(o.advanceCodePoint(2),r=exports.NumberType.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();if((101===o.codePointSource[o.cursor]||69===o.codePointSource[o.cursor])&&(o.codePointSource[o.cursor+1]===n||43===o.codePointSource[o.cursor+1])&&isDigitCodePoint(o.codePointSource[o.cursor+2]))for(o.advanceCodePoint(3),r=exports.NumberType.Number;isDigitCodePoint(o.codePointSource[o.cursor]);)o.advanceCodePoint();return[parseFloat(o.source.slice(o.representationStart,o.representationEnd+1)),r]}function consumeNumericToken(e,o){const r=consumeNumber(0,o);if(checkIfThreeCodePointsWouldStartAnIdentSequence(0,o)){const n=consumeIdentSequence(e,o);return[exports.TokenType.Dimension,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r[0],type:r[1],unit:String.fromCharCode(...n)}]}return 37===o.codePointSource[o.cursor]?(o.advanceCodePoint(),[exports.TokenType.Percentage,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r[0]}]):[exports.TokenType.Number,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r[0],type:r[1]}]}function consumeWhiteSpace(e,o){for(;isWhitespace(o.codePointSource[o.cursor]);)o.advanceCodePoint();return[exports.TokenType.Whitespace,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}function consumeStringToken(e,o){let r="";const n=o.readCodePoint();for(;;){const t=o.readCodePoint();if(!1===t)return e.onParseError(new ParseError("Unexpected EOF while consuming a string token.",o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected EOF"])),[exports.TokenType.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(isNewLine(t))return e.onParseError(new ParseError("Unexpected newline while consuming a string token.",o.representationStart,o.representationEnd,["4.3.5. Consume a string token","Unexpected newline"])),o.unreadCodePoint(),[exports.TokenType.BadString,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];if(t===n)return[exports.TokenType.String,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(92!==t)r+=String.fromCharCode(t);else{if(void 0===o.codePointSource[o.cursor])continue;if(isNewLine(o.codePointSource[o.cursor])){o.advanceCodePoint();continue}r+=String.fromCharCode(consumeEscapedCodePoint(e,o))}}}const i="u".charCodeAt(0),s="U".charCodeAt(0),c="r".charCodeAt(0),a="R".charCodeAt(0),u="l".charCodeAt(0),d="L".charCodeAt(0);function checkIfCodePointsMatchURLIdent(e,o){return 3===o.length&&((o[0]===i||o[0]===s)&&((o[1]===c||o[1]===a)&&(o[2]===u||o[2]===d)))}function consumeBadURL(e,o){for(;;){if(void 0===o.codePointSource[o.cursor])return;if(41===o.codePointSource[o.cursor])return void o.advanceCodePoint();checkIfTwoCodePointsAreAValidEscape(0,o)?(o.advanceCodePoint(),consumeEscapedCodePoint(e,o)):o.advanceCodePoint()}}function consumeUrlToken(e,o){consumeWhiteSpace(0,o);let r="";for(;;){if(void 0===o.codePointSource[o.cursor])return e.onParseError(new ParseError("Unexpected EOF while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected EOF"])),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(41===o.codePointSource[o.cursor])return o.advanceCodePoint(),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}];if(isWhitespace(o.codePointSource[o.cursor]))return consumeWhiteSpace(0,o),void 0===o.codePointSource[o.cursor]?(e.onParseError(new ParseError("Unexpected EOF while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Consume as much whitespace as possible","Unexpected EOF"])),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}]):41===o.codePointSource[o.cursor]?(o.advanceCodePoint(),[exports.TokenType.URL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:r}]):(consumeBadURL(e,o),[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]);if(34===o.codePointSource[o.cursor]||39===o.codePointSource[o.cursor]||40===o.codePointSource[o.cursor]||(11===(n=o.codePointSource[o.cursor])||127===n||0<=n&&n<=8||14<=n&&n<=31))return consumeBadURL(e,o),e.onParseError(new ParseError("Unexpected character while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","Unexpected U+0022 QUOTATION MARK (\"), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point"])),[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0];if(92===o.codePointSource[o.cursor]){if(checkIfTwoCodePointsAreAValidEscape(0,o)){r+=String.fromCharCode(consumeEscapedCodePoint(e,o));continue}return consumeBadURL(e,o),e.onParseError(new ParseError("Invalid escape sequence while consuming a url token.",o.representationStart,o.representationEnd,["4.3.6. Consume a url token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[exports.TokenType.BadURL,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,void 0]}r+=String.fromCharCode(o.codePointSource[o.cursor]),o.advanceCodePoint()}var n}function consumeIdentLikeToken(e,o){const r=consumeIdentSequence(e,o);if(40!==o.codePointSource[o.cursor])return[exports.TokenType.Ident,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCharCode(...r)}];if(checkIfCodePointsMatchURLIdent(0,r)){o.advanceCodePoint();let n=0;for(;;){const e=isWhitespace(o.codePointSource[o.cursor]),t=isWhitespace(o.codePointSource[o.cursor+1]);if(e&&t){n+=1,o.advanceCodePoint(1);continue}const i=e?o.codePointSource[o.cursor+1]:o.codePointSource[o.cursor];if(34===i||39===i)return n>0&&o.unreadCodePoint(n),[exports.TokenType.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCharCode(...r)}];break}return consumeUrlToken(e,o)}return o.advanceCodePoint(),[exports.TokenType.Function,o.source.slice(o.representationStart,o.representationEnd+1),o.representationStart,o.representationEnd,{value:String.fromCharCode(...r)}]}exports.ParseError=ParseError,exports.Reader=Reader,exports.cloneTokens=function cloneTokens(e){return"undefined"!=typeof globalThis&&"structuredClone"in globalThis?structuredClone(e):JSON.parse(JSON.stringify(e))},exports.isToken=function isToken(e){return!!Array.isArray(e)&&(!(e.length<4)&&(e[0]in exports.TokenType&&("string"==typeof e[1]&&("number"==typeof e[2]&&"number"==typeof e[3]))))},exports.mirrorVariant=function mirrorVariant(e){switch(e[0]){case exports.TokenType.OpenParen:return[exports.TokenType.CloseParen,")",-1,-1,void 0];case exports.TokenType.CloseParen:return[exports.TokenType.OpenParen,"(",-1,-1,void 0];case exports.TokenType.OpenCurly:return[exports.TokenType.CloseCurly,"}",-1,-1,void 0];case exports.TokenType.CloseCurly:return[exports.TokenType.OpenCurly,"{",-1,-1,void 0];case exports.TokenType.OpenSquare:return[exports.TokenType.CloseSquare,"]",-1,-1,void 0];case exports.TokenType.CloseSquare:return[exports.TokenType.OpenSquare,"[",-1,-1,void 0];default:return null}},exports.mirrorVariantType=function mirrorVariantType(e){switch(e){case exports.TokenType.OpenParen:return exports.TokenType.CloseParen;case exports.TokenType.CloseParen:return exports.TokenType.OpenParen;case exports.TokenType.OpenCurly:return exports.TokenType.CloseCurly;case exports.TokenType.CloseCurly:return exports.TokenType.OpenCurly;case exports.TokenType.OpenSquare:return exports.TokenType.CloseSquare;case exports.TokenType.CloseSquare:return exports.TokenType.OpenSquare;default:return null}},exports.mutateIdent=function mutateIdent(e,o){let r="";const t=new Array(o.length);for(let e=0;e<o.length;e++)t[e]=o.charCodeAt(e);let i=0;t[0]===n&&t[1]===n?(r="--",i=2):t[0]===n&&t[1]?(r="-",i=2,isIdentStartCodePoint(t[1])?r+=o[1]:r+=`\\${t[1].toString(16)} `):isIdentStartCodePoint(t[0])?(r=o[0],i=1):(r=`\\${t[0].toString(16)} `,i=1);for(let e=i;e<t.length;e++)isIdentCodePoint(t[e])?r+=o[e]:r+=`\\${t[e].toString(16)} `;e[1]=r,e[4].value=o},exports.stringify=function stringify(...e){let o="";for(let r=0;r<e.length;r++)o+=e[r][1];return o},exports.tokenizer=function tokenizer(e,o){const r=e.css.valueOf(),t=new Reader(r),i={onParseError:(null==o?void 0:o.onParseError)??(()=>{})};return{nextToken:function nextToken(){if(t.representationStart=t.cursor,t.representationEnd=-1,checkIfTwoCodePointsStartAComment(0,t))return consumeComment(i,t);const e=t.codePointSource[t.cursor];if(void 0===e)return[exports.TokenType.EOF,"",-1,-1,void 0];if(isIdentStartCodePoint(e))return consumeIdentLikeToken(i,t);if(isDigitCodePoint(e))return consumeNumericToken(i,t);switch(e){case 44:return t.advanceCodePoint(),[exports.TokenType.Comma,",",t.representationStart,t.representationEnd,void 0];case 58:return t.advanceCodePoint(),[exports.TokenType.Colon,":",t.representationStart,t.representationEnd,void 0];case 59:return t.advanceCodePoint(),[exports.TokenType.Semicolon,";",t.representationStart,t.representationEnd,void 0];case 40:return t.advanceCodePoint(),[exports.TokenType.OpenParen,"(",t.representationStart,t.representationEnd,void 0];case 41:return t.advanceCodePoint(),[exports.TokenType.CloseParen,")",t.representationStart,t.representationEnd,void 0];case 91:return t.advanceCodePoint(),[exports.TokenType.OpenSquare,"[",t.representationStart,t.representationEnd,void 0];case 93:return t.advanceCodePoint(),[exports.TokenType.CloseSquare,"]",t.representationStart,t.representationEnd,void 0];case 123:return t.advanceCodePoint(),[exports.TokenType.OpenCurly,"{",t.representationStart,t.representationEnd,void 0];case 125:return t.advanceCodePoint(),[exports.TokenType.CloseCurly,"}",t.representationStart,t.representationEnd,void 0];case 39:case 34:return consumeStringToken(i,t);case 35:return consumeHashToken(i,t);case 43:case 46:return checkIfThreeCodePointsWouldStartANumber(0,t)?consumeNumericToken(i,t):(t.advanceCodePoint(),[exports.TokenType.Delim,t.source[t.representationStart],t.representationStart,t.representationEnd,{value:t.source[t.representationStart]}]);case 10:case 13:case 12:case 9:case 32:return consumeWhiteSpace(0,t);case n:return checkIfThreeCodePointsWouldStartANumber(0,t)?consumeNumericToken(i,t):checkIfThreeCodePointsWouldStartCDC(0,t)?(t.advanceCodePoint(3),[exports.TokenType.CDC,"--\x3e",t.representationStart,t.representationEnd,void 0]):checkIfThreeCodePointsWouldStartAnIdentSequence(0,t)?consumeIdentLikeToken(i,t):(t.advanceCodePoint(),[exports.TokenType.Delim,"-",t.representationStart,t.representationEnd,{value:"-"}]);case 60:return checkIfFourCodePointsWouldStartCDO(0,t)?(t.advanceCodePoint(4),[exports.TokenType.CDO,"\x3c!--",t.representationStart,t.representationEnd,void 0]):(t.advanceCodePoint(),[exports.TokenType.Delim,"<",t.representationStart,t.representationEnd,{value:"<"}]);case 64:if(t.advanceCodePoint(),checkIfThreeCodePointsWouldStartAnIdentSequence(0,t)){const e=consumeIdentSequence(i,t);return[exports.TokenType.AtKeyword,t.source.slice(t.representationStart,t.representationEnd+1),t.representationStart,t.representationEnd,{value:String.fromCharCode(...e)}]}return[exports.TokenType.Delim,"@",t.representationStart,t.representationEnd,{value:"@"}];case 92:return checkIfTwoCodePointsAreAValidEscape(0,t)?consumeIdentLikeToken(i,t):(t.advanceCodePoint(),i.onParseError(new ParseError('Invalid escape sequence after "\\"',t.representationStart,t.representationEnd,["4.3.1. Consume a token","U+005C REVERSE SOLIDUS (\\)","The input stream does not start with a valid escape sequence"])),[exports.TokenType.Delim,"\\",t.representationStart,t.representationEnd,{value:"\\"}])}return t.advanceCodePoint(),[exports.TokenType.Delim,t.source[t.representationStart],t.representationStart,t.representationEnd,{value:t.source[t.representationStart]}]},endOfFile:function endOfFile(){return void 0===t.codePointSource[t.cursor]}}};