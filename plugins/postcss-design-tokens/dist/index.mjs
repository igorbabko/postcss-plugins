import e from"postcss-value-parser";import t from"path";import{promises as n}from"fs";import r from"module";import{parseListOfComponentValues as o,isFunctionNode as a,isWhitespaceNode as s,isCommentNode as i,isTokenNode as u}from"@csstools/css-parser-algorithms";import{tokenizer as l,TokenType as c}from"@csstools/css-tokenizer";function toposort(e,t){let n=e.length;const r=new Array(n),o={};let a=n;const s=makeOutgoingEdges(t),i=makeNodesHash(e);for(t.forEach((function(e){if(!i.has(e[0])||!i.has(e[1]))throw new Error("Unknown token. Make sure to provide all tokens used in aliases.")}));a--;)o[a]||visit(e[a],a,new Set);return r;function visit(e,t,a){if(a.has(e)){let t;try{t=", token was: "+JSON.stringify(e)}catch(e){t=""}throw new Error("Cyclic dependency"+t)}if(!i.has(e))throw new Error("Found unknown token. Make sure to provided all involved tokens. Unknown token: "+JSON.stringify(e));if(o[t])return;o[t]=!0;let u=s.get(e)||new Set;if(u=Array.from(u),t=u.length){a.add(e);do{const e=u[--t];visit(e,i.get(e),a)}while(t);a.delete(e)}r[--n]=e}}function makeOutgoingEdges(e){const t=new Map;for(let n=0,r=e.length;n<r;n++){const r=e[n];t.has(r[0])||t.set(r[0],new Set),t.has(r[1])||t.set(r[1],new Set),t.get(r[0]).add(r[1])}return t}function makeNodesHash(e){const t=new Map;for(let n=0,r=e.length;n<r;n++)t.set(e[n],n);return t}function extractStyleDictionaryV3Token(e,t,n,r){if(void 0===e.value)throw new Error('Token value is undefined for "'+[...n,t].join(".")+'"');switch(typeof e.value){case"string":case"number":break;default:throw new Error('Token value is not a string or a number for "'+[...n,t].join(".")+'"')}const o=String(e.value);return{value:o,cssValue:e=>applyTransformsToValue(o,e),name:String(e.name??"")||t,comment:String(e.comment??"")||void 0,metadata:{name:String(e.name??"")?t:void 0,path:[...n,t],filePath:r,isSource:!0}}}const f=new Map;function applyTransformsToValue(t,n){if(!t)return"";if(!n)return t;if(!n.toUnit)return t;const r=e.unit(t??"");if(!r||r.unit===n.toUnit)return t;if(!r.unit){if(f.has(n.toUnit)){if(f.get(n.toUnit))return`${t}${n.toUnit}`;throw new Error(`Invalid unit "${n.toUnit}" for "${t}"`)}try{const r=e.unit(`${t}${n.toUnit}`);if(r&&r.unit===n.toUnit)return f.set(n.toUnit,!0),`${t}${n.toUnit}`;f.set(n.toUnit,!1)}catch(e){f.set(n.toUnit,!1)}throw new Error(`Invalid unit "${n.toUnit}" for "${t}"`)}var o,a;return"rem"===r.unit&&"px"===n.toUnit?remToPx(parseFloat(r.number),(null==(o=n.pluginOptions)?void 0:o.rootFontSize)??16):"px"===r.unit&&"rem"===n.toUnit?pxToRem(parseFloat(r.number),(null==(a=n.pluginOptions)?void 0:a.rootFontSize)??16):t}function remToPx(e,t){return`${formatFloat(e*t)}px`}function pxToRem(e,t){return`${formatFloat(e/t)}rem`}function formatFloat(e){if(Number.isInteger(e))return e.toString();let t=e.toFixed(5);for(let e=t.length;e>0&&"."!==t[e];e--)"0"===t[e]||(t=t.slice(0,e+1));return t}function dereferenceTokenValues(e){const t=new Set,n=new Map;for(const[r,o]of e.entries()){const e=parseReferences(o.value);e.length&&(t.add(r),n.set(r,e))}for(const[r,o]of n.entries()){for(let n=0;n<o.length;n++){const r=o[n];if("value-reference"!==r.type)continue;if(t.has(r.raw))continue;if(!e.has(r.raw))throw new Error('Alias "'+r.raw+'" not found');const a=e.get(r.raw);o[n]={type:"value-resolved",raw:r.raw,value:a.cssValue()}}if(o.some((e=>"value-reference"===e.type)))continue;const a=o.map((e=>e.value)).join(""),s=e.get(r);s.value=a,s.cssValue=e=>applyTransformsToValue(a,e),e.set(r,s),t.delete(r),n.delete(r)}if(0===t.size)return e;{const r=Array.from(e.keys()),o=[];for(const[e,t]of n.entries())for(let n=0;n<t.length;n++){const r=t[n];"value-reference"===r.type&&o.push([r.raw,e])}const a=toposort(r,o);if(!a)throw new Error("Circular reference detected");for(const r of a){if(!n.has(r))continue;const o=n.get(r);for(let n=0;n<o.length;n++){const r=o[n];if("value-reference"!==r.type)continue;if(t.has(r.raw))throw new Error('Alias "'+r.raw+'" can not be resolved');if(!e.has(r.raw))throw new Error('Alias "'+r.raw+'" not found');const a=e.get(r.raw);o[n]={type:"value-resolved",raw:r.raw,value:a.cssValue()}}if(o.some((e=>"value-reference"===e.type)))throw new Error('Token "'+r+'" can not be fully resolved');const a=o.map((e=>e.value)).join(""),s=e.get(r);s.value=a,s.cssValue=e=>applyTransformsToValue(a,e),e.set(r,s),t.delete(r),n.delete(r)}if(0===t.size)return e}return e}function parseReferences(e){if("string"!=typeof e)return[];if(-1===e.indexOf("{"))return[];const t=[];let n=!1,r=!1,o="";for(let a=0;a<e.length;a++){const s=e[a];switch(s){case"{":if(r)throw new Error('Unexpected "{" in "'+e+'" at '+a);o.length>0&&(t.push({type:"value-non-reference",value:o}),o=""),r=!0;break;case"}":if(!r)throw new Error('Unexpected "}" in "'+e+'" at '+a);if(0===o.length)throw new Error('Empty alias "{}" in "'+e+'" at '+a);{let e=o.trim();".value"===e.slice(-6)&&(e=e.slice(0,-6)),t.push({type:"value-reference",raw:e}),o=""}n=!0,r=!1;break;default:o+=s}}if(r)throw new Error('Unexpected end of alias in "'+e+'"');return o.length>0&&t.push({type:"value-non-reference",value:o}),n?t:[]}function extractTokens(e,t,n){const r=new Map;for(const o in e)if(Object.hasOwnProperty.call(e,o)){if(null===e[o]||"object"!=typeof e[o]||Array.isArray(e[o]))throw new Error(`Parsing error at "${[...t,o].join(".")}"`);const a=Object(e[o]);if(!a)throw new Error(`Parsing error at "${[...t,o].join(".")}"`);if(void 0!==a.value){const e=extractStyleDictionaryV3Token(a,o,t,n);r.set(e.metadata.path.join("."),e);continue}for(const[e,s]of extractTokens(a,[...t,o],n).entries())r.set(e,s)}return r}function extractStyleDictionaryV3Tokens(e,t){return dereferenceTokenValues(extractTokens(e,[],t))}function extractStyleDictionaryTokens(e,t,n){if("3"===e)return extractStyleDictionaryV3Tokens(t,n);throw new Error("Unsupported version: "+e)}const p="6b4e71e7-4787-42f7-a092-8684961895db",m=r.createRequire(import.meta.url);function parseImport(t){const n=e(t),r={filePath:"",format:"standard",conditions:[p]};return n.walk((e=>{"function"===e.type&&"url"===e.value&&(r.filePath=e.nodes[0].value),"function"===e.type&&"format"===e.value&&(r.format=e.nodes[0].value),"function"===e.type&&"when"===e.value&&(r.conditions=e.nodes.filter((e=>"string"===e.type)).map((e=>e.value)))})),r.conditions.length||(r.conditions=[p]),r}async function tokensFromImport(e,r,o,a){const{filePath:s,format:i,conditions:u}=parseImport(o);if(!u.every((t=>e.includes(t))))return!1;let l="";if(s.startsWith("node_modules://"))try{l=m.resolve(s.slice(15),{paths:[t.dirname(r)]})}catch(e){throw new Error(`Failed to read ${s} with error ${e.message}`)}else l=t.resolve(t.dirname(r),s);if(a.has(l))return!1;a.add(l);const c=await n.readFile(l,"utf8"),f=JSON.parse(c);if("style-dictionary3"===i)return{filePath:t.resolve(s),tokens:extractStyleDictionaryTokens("3",f,l)};throw new Error("Unsupported format: "+i)}function mergeTokens(e,t){const n=new Map(e);for(const[e,r]of t)n.set(e,r);return n}function parsePluginOptions(e){const t={importAtRuleName:"design-tokens",is:[p],unitsAndValues:{rootFontSize:16},valueFunctionName:"design-token"};return e?("object"!=typeof e||(Array.isArray(e.is)&&(t.is=e.is.filter((e=>"string"==typeof e))),0===t.is.length&&(t.is=[p]),"object"==typeof e.unitsAndValues&&"number"==typeof e.unitsAndValues.rootFontSize&&((n=e.unitsAndValues.rootFontSize)>0&&n!==1/0)&&(t.unitsAndValues.rootFontSize=e.unitsAndValues.rootFontSize),"string"==typeof e.valueFunctionName&&(t.valueFunctionName=e.valueFunctionName),"string"==typeof e.importAtRuleName&&(t.importAtRuleName=e.importAtRuleName)),t):t;var n}function parseComponentValuesFromTokens(e){return o(e,{onParseError:e=>{throw new Error(JSON.stringify(e))}})}function parseComponentValues(e){const t=l({css:e},{commentsAreTokens:!0,onParseError:e=>{throw new Error(JSON.stringify(e))}}),n=[];for(;!t.endOfFile();)n.push(t.nextToken());return n.push(t.nextToken()),parseComponentValuesFromTokens(n)}function transform(e,t,n,r,o){const a=parseComponentValues(r);let s=!1;return a.forEach(((r,i)=>{if("walk"in r){{const u=transformComponentValue(r,e,t,n,o);if(u)return a.splice(i,1,...u),s=!0,!1}r.walk(((r,a)=>{if("string"==typeof a)return;const i=transformComponentValue(r.node,e,t,n,o);return i?(r.parent.value.splice(a,1,...i),s=!0,!1):void 0}))}})),s?a.map((e=>e.toString())).join(""):r}function transformComponentValue(e,t,n,r,o){if(!a(e))return;if(e.nameTokenValue().toLowerCase()!==o.valueFunctionName)return;let l="",f="",p="";for(let t=0;t<e.value.length;t++){const n=e.value[t];if(!s(n)&&!i(n))if(l||!u(n)||n.value[0]!==c.String)if(l&&!f&&u(n)&&n.value[0]===c.Ident&&"to"===n.value[4].value.toLowerCase())f="to";else{if(!(l&&f&&u(n)&&n.value[0]===c.Ident))break;p=n.value[4].value}else l=n.value[4].value}if(!l)return void r.warn(n,"Expected at least a single string literal for the design-token function.");const m=t.get(l);if(!m)return void r.warn(n,`design-token: "${l}" is not configured.`);if(!f)return parseComponentValues(m.cssValue());const d={pluginOptions:o.unitsAndValues};if("to"===f){if(!p)return void r.warn(n,`Invalid or missing unit in "${e.toString()}"`);d.toUnit=p;try{return parseComponentValues(m.cssValue(d))}catch(e){return void r.warn(n,e.message)}}}const creator=e=>{const t=parsePluginOptions(e);return{postcssPlugin:"postcss-design-tokens",prepare(){let e=new Map,n=new Set;return{OnceExit(){e=new Map,n=new Set},Once:async(r,{result:o})=>{const a=[];r.walkAtRules((e=>{var n,r;if(e.name.toLowerCase()!==t.importAtRuleName)return;if(null==e||null==(n=e.source)||null==(r=n.input)||!r.file)return;const o=e.source.input.file,s=e.params;e.remove(),a.push({filePath:o,params:s,node:e})}));for(const r of a.values()){let a;try{if(a=await tokensFromImport(t.is,r.filePath,r.params,n),!a)continue}catch(e){r.node.warn(o,`Failed to import design tokens from "${r.params}" with error:\n\t`+e.message);continue}o.messages.push({type:"dependency",plugin:"postcss-design-tokens",file:a.filePath,parent:r.filePath}),e=mergeTokens(e,a.tokens)}},Declaration(n,{result:r}){if(n.value.toLowerCase().includes(t.valueFunctionName))try{const o=transform(e,r,n,n.value,t);if(o===n.value)return;n.value=o}catch(e){n.warn(r,`Failed to parse and transform "${n.value}"`)}},AtRule(n,{result:r}){if(n.params.toLowerCase().includes(t.valueFunctionName))try{const o=transform(e,r,n,n.params,t);if(o===n.params)return;n.params=o}catch(e){n.warn(r,`Failed to parse and transform "${n.params}"`)}}}}}};creator.postcss=!0;export{creator as default};