(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{141:function(e,n,a){"use strict";a.r(n),a.d(n,"frontMatter",(function(){return i})),a.d(n,"metadata",(function(){return c})),a.d(n,"rightToc",(function(){return p})),a.d(n,"default",(function(){return s}));var t=a(1),r=a(9),o=(a(0),a(175)),i={id:"continous_integration",title:"Continous Integration"},c={id:"continous_integration",title:"Continous Integration",description:"## Using Cantara in CI",source:"@site/docs/continous_integration.md",permalink:"/docs/continous_integration",editUrl:"https://github.com/CantaraJS/cantara/edit/master/docs/docs/continous_integration.md",sidebar:"main",previous:{title:"Publishing packages to NPM",permalink:"/docs/publish_to_npm"},next:{title:"Executing arbitrary commands for apps/packages",permalink:"/docs/execute_arbitrary_cmds"}},p=[{value:"Using Cantara in CI",id:"using-cantara-in-ci",children:[]},{value:"Re-build/deploy only changed parts of the repository",id:"re-builddeploy-only-changed-parts-of-the-repository",children:[]}],l={rightToc:p};function s(e){var n=e.components,a=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(t.a)({},l,a,{components:n,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"using-cantara-in-ci"},"Using Cantara in CI"),Object(o.b)("p",null,"On your local development machine you probably have Cantara installed globally. This is most likely not the case for your CI image. The recommended way of using Cantara is via ",Object(o.b)("inlineCode",{parentName:"p"},"npx"),", which is installed alongside ",Object(o.b)("inlineCode",{parentName:"p"},"npm")," (since version 5.2)."),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Example:")),Object(o.b)("pre",null,Object(o.b)("code",Object(t.a)({parentName:"pre"},{className:"language-bash"}),"npx cantara build my-react-app\nnpx cantara deploy my-serverless-api\n")),Object(o.b)("p",null,"To avoid unexpected breaking changes break your build, it is advised to specify a version number:"),Object(o.b)("pre",null,Object(o.b)("code",Object(t.a)({parentName:"pre"},{className:"language-bash"}),"npx cantara@0.5.1 build my-react-app\nnpx cantara@0.5.1 deploy my-serverless-api\n")),Object(o.b)("h2",{id:"re-builddeploy-only-changed-parts-of-the-repository"},"Re-build/deploy only changed parts of the repository"),Object(o.b)("p",null,"When deploying different parts of a monorepository, it is a commonly known problem that all parts of the application (the React app, the API, ecc.) need to be re-build and re-deployed, as it is hard to tell which parts changed. Thanks to Cantara's ",Object(o.b)("inlineCode",{parentName:"p"},"exec-changed")," command it is easy to re-build and deploy only the parts of the application which changed. This way, you can save precious CI time."),Object(o.b)("p",null,"The ",Object(o.b)("inlineCode",{parentName:"p"},"exec-changed")," works as folllows:"),Object(o.b)("pre",null,Object(o.b)("code",Object(t.a)({parentName:"pre"},{className:"language-bash"}),"ctra exec-changed <list> <command>\n")),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"list")," is a comma separated list of applications/packages."),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"command")," is the command you want to execute when one of the apps/packages specified in ",Object(o.b)("inlineCode",{parentName:"p"},"list")," changed."),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Example"),":\nAssuming you are developing a React app called ",Object(o.b)("inlineCode",{parentName:"p"},"admin-panel")," which makes use of a local package caled ",Object(o.b)("inlineCode",{parentName:"p"},"admin-ui"),", use this command to re-build the ",Object(o.b)("inlineCode",{parentName:"p"},"admin-panel")," React app only of it changed."),Object(o.b)("pre",null,Object(o.b)("code",Object(t.a)({parentName:"pre"},{className:"language-bash"}),"cantara exec-changed admin-panel,admin-ui cantara build admin-panel\n")),Object(o.b)("p",null,"You don't need to use cantara commands, e.g."),Object(o.b)("pre",null,Object(o.b)("code",Object(t.a)({parentName:"pre"},{className:"language-bash"}),"cantara exec-changed admin-panel,admin-ui npm run build:admin\n")),Object(o.b)("p",null,"Or even:"),Object(o.b)("pre",null,Object(o.b)("code",Object(t.a)({parentName:"pre"},{className:"language-bash"}),"cantara exec-changed admin-panel,admin-ui ./deploy-react-app.sh\n")))}s.isMDXComponent=!0},175:function(e,n,a){"use strict";a.d(n,"a",(function(){return b})),a.d(n,"b",(function(){return m}));var t=a(0),r=a.n(t);function o(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function i(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function c(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?i(Object(a),!0).forEach((function(n){o(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function p(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},o=Object.keys(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=r.a.createContext({}),s=function(e){var n=r.a.useContext(l),a=n;return e&&(a="function"==typeof e?e(n):c({},n,{},e)),a},b=function(e){var n=s(e.components);return r.a.createElement(l.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.a.createElement(r.a.Fragment,{},n)}},u=Object(t.forwardRef)((function(e,n){var a=e.components,t=e.mdxType,o=e.originalType,i=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),b=s(a),u=t,m=b["".concat(i,".").concat(u)]||b[u]||d[u]||o;return a?r.a.createElement(m,c({ref:n},l,{components:a})):r.a.createElement(m,c({ref:n},l))}));function m(e,n){var a=arguments,t=n&&n.mdxType;if("string"==typeof e||t){var o=a.length,i=new Array(o);i[0]=u;var c={};for(var p in n)hasOwnProperty.call(n,p)&&(c[p]=n[p]);c.originalType=e,c.mdxType="string"==typeof e?e:t,i[1]=c;for(var l=2;l<o;l++)i[l]=a[l];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,a)}u.displayName="MDXCreateElement"}}]);