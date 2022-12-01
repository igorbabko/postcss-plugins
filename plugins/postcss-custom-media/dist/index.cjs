"use strict";var e=require("@csstools/css-tokenizer"),r=require("@csstools/media-query-list-parser");const t=new Set(["scope","container"]);function isProcessableCustomMediaRule(e){if("custom-media"!==e.name.toLowerCase())return!1;if(!e.params||!e.params.includes("--"))return!1;if(e.nodes&&e.nodes.length>0)return!1;let r=e.parent;for(;r;){if("atrule"===r.type&&!t.has(r.name.toLowerCase()))return!1;r=r.parent}return!0}function removeCyclicReferences(e,r){const t=new Set;let n=r;for(;e.size>0;)try{toposort(Array.from(e.keys()),n);break}catch(r){if(!r._graphNode)throw r;e.delete(r._graphNode),t.add(r._graphNode),n=n.filter((e=>-1===e.indexOf(r._graphNode)))}return t}function toposort(e,r){let t=e.length;const n=new Array(t),o={};let a=t;const s=makeOutgoingEdges(r),i=makeNodesHash(e);for(r.forEach((function(e){if(!i.has(e[0])||!i.has(e[1]))throw new Error("Unknown token. Make sure to provide all tokens used in aliases.")}));a--;)o[a]||visit(e[a],a,new Set);return n;function visit(e,r,a){if(a.has(e)){const r=new Error("Cyclic dependency"+JSON.stringify(e));throw r._graphNode=e,r}if(!i.has(e))throw new Error("Found unknown token. Make sure to provided all involved tokens. Unknown token: "+JSON.stringify(e));if(o[r])return;o[r]=!0;let u=s.get(e)||new Set;if(u=Array.from(u),r=u.length){a.add(e);do{const e=u[--r];visit(e,i.get(e),a)}while(r);a.delete(e)}n[--t]=e}}function makeOutgoingEdges(e){const r=new Map;for(let t=0,n=e.length;t<n;t++){const n=e[t];r.has(n[0])||r.set(n[0],new Set),r.has(n[1])||r.set(n[1],new Set),r.get(n[0]).add(n[1])}return r}function makeNodesHash(e){const r=new Map;for(let t=0,n=e.length;t<n;t++)r.set(e[t],t);return r}function atMediaParamsTokens(r){const t=e.tokenizer({css:r},{commentsAreTokens:!0,onParseError:()=>{throw new Error(`Unable to parse media query "${r}"`)}}),n=[];for(;!t.endOfFile();)n.push(t.nextToken());return n}const n=[[e.TokenType.Ident,"max-color",0,0,{value:"max-color"}],[e.TokenType.Colon,":",0,0,void 0],[e.TokenType.Number,"2147477350",0,0,{value:2147477350,type:e.NumberType.Integer}]],o=[[e.TokenType.Ident,"color",0,0,{value:"color"}],[e.TokenType.Colon,":",0,0,void 0],[e.TokenType.Number,"2147477350",0,0,{value:2147477350,type:e.NumberType.Integer}]];function replaceTrueAndFalseTokens(r){let t,a;for(let n=0;n<r.length;n++)if(r[n][0]!==e.TokenType.Comment&&r[n][0]!==e.TokenType.Whitespace){if(r[n][0]===e.TokenType.Ident){const e=r[n];if("true"===e[4].value.toLowerCase()){t="true",a=r.slice(n+1);break}if("false"===e[4].value.toLowerCase()){t="false",a=r.slice(n+1);break}}return r}if(!t)return r;for(let t=0;t<a.length;t++)if(a[t][0]!==e.TokenType.Comment&&a[t][0]!==e.TokenType.Whitespace)return r;return"true"===t?[[e.TokenType.Whitespace," ",0,0,void 0],[e.TokenType.OpenParen,"(",0,0,void 0],...n,[e.TokenType.CloseParen,")",0,0,void 0]]:[[e.TokenType.Whitespace," ",0,0,void 0],[e.TokenType.OpenParen,"(",0,0,void 0],...o,[e.TokenType.CloseParen,")",0,0,void 0]]}function parseCustomMedia(t){const n=atMediaParamsTokens(t),o=new Set;let a="",s=n;for(let r=0;r<n.length;r++)if(n[r][0]!==e.TokenType.Comment&&n[r][0]!==e.TokenType.Whitespace){if(n[r][0]===e.TokenType.Ident){const e=n[r];if(e[4].value.startsWith("--")){a=e[4].value,s=n.slice(r+1);break}}return!1}for(let r=0;r<s.length;r++)if(s[r][0]===e.TokenType.Ident){const e=s[r];e[4].value.startsWith("--")&&o.add(e[4].value)}s=replaceTrueAndFalseTokens(s);const i=r.parseFromTokens(e.cloneTokens(s),{preserveInvalidMediaQueries:!0,onParseError:()=>{throw new Error(`Unable to parse media query "${e.stringify(...s)}"`)}}),u=r.parseFromTokens(e.cloneTokens(s),{preserveInvalidMediaQueries:!0,onParseError:()=>{throw new Error(`Unable to parse media query "${e.stringify(...s)}"`)}});for(let e=0;e<u.length;e++)u[e]=u[e].negateQuery();return{name:a,truthy:i,falsy:u,dependsOn:Array.from(o).map((e=>[e,a]))}}function getCustomMedia(e,r,t){const n=new Map,o=[];e.walkAtRules((e=>{if(!isProcessableCustomMediaRule(e))return;const r=parseCustomMedia(e.params);if(r&&0!==r.truthy.length&&(n.set(r.name,{truthy:r.truthy,falsy:r.falsy}),o.push(...r.dependsOn),!t.preserve)){const r=e.parent;e.remove(),removeEmptyAncestorBlocks(r)}}));const a=removeCyclicReferences(n,o);for(const t of a.values())e.warn(r,`@custom-media rules have cyclic dependencies for "${t}"`);return n}function removeEmptyAncestorBlocks(e){let r=e;for(;r;){if(r.nodes&&r.nodes.length>0)return;const e=r.parent;r.remove(),r=e}}function transformAtMediaListTokens(e,t){const n=r.parse(e,{preserveInvalidMediaQueries:!0,onParseError:()=>{throw new Error(`Unable to parse media query "${e}"`)}}),o=n.map((e=>e.toString()));for(let e=0;e<n.length;e++){const r=n[e],a=o[e];{const n=transformSimpleMediaQuery(r,t);if(n&&n.replaceWith!==a)return o.map(((r,t)=>t===e?n:{replaceWith:r}))}const s=transformComplexMediaQuery(r,t);if(s&&0!==s.length&&s[0].replaceWith!==a)return o.flatMap(((r,t)=>t===e?s:[{replaceWith:r}]))}return[]}function transformSimpleMediaQuery(e,t){if(!mediaQueryIsSimple(e))return null;let n=null;return e.walk((e=>{const o=e.node;if(!r.isMediaFeatureBoolean(o))return;const a=o.getName();if(!a.startsWith("--"))return!1;const s=t.get(a);return s?(n={replaceWith:s.truthy.map((e=>e.toString().trim())).join(",")},!1):void 0})),n}function transformComplexMediaQuery(e,t){let a=[];return e.walk((s=>{const i=s.node;if(!r.isMediaFeatureBoolean(i))return;const u=s.parent;if(!r.isMediaFeature(u))return;const l=i.getName();if(!l.startsWith("--"))return!1;const p=t.get(l);if(p){if(1===p.truthy.length&&mediaQueryIsSimple(p.truthy[0])){let t=null;if(p.truthy[0].walk((e=>{if(r.isMediaFeature(e.node))return t=e.node,!1})),t&&t.feature)return u.feature=t.feature,a=[{replaceWith:e.toString()}],!1}const t=r.newMediaFeaturePlain(n[0][4].value,n[2]);u.feature=t.feature;const s=e.toString(),i=r.newMediaFeaturePlain(o[0][4].value,o[2]);u.feature=i.feature;const l=e.toString();return a=[{replaceWith:s,encapsulateWith:p.truthy.map((e=>e.toString().trim())).join(",")},{replaceWith:l,encapsulateWith:p.falsy.map((e=>e.toString().trim())).join(",")}],!1}})),a}function mediaQueryIsSimple(e){if(r.isMediaQueryInvalid(e))return!1;if(r.isMediaQueryWithType(e))return!1;let t=!0;return e.walk((e=>{if(r.isMediaAnd(e.node)||r.isMediaOr(e.node)||r.isMediaNot(e.node)||r.isMediaConditionList(e.node)||r.isGeneralEnclosed(e.node))return t=!1,!1})),t}const creator=e=>{const r=Boolean(Object(e).preserve);if("importFrom"in Object(e))throw new Error('[postcss-custom-media] "importFrom" is no longer supported');if("exportTo"in Object(e))throw new Error('[postcss-custom-media] "exportTo" is no longer supported');return{postcssPlugin:"postcss-custom-media",prepare(){let e=new Map;return{Once:(t,{result:n})=>{e=getCustomMedia(t,n,{preserve:r})},AtRule:(t,{result:n})=>{if("media"!==t.name.toLowerCase())return;if(!t.params)return;if(!t.params.includes("--"))return;let o=[];try{o=transformAtMediaListTokens(t.params,e)}catch(e){return void t.warn(n,`Failed to parse @custom-media params with error message: "${e.message}"`)}if(!o||0===o.length)return;if(1===o.length){if(t.params.trim()===o[0].replaceWith.trim())return;return t.cloneBefore({params:o[0].replaceWith.trim()}),r?void 0:void t.remove()}if(!!!o.find((e=>!!e.encapsulateWith)))return t.cloneBefore({params:o.map((e=>e.replaceWith)).join(",").trim()}),void(r||t.remove());o.forEach((e=>{if(!e.encapsulateWith)return void t.cloneBefore({params:e.replaceWith.trim()});const r=t.clone({params:e.replaceWith}),n=t.clone({params:e.encapsulateWith.trim(),nodes:[]});r.parent=null,n.parent=null,n.append(r),t.before(n)})),r||t.remove()}}}}};creator.postcss=!0,module.exports=creator;