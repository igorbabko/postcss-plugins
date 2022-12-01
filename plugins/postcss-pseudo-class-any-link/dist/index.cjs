"use strict";var e=require("postcss-selector-parser");const t=e().astSync(":link").nodes[0],s=e().astSync(":visited").nodes[0],n=e().astSync("area[href]").nodes[0],o=e().astSync("[href]").nodes[0];function replaceAnyLink(e,t,s,n){const o=[],r=[];try{for(let t=0;t<e.selectors.length;t++){const s=e.selectors[t],l=modifiedSelector(s,n);l.length?o.push(...l):r.push(s)}}catch(s){return void e.warn(t,`Failed to parse selector : "${e.selector}" with message: "${s.message}"`)}o.length&&(e.cloneBefore({selectors:o}),r.length&&e.cloneBefore({selectors:r}),s||e.remove())}function modifiedSelector(r,l){const c=[];return e((e=>{const r=[];if(e.walkPseudos((e=>{if(":any-link"!==e.value.toLowerCase()||e.nodes&&e.nodes.length)return;if(!l)return void r.push([t.clone({}),s.clone({})]);const c=getTagElementsNextToPseudo(e);c.includes("area")?r.push([t.clone({}),s.clone({}),o.clone({})]):c.length?r.push([t.clone({}),s.clone({})]):r.push([t.clone({}),s.clone({}),n.clone({})])})),!r.length)return;cartesianProduct(...r).forEach((t=>{const s=e.clone({});s.walkPseudos((e=>{":any-link"!==e.value.toLowerCase()||e.nodes&&e.nodes.length||(insertNode(e.parent,e,t.shift()),e.remove())})),c.push(s.toString())}))})).processSync(r),c}function cartesianProduct(...e){const t=[],s=e.length-1;return function helper(n,o){for(let r=0,l=e[o].length;r<l;r++){const l=n.slice(0);l.push(e[o][r]),o==s?t.push(l):helper(l,o+1)}}([],0),t}function getTagElementsNextToPseudo(t){const s=[];let n=t.prev();for(;n&&"combinator"!==n.type&&!e.isPseudoElement(n);)"tag"===n.type&&s.push(n.value.toLowerCase()),n=n.prev();let o=t.next();for(;o&&"combinator"!==o.type&&!e.isPseudoElement(o);)"tag"===o.type&&s.push(o.value.toLowerCase()),o=o.next();return s}function insertNode(t,s,n){let o=n.type;"selector"===n.type&&n.nodes&&n.nodes.length&&(o=n.nodes[0].type);let r=-1,l=-1;const c=t.index(s);for(let s=c;s>=0&&("combinator"!==t.nodes[s].type&&!e.isPseudoElement(t.nodes[s].type));s--)r=s;if("tag"!==o){for(let s=c;s<t.nodes.length&&("combinator"!==t.nodes[s].type&&!e.isPseudoElement(t.nodes[s].type));s++)l=s;for(let e=r;e<=l;e++)if(t.nodes[e].type===o)return void t.insertAfter(t.at(e),n);t.insertAfter(t.at(r),n)}else t.insertBefore(t.at(r),n)}const creator=e=>{const t={preserve:!0,...e},s={areaHrefNeedsFixing:!1,...Object(t.subFeatures)};return{postcssPlugin:"postcss-pseudo-class-any-link",Rule(e,{result:n}){if(!e.selector.toLowerCase().includes(":any-link"))return;(e.raws.selector&&e.raws.selector.raw||e.selector).endsWith(":")||replaceAnyLink(e,n,t.preserve,s.areaHrefNeedsFixing)}}};creator.postcss=!0,module.exports=creator;