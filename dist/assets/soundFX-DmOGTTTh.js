var z=Object.defineProperty;var I=(t,e,o)=>e in t?z(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o;var C=(t,e,o)=>I(t,typeof e!="symbol"?e+"":e,o);import{j as s,r as a}from"./index-yJ48V1Ip.js";const U=({children:t,className:e=""})=>s.jsxs("div",{className:`relative technical-grid ${e}`,children:[s.jsxs("div",{className:"pointer-events-none absolute inset-0 z-0 overflow-hidden",children:[s.jsx("div",{className:"absolute top-4 left-6 font-mono text-[10px] text-white/15 tracking-widest uppercase select-none",children:"SYS_COORD // 42.3601° N, 71.0942° W"}),s.jsx("div",{className:"absolute top-4 right-6 font-mono text-[10px] text-white/15 tracking-widest uppercase select-none",children:"TICKETER_V0.1.0 // DISPATCH_READY"}),s.jsx("div",{className:"absolute bottom-4 left-6 font-mono text-[10px] text-white/15 tracking-widest uppercase select-none",children:"TENANT_ISOLATION // ACTIVE"}),s.jsx("div",{className:"absolute bottom-4 right-6 font-mono text-[10px] text-white/15 tracking-widest uppercase select-none",children:"BUFFER_STATE // DETERMINISTIC"}),s.jsx("div",{className:"absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20"}),s.jsx("div",{className:"absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20"}),s.jsx("div",{className:"absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20"}),s.jsx("div",{className:"absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20"})]}),s.jsx("div",{className:"relative z-10",children:t})]});/**
 * @license lucide-react v1.52.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=t=>t==null?void 0:t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.52.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function W(t,e,o=[]){if(e==null)throw new Error("[lucide]: iconNode is required when icon name is used");return{name:V(t),size:24,node:e,...o.length>0?{aliases:o}:{}}}/**
 * @license lucide-react v1.52.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=t=>{let e="",o=!1;for(const n of t){if(n==="-"||n==="_"||n<=" "){o=e.length>0;continue}e.length===0?e+=n.toLowerCase():e+=o?n.toUpperCase():n,o=!1}return e};/**
 * @license lucide-react v1.52.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=t=>{const e=L(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.52.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=(...t)=>t.filter((e,o,n)=>!!e&&e.trim()!==""&&n.indexOf(e)===o).join(" ").trim();/**
 * @license lucide-react v1.52.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-react v1.52.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function A(t){return t!=null}function q(t,e={}){var b,x;const o=e.attributeNames??{},n=i=>o[i]??i,l=t.size??t.width??c.width,h=t.size??t.height??c.height,m=((b=t.aliases)==null?void 0:b.filter(i=>typeof i=="string"&&i.trim()!=="").map(i=>`lucide-${i}`))??[],f=[...t.name?[`lucide-${t.name}`]:[],...m],r=((x=e.className)==null?void 0:x.split(" ").filter(Boolean))??[],w=e.includeDefaultClasses===!1?N(...r):N("lucide",...f,...r),p=e.absoluteStrokeWidth?Number(e.strokeWidth??c["stroke-width"])*Number(t.size??t.width??c.width)/Number(e.size??e.width??c.width):e.strokeWidth??c["stroke-width"];return["svg",{...Object.entries(c).reduce((i,[u,d])=>(i[n(u)]=d,i),{}),..."color"in e&&e.color&&{[n("stroke")]:e.color},..."size"in e&&A(e.size)&&{[n("width")]:e.size,[n("height")]:e.size},..."width"in e&&A(e.width)&&{[n("width")]:e.width},..."height"in e&&A(e.height)&&{[n("height")]:e.height},[n("stroke-width")]:p,...w&&{[n("class")]:w},[n("viewBox")]:`0 0 ${l} ${h}`,...e.hasA11yProp===!1?{[n("aria-hidden")]:"true"}:{},..."attributes"in e&&e.attributes},t.node.map(i=>{const[u,d,g]=i,T=e.nonScalingStroke?{[n("vector-effect")]:"non-scaling-stroke",...d}:d;return g?[u,T,g]:[u,T]})]}/**
 * @license lucide-react v1.52.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function O(t,e={}){return q(t,{...e,attributeNames:{...e.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}/**
 * @license lucide-react v1.52.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},$=a.createContext({}),D=()=>a.useContext($),F=a.forwardRef(({color:t,size:e,width:o,height:n,strokeWidth:l,absoluteStrokeWidth:h,nonScalingStroke:m,className:f="",children:r,iconNode:w=[],icon:p={node:w,aliases:[],size:24},...k},b)=>{const{size:x=24,strokeWidth:i=2,absoluteStrokeWidth:u=!1,nonScalingStroke:d=!1,color:g="currentColor",className:T=""}=D()??{},v=!!r||P(k),[y,S,j=[]]=O(p,{color:t??g,width:o??e??x,height:n??e??x,strokeWidth:l??i,absoluteStrokeWidth:h??u,nonScalingStroke:m??d,className:N(T,f),hasA11yProp:v,attributes:k});return a.createElement(y,{ref:b,...S},[...j.map(([E,R])=>a.createElement(E,R)),...Array.isArray(r)?r:[r]])});/**
 * @license lucide-react v1.52.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */function K(t,e=[],o=[]){const n=typeof t=="string"?W(t,e,o):t,l=a.forwardRef(({className:h,...m},f)=>a.createElement(F,{ref:f,icon:n,className:h,...m}));return n.name&&(l.displayName=B(n.name)),l}class _{constructor(){C(this,"ctx",null);C(this,"enabled",!1)}getContext(){if(!this.enabled)return null;if(!this.ctx&&typeof window<"u"){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}return this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}toggle(){return this.enabled=!this.enabled,this.enabled&&this.playTick(),this.enabled}playTick(){const e=this.getContext();if(e)try{const o=e.createOscillator(),n=e.createGain();o.type="triangle",o.frequency.setValueAtTime(800,e.currentTime),o.frequency.exponentialRampToValueAtTime(240,e.currentTime+.04),n.gain.setValueAtTime(.08,e.currentTime),n.gain.exponentialRampToValueAtTime(.001,e.currentTime+.04),o.connect(n),n.connect(e.destination),o.start(),o.stop(e.currentTime+.04)}catch{}}playPunch(){const e=this.getContext();if(e)try{const o=e.createOscillator(),n=e.createGain();o.type="sine",o.frequency.setValueAtTime(220,e.currentTime),o.frequency.exponentialRampToValueAtTime(55,e.currentTime+.08),n.gain.setValueAtTime(.18,e.currentTime),n.gain.exponentialRampToValueAtTime(.001,e.currentTime+.08),o.connect(n),n.connect(e.destination),o.start(),o.stop(e.currentTime+.08)}catch{}}playBump(){const e=this.getContext();if(e)try{const o=e.createOscillator(),n=e.createGain();o.type="sawtooth",o.frequency.setValueAtTime(140,e.currentTime),o.frequency.linearRampToValueAtTime(320,e.currentTime+.09),n.gain.setValueAtTime(.1,e.currentTime),n.gain.exponentialRampToValueAtTime(.001,e.currentTime+.12),o.connect(n),n.connect(e.destination),o.start(),o.stop(e.currentTime+.12)}catch{}}}const X=new _;export{U as H,K as c,X as s};
