"use strict";var e=require("@csstools/postcss-progressive-custom-properties"),o=require("postcss-value-parser");function colorStopList(e,t){const n=[];let r={color:"",colorStopLength:"",colorHintBetween:[],nodes:[]};for(let o=0;o<e.length;o++){const t=e[o];"div"!==t.type||","!==t.value?r.nodes.push(t):(n.push(r),r={color:"",colorStopLength:"",colorHintBetween:[],nodes:[]})}n.push(r);const s=[];for(let e=0;e<n.length;e++){const t=n[e];switch(t.nodes.length){case 0:break;case 1:return!1;case 2:t.color=o.stringify(t.nodes[0]),t.colorStopLength=o.stringify(t.nodes[1]),s.push(t);break;case 3:s.push({color:o.stringify(t.nodes[0]),colorStopLength:o.stringify(t.nodes[1]),colorHintBetween:[],nodes:[t.nodes[0],t.nodes[1]]}),s.push({color:o.stringify(t.nodes[0]),colorStopLength:o.stringify(t.nodes[2]),colorHintBetween:[],nodes:[t.nodes[0],t.nodes[2]]})}}for(let e=0;e<s.length;e++){const o=s[e];o.color||(o.color=`color-mix(in ${t}, ${s[e-1].color} 50%, ${s[e+1].color} 50%)`,o.colorHintBetween=[s[e-1],s[e+1]])}return s}function includesGradientsFunction(e){return e.includes("in ")&&(e.includes("conic-gradient(")||e.includes("linear-gradient(")||e.includes("radial-gradient(")||e.includes("repeating-conic-gradient(")||e.includes("repeating-linear-gradient(")||e.includes("repeating-radial-gradient("))}function hasSupportsAtRuleAncestor(e){let o=e.parent;for(;o;)if("atrule"===o.type){if("supports"===o.name&&includesGradientsFunction(o.params))return!0;o=o.parent}else o=o.parent;return!1}const t=["shorter","longer","increasing","decreasing","specified"],basePlugin=e=>({postcssPlugin:"postcss-gradients-interpolation-method",Declaration(n,{result:r}){if(!includesGradientsFunction(n.value))return;if(hasSupportsAtRuleAncestor(n))return;let s;try{s=o(n.value)}catch(e){n.warn(r,`Failed to parse value '${n.value}' as a CSS gradient. Leaving the original value intact.`)}if(void 0===s)return;let i=!1;if(s.walk((e=>{if("function"!==e.type||"conic-gradient"!==(n=e.value)&&"linear-gradient"!==n&&"radial-gradient"!==n&&"repeating-conic-gradient"!==n&&"repeating-linear-gradient"!==n&&"repeating-radial-gradient"!==n)return;var n;const r=e.nodes.filter((e=>"comment"!==e.type&&"space"!==e.type)),s={interpolationArguments:[],argumentsRemainder:[],colorStops:[]};for(let e=0;e<r.length;e++){const n=r[e];if("div"===n.type&&","===n.value){const t=s.interpolationArguments.map((e=>o.stringify(e))).join(" "),n=colorStopList(r.slice(e),t);if(n){s.colorStops=n;break}t&&(i=!0);break}if("word"===n.type&&"in"===n.value&&r[e+1]){if(s.interpolationArguments.push(r[e+1]),e++,r[e+1]&&"word"===r[e+1].type&&t.includes(r[e+1].value)){s.interpolationArguments.push(r[e+1]),e++;continue}}else s.argumentsRemainder.push(n)}if(!s.interpolationArguments.length||!s.colorStops.length)return;e.nodes=[],s.argumentsRemainder.length&&(e.nodes.push(...s.argumentsRemainder.flatMap((e=>[e,{type:"space",value:" "}]))),e.nodes.push({type:"div",value:","}));const l=s.interpolationArguments.map((e=>o.stringify(e))).join(" ");for(let t=0;t<s.colorStops.length;t++){const n=s.colorStops[t],r=s.colorStops[t+1];if(r)if(n.color!==r.color)for(let t=0;t<10;t++){if(0===t){e.nodes.push(o(`${n.color} ${n.colorStopLength}`),{type:"div",value:","});continue}const s=`color-mix(in ${l}, ${n.color} ${100-10*t}%, ${r.color} ${10*t}%)`,i=`calc(${n.colorStopLength} + ((${r.colorStopLength} - ${n.colorStopLength}) * ${t/10}))`;e.nodes.push(o(`${s} ${i}`),{type:"div",value:","})}else e.nodes.push(o(`${n.color} ${n.colorStopLength}`),{type:"div",value:","});else e.nodes.push(o(`${n.color} ${n.colorStopLength}`))}})),i)return void n.warn(r,`Failed to parse value '${n.value}' as a CSS gradient with interpolation. Leaving the original value intact.`);const l=o.stringify(s);l!==n.value&&(e.preserve?n.cloneBefore({prop:n.prop,value:l}):n.value=l)}});basePlugin.postcss=!0;const postcssPlugin=o=>{const t=Object.assign({enableProgressiveCustomProperties:!0,preserve:!0},o);return t.enableProgressiveCustomProperties&&t.preserve?{postcssPlugin:"postcss-gradients-interpolation-method",plugins:[e(),basePlugin(t)]}:basePlugin(t)};postcssPlugin.postcss=!0,module.exports=postcssPlugin;