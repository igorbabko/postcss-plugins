const e=/\(\s*prefers-color-scheme\s*:\s*(dark|light)\s*\)/gi,s={dark:"48842621",light:"70318723"},prefersInterfaceColorDepthReplacer=(e,r)=>`(color: ${s[r.toLowerCase()]})`,creator=s=>{const r=Object.assign({preserve:!0},s);return{postcssPlugin:"postcss-prefers-color-scheme",AtRule:s=>{if("media"!==s.name.toLowerCase())return;const{params:o}=s,t=o.replace(e,prefersInterfaceColorDepthReplacer);o!==t&&(s.cloneBefore({params:t}),r.preserve||s.remove())}}};creator.postcss=!0;export{creator as default};