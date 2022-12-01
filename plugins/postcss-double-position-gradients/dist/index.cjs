"use strict";var e=require("@csstools/postcss-progressive-custom-properties"),t=require("postcss-value-parser");function includesGradientsFunction(e){return e.includes("conic-gradient(")||e.includes("linear-gradient(")||e.includes("radial-gradient(")||e.includes("repeating-conic-gradient(")||e.includes("repeating-linear-gradient(")||e.includes("repeating-radial-gradient(")}function hasSupportsAtRuleAncestor(e){let t=e.parent;for(;t;)if("atrule"===t.type){if("supports"===t.name.toLowerCase()&&includesGradientsFunction(t.params.toLowerCase()))return!0;t=t.parent}else t=t.parent;return!1}const r=["at","bottom","center","circle","closest-corner","closest-side","ellipse","farthest-corner","farthest-side","from","in","left","right","to","top"],isPunctuationCommaNode=e=>"div"===e.type&&","===e.value;function isNumericNode(e){try{return!1!==t.unit(null==e?void 0:e.value)}catch(e){return!1}}const basePlugin=e=>({postcssPlugin:"postcss-double-position-gradients",Declaration(s,{result:n}){if(!includesGradientsFunction(s.value.toLowerCase()))return;if(hasSupportsAtRuleAncestor(s))return;let i;try{i=t(s.value)}catch(e){s.warn(n,`Failed to parse value '${s.value}' as a CSS gradient. Leaving the original value intact.`)}if(void 0===i)return;i.walk((e=>{if("function"!==e.type||"conic-gradient"!==(t=e.value.toLowerCase())&&"linear-gradient"!==t&&"radial-gradient"!==t&&"repeating-conic-gradient"!==t&&"repeating-linear-gradient"!==t&&"repeating-radial-gradient"!==t)return;var t;const s=e.nodes.filter((e=>"comment"!==e.type&&"space"!==e.type));let n=!1;s.forEach(((t,s,i)=>{if("word"===t.type&&r.includes(t.value.toLowerCase())&&(n=!0),"div"===t.type&&","===t.value&&(n=!1),n)return;const o=Object(i[s-1]),a=Object(i[s-2]),c=Object(i[s+1]);if(a.type&&isNumericNode(o)&&isNumericNode(t)){const r=a,s={type:"div",value:",",before:isPunctuationCommaNode(c)?c.before:"",after:isPunctuationCommaNode(c)?"":" "};e.nodes.splice(e.nodes.indexOf(t)-1,0,s,r)}}))}));const o=i.toString();o!==s.value&&(s.cloneBefore({value:o}),e.preserve||s.remove())}});basePlugin.postcss=!0;const postcssPlugin=t=>{const r=Object.assign({enableProgressiveCustomProperties:!0,preserve:!0},t);return r.enableProgressiveCustomProperties&&r.preserve?{postcssPlugin:"postcss-double-position-gradients",plugins:[e(),basePlugin(r)]}:basePlugin(r)};postcssPlugin.postcss=!0,module.exports=postcssPlugin;