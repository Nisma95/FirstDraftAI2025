import{r as a,j as t,i as s}from"./app-Q2KDsHL9.js";import{c as o}from"./createLucideIcon-BBISsQlN.js";import"./StarBackground-g68PfVH5.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],l=o("Moon",d);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],i=o("Sun",g);function p(){const[e,n]=a.useState(()=>localStorage.getItem("theme")==="dark");return a.useEffect(()=>{e?(document.documentElement.classList.add("dark"),localStorage.setItem("theme","dark")):(document.documentElement.classList.remove("dark"),localStorage.setItem("theme","light"))},[e]),t.jsx("button",{onClick:()=>n(!e),className:"w-12 h-12 rounded-full flex items-center justify-center p-4 mx-2 transition-all duration-300",style:{background:"linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",color:"#d4d3d3"},children:e?t.jsx(i,{size:20}):t.jsx(l,{size:20})})}const k=()=>{const[e,n]=a.useState(localStorage.getItem("preferredLanguage")||"en");a.useEffect(()=>{s.changeLanguage(e),document.documentElement.lang=e,document.documentElement.dir=e==="ar"?"rtl":"ltr",localStorage.setItem("preferredLanguage",e)},[e]);const r=()=>{n(c=>c==="en"?"ar":"en")};return t.jsxs("div",{className:"language-switcher",style:{marginRight:e==="ar"?"15px":"0"},children:[t.jsx("input",{type:"checkbox",id:"language-toggle",checked:e==="ar",onChange:r}),t.jsx("label",{id:"button",htmlFor:"language-toggle",children:t.jsx("div",{id:"knob",className:e})})]})};export{k as L,p as M};
