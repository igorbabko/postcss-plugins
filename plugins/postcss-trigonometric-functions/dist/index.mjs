import e from"postcss-value-parser";import t from"vm";function radToDeg(e){return e*(180/Math.PI)}const n={turn:function turnToRad(e){return 2*e*Math.PI},deg:function degToRad(e){return e*(Math.PI/180)},grad:function gradToRad(e){return e*(Math.PI/200)}};function filterOnlyWords(e){return"word"===e.type}const r=["+","-","*","/"];var o;function isFiniteNumber(e){return!Number.isNaN(e)&&Number.isFinite(e)}function computeCalculation(u,i=!1){let a=!0;const s=[];if(u.filter((e=>"function"===e.type)).forEach((e=>{var t;if(!a)return;if(""!==e.value)return void(a=!1);const n=computeCalculation(e.nodes.slice(0),i),r=1===n.length,o=Number((null==(t=n[0])?void 0:t.value)||"");r&&"word"===n[0].type&&!Number.isNaN(o)?(functionNodeToWordNode(e),e.value=n[0].value):a=!1})),!a)return u;const l=u.filter((e=>"word"===e.type||r.includes(e.value)));let c=o.Number;const f=[];let m;const addToExpression=(e,t,n)=>{if(c===t){if(t===o.Number){const t=n||"";f.includes(t)||f.push({number:e,unit:t,index:s.length})}s.push(e),c=t===o.Number?o.Operation:o.Number}else a=!1};for(let t=0,u=l.length;t<u&&a;t++){const u=l[t];if(r.includes(u.value)){addToExpression(u.value,o.Operation);continue}if("pi"===u.value){addToExpression(Math.PI.toString(),o.Number);continue}if("e"===u.value){addToExpression(Math.E.toString(),o.Number);continue}const s=e.unit(u.value);if(!s){a=!1;break}if(i){if(m||(m=s.unit),m!==s.unit){a=!1;break}addToExpression(u.value,o.Operation)}else s.unit?"rad"!==s.unit&&"function"!=typeof n[s.unit]?a=!1:addToExpression(s.number,o.Number,s.unit):addToExpression(u.value,o.Number)}if(!a)return u;if(s.length%2==0||s.length<3)return u;let d;try{let e="";const r=new Set(f.map((e=>e.unit)));if(r.size>1)if(r.has("")){if(2!==r.size)throw new Error;[e]=Array.from(r).filter((e=>""!==e))}else f.forEach((e=>{if("rad"!==e.unit){const t=n[e.unit](Number(e.number));if(!isFiniteNumber(t))throw new Error;s[e.index]=t.toString()}}));const o=t.createContext({result:NaN});new t.Script(`result = ${s.join(" ")}`).runInContext(o),"number"==typeof o.result&&isFiniteNumber(o.result)&&(e&&(o.result=n[e](o.result)),isFiniteNumber(o.result)&&(d=o.result))}catch(e){}if(void 0!==d){let e=d.toString();m&&(e+=m);const t=u[0].sourceIndex,n=e.length;u.length=0,u.push({type:"word",value:e,sourceIndex:t,sourceEndIndex:n})}return u}function functionNodeToWordNode(e){delete e.nodes;const t=e;return t.type="word",t}function formatResultingNumber(e,t){if(!Number.isNaN(e)){if(e>Number.MAX_SAFE_INTEGER)return"infinity";if(e<Number.MIN_SAFE_INTEGER)return"-infinity"}return Number(e.toFixed(t)).toString()}function parseNumber(t){let n,r="";if("infinity"===t.toLowerCase()?n=1/0:"-infinity"===t.toLowerCase()?n=-1/0:"pi"===t?n=Math.PI:"e"===t&&(n=Math.E),!n){const o=e.unit(t);if(!o)return!1;n=Number(o.number),Number.isNaN(n)||(r=o.unit)}return{number:n,unit:r}}function validateNode(e,t=!0){e.nodes=computeCalculation(e.nodes);const r=e.nodes.filter(filterOnlyWords);if(1!==e.nodes.length||1!==r.length)return;const{value:o}=r[0],u=parseNumber(o);if(!u)return;let i=u.number;if(t){if(u.unit&&"rad"!==u.unit){if(!n[u.unit])return;i=n[u.unit](i)}}else if(u.unit)return;return[functionNodeToWordNode(e),i]}!function(e){e[e.Number=0]="Number",e[e.Operation=1]="Operation"}(o||(o={}));const u=[{check:"asin(",transform:function transformAsinFunction(t){const n=e(t.value);return n.walk((e=>{if("function"!==e.type||"asin"!==e.value.toLowerCase())return;const t=validateNode(e,!1);if(!t)return;const[n,r]=t;let o=Math.asin(r);Number.isNaN(o)||"number"!=typeof o||(o=`${formatResultingNumber(radToDeg(o),2)}deg`),n.value=o+""}),!0),n.toString()}},{check:"acos(",transform:function transformAcosFunction(t){const n=e(t.value);return n.walk((e=>{if("function"!==e.type||"acos"!==e.value.toLowerCase())return;const t=validateNode(e,!1);if(!t)return;const[n,r]=t;let o=Math.acos(r);Number.isNaN(o)||"number"!=typeof o||(o=`${formatResultingNumber(radToDeg(o),2)}deg`),n.value=o+""}),!0),n.toString()}},{check:"atan(",transform:function transformAtanFunction(t){const n=e(t.value);return n.walk((e=>{if("function"!==e.type||"atan"!==e.value.toLowerCase())return;const t=validateNode(e,!1);if(!t)return;const[n,r]=t;let o=Math.atan(r);Number.isNaN(o)||"number"!=typeof o||(o=`${formatResultingNumber(radToDeg(o),2)}deg`),n.value=o+""}),!0),n.toString()}},{check:"atan2(",transform:function transformAtan2Function(t){const n=e(t.value);return n.walk((e=>{if("function"!==e.type||"atan2"!==e.value.toLowerCase())return;const t=e.nodes.findIndex((e=>"div"===e.type&&","===e.value));if(t<0)return;let n=e.nodes.slice(0,t).filter(filterOnlyWords),r=e.nodes.slice(t+1).filter(filterOnlyWords);if(0===n.length||0===r.length)return;if(n.length>1&&(n=computeCalculation(n,!0)),r.length>1&&(r=computeCalculation(r,!0)),1!==n.length||1!==r.length)return;const o=parseNumber(n[0].value),u=parseNumber(r[0].value);if(!o||!u)return;if(o.unit!==u.unit)return;let i=Math.atan2(o.number,u.number);Number.isNaN(i)||"number"!=typeof i||(i=`${formatResultingNumber(radToDeg(i),2)}deg`);functionNodeToWordNode(e).value=i+""}),!0),n.toString()}},{check:"sin(",transform:function transformSinFunction(t){const n=e(t.value);return n.walk((e=>{if("function"!==e.type||"sin"!==e.value.toLowerCase())return;const t=validateNode(e);if(!t)return;const[n,r]=t;n.value=formatResultingNumber(Math.sin(r),5)}),!0),n.toString()}},{check:"cos(",transform:function transformCosFunction(t){const n=e(t.value);return n.walk((e=>{if("function"!==e.type||"cos"!==e.value.toLowerCase())return;const t=validateNode(e);if(!t)return;const[n,r]=t;n.value=formatResultingNumber(Math.cos(r),5)}),!0),n.toString()}},{check:"tan(",transform:function transformTanFunction(t){const n=e(t.value);return n.walk((e=>{if("function"!==e.type||"tan"!==e.value.toLowerCase())return;const t=validateNode(e);if(!t)return;const[n,r]=t,o=Number(formatResultingNumber(radToDeg(r),2)),u=o/90;n.value=o%90==0&&u%2!=0?u>0?"infinity":"-infinity":formatResultingNumber(Math.tan(r),5)}),!0),n.toString()}}],creator=e=>{const t=Object.assign({preserve:!1},e);return{postcssPlugin:"postcss-trigonometric-functions",Declaration(e){const n=u.filter((t=>e.value.toLowerCase().includes(t.check)));if(!e||0===n.length)return;const r=e.clone();n.forEach((e=>{const t=e.transform(r);t&&(r.value=t)})),e.value!==r.value&&(e.before(r),t.preserve||e.remove())}}};creator.postcss=!0;export{creator as default};