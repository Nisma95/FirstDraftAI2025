import{r as n,i as d,j as t,K as l,$ as o}from"./app-BIY-FsyL.js";import{c as s}from"./createLucideIcon-A2_eGBMh.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],u=s("Moon",i);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],m=s("Sun",g);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["polyline",{points:"16 11 18 13 22 9",key:"1pwet4"}]],k=s("UserCheck",h);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],y=s("User",p),j=()=>{const[e,a]=n.useState(localStorage.getItem("preferredLanguage")||"en");n.useEffect(()=>{d.changeLanguage(e),document.documentElement.lang=e,document.documentElement.dir=e==="ar"?"rtl":"ltr",localStorage.setItem("preferredLanguage",e)},[e]);const r=()=>{a(c=>c==="en"?"ar":"en")};return t.jsxs("div",{className:"language-switcher",style:{marginRight:e==="ar"?"15px":"10px"},children:[t.jsx("input",{type:"checkbox",id:"language-toggle",checked:e==="ar",onChange:r}),t.jsx("label",{id:"button",htmlFor:"language-toggle",children:t.jsx("div",{id:"knob",className:e})})]})};function b(){const[e,a]=n.useState(()=>localStorage.getItem("theme")==="dark");return n.useEffect(()=>{e?(document.documentElement.classList.add("dark"),localStorage.setItem("theme","dark")):(document.documentElement.classList.remove("dark"),localStorage.setItem("theme","light"))},[e]),t.jsx("button",{onClick:()=>a(!e),className:"w-12 h-12 rounded-full flex items-center justify-center p-4 mx-2 transition-all duration-300",style:{background:"linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",color:"#d4d3d3"},children:e?t.jsx(m,{size:20}):t.jsx(u,{size:20})})}function M(){const{auth:e}=l().props;return e.user?t.jsx(o,{href:route("logout"),method:"post",as:"button",className:"w-12 h-12 rounded-full flex items-center justify-center p-4 mx-2 transition-all duration-300",style:{background:"linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",color:"#d4d3d3"},children:t.jsx(k,{size:20})}):t.jsx(o,{href:route("login"),className:"w-12 h-12 rounded-full flex items-center justify-center p-4 mx-2 transition-all duration-300",style:{background:"linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",color:"#d4d3d3"},children:t.jsx(y,{size:20})})}export{M as A,j as L,b as M,y as U};
