"use strict";var e=require("@csstools/postcss-progressive-custom-properties"),s=require("postcss-value-parser");function hasSupportsAtRuleAncestor(e){let s=e.parent;for(;s;)if("atrule"===s.type){if("supports"===s.name.toLowerCase()&&/\(font-size: \d+ic\)/.test(s.params.toLowerCase()))return!0;s=s.parent}else s=s.parent;return!1}const basePlugin=e=>({postcssPlugin:"postcss-ic-unit",Declaration(r){if(!r.value.toLowerCase().includes("ic"))return;if(hasSupportsAtRuleAncestor(r))return;const t=s(r.value);t.walk((e=>{if(!e.type||"word"!==e.type)return;const r=s.unit(e.value);r&&"ic"===r.unit.toLowerCase()&&(e.value=`${r.number}em`)}));const o=String(t);o!==r.value&&(r.cloneBefore({value:o}),e.preserve||r.remove())}});basePlugin.postcss=!0;const postcssPlugin=s=>{const r=Object.assign({preserve:!1,enableProgressiveCustomProperties:!0},s);return r.enableProgressiveCustomProperties&&r.preserve?{postcssPlugin:"postcss-ic-unit",plugins:[e(),basePlugin(r)]}:basePlugin(r)};postcssPlugin.postcss=!0,module.exports=postcssPlugin;