if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,c)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let r={};const d=e=>n(e,o),a={module:{uri:o},exports:r,require:d};i[o]=Promise.all(s.map((e=>a[e]||d(e)))).then((e=>(c(...e),r)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/browser-BfLuwbhP.js",revision:null},{url:"assets/index-atpMbM55.css",revision:null},{url:"assets/index-CHXNG1ai.js",revision:null},{url:"index.html",revision:"6b2a6ba17e406150322176af43d34ab7"},{url:"registerSW.js",revision:"27a4276635aa4c22a3ea36c2a91421a5"},{url:"icons/icon-128x128.png",revision:"f6df46142883a89deabd0d1fe80a6e58"},{url:"icons/icon-144x144.png",revision:"bfdb719cee541ad12b8c77c7ce6eb72c"},{url:"icons/icon-152x152.png",revision:"aa6920efdbf911ae9447d2ea5bccbf5d"},{url:"icons/icon-192x192.png",revision:"e181bfb1d9e6c60b8b3d7c0d1b631d05"},{url:"icons/icon-384x384.png",revision:"4accb36f5a57932c1f2dcca06ccb4b61"},{url:"icons/icon-512x512.png",revision:"a2e30ea007750abb292e00030fe1ab1b"},{url:"icons/icon-72x72.png",revision:"8b0fc7669f7b0dcb3e8fd5836e410e97"},{url:"icons/icon-96x96.png",revision:"0a34e4b209dc53c72fa3f250a900de4a"},{url:"manifest.webmanifest",revision:"9727ff7dc5f4e8e215dfd4d857b8d1ef"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
