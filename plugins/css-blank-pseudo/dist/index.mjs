import e from"postcss-selector-parser";const s=[" ",">","~",":","+","@","#","(",")"];function isValidReplacement(e){let n=!0;for(let l=0,t=s.length;l<t&&n;l++)e.indexOf(s[l])>-1&&(n=!1);return n}const creator=s=>{const n=Object.assign({preserve:!0,replaceWith:"[blank]",disablePolyfillReadyClass:!1},s),l=e().astSync(n.replaceWith);return isValidReplacement(n.replaceWith)?{postcssPlugin:"css-blank-pseudo",Rule(s,{result:t}){if(!s.selector.toLowerCase().includes(":blank"))return;const o=s.selectors.flatMap((o=>{if(!o.toLowerCase().includes(":blank"))return[o];let a;try{a=e().astSync(o)}catch(e){return s.warn(t,`Failed to parse selector : "${o}" with message: "${e.message}"`),[o]}if(void 0===a)return[o];let r=!1;if(a.walkPseudos((e=>{":blank"===e.value.toLowerCase()&&(e.nodes&&e.nodes.length||(r=!0,e.replaceWith(l.clone({}))))})),!r)return[o];const i=a.clone();if(!n.disablePolyfillReadyClass){var c,d,u,p,f;if(null!=(c=a.nodes)&&null!=(d=c[0])&&null!=(u=d.nodes)&&u.length)for(let s=0;s<a.nodes[0].nodes.length;s++){const n=a.nodes[0].nodes[s];if("combinator"===n.type||e.isPseudoElement(n)){a.nodes[0].insertBefore(n,e.className({value:"js-blank-pseudo"}));break}if(s===a.nodes[0].nodes.length-1){a.nodes[0].append(e.className({value:"js-blank-pseudo"}));break}}null!=(p=a.nodes)&&null!=(f=p[0])&&f.nodes&&(i.nodes[0].prepend(e.combinator({value:" "})),i.nodes[0].prepend(e.className({value:"js-blank-pseudo"})))}return[a.toString(),i.toString()]}));o.join(",")!==s.selectors.join(",")&&(s.cloneBefore({selectors:o}),n.preserve||s.remove())}}:{postcssPlugin:"css-blank-pseudo",Once:(e,{result:s})=>{e.warn(s,`${n.replaceWith} is not a valid replacement since it can't be applied to single elements.`)}}};creator.postcss=!0;export{creator as default};