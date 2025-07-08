(()=>{var e={};e.id=276,e.ids=[276],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},5149:()=>{},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11457:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>v,routeModule:()=>m,serverHooks:()=>h,workAsyncStorage:()=>f,workUnitAsyncStorage:()=>g});var s={};r.r(s),r.d(s,{POST:()=>x});var n=r(64365),a=r(8890),i=r(43257),o=r(40220),u=r(19171),c=r(177);let l=()=>{let e=(0,c.UL)();return(0,u.createServerClient)("https://uifwchsfuywqlyhckvcy.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZndjaHNmdXl3cWx5aGNrdmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTI0NzAsImV4cCI6MjA2NzQ2ODQ3MH0.CwpoWdb0Cr9T6Q_f3yp1mJPepWeOtiXraSADP5vW0nk",{cookies:{getAll:()=>e.getAll(),setAll(t){try{t.forEach(({name:t,value:r,options:s})=>e.set(t,r,s))}catch{}}}})};async function p(e){let t=await fetch("https://api.mistral.ai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.MISTRAL_API_KEY}`},body:JSON.stringify({model:"mistral-large-latest",messages:[{role:"system",content:`Tu es DocIA, un assistant m\xe9dical intelligent et empathique du Douala General Hospital. 

IMPORTANT: Tu ne remplaces PAS un m\xe9decin. Toujours rappeler aux utilisateurs de consulter un professionnel de sant\xe9 pour un diagnostic ou traitement.

Tes capacit\xe9s:
- Fournir des informations m\xe9dicales g\xe9n\xe9rales fiables
- Expliquer les sympt\xf4mes, maladies et traitements courants
- Donner des conseils de pr\xe9vention et de bien-\xeatre
- R\xe9pondre aux questions sur les m\xe9dicaments (posologie, effets secondaires)
- Orienter vers les services appropri\xe9s du DGH

Sources d'information:
- Base de donn\xe9es m\xe9dicales valid\xe9es
- Recommandations de l'OMS
- Protocoles du Douala General Hospital
- API OpenFDA pour les informations sur les m\xe9dicaments
- Connaissances m\xe9dicales g\xe9n\xe9rales actualis\xe9es

Ton style:
- Empathique et rassurant
- Langage clair et accessible
- Culturellement sensible au contexte camerounais
- Toujours inclure un avertissement de non-diagnostic
- R\xe9pondre en fran\xe7ais ou anglais selon la langue de l'utilisateur

Domaines couverts:
- M\xe9decine g\xe9n\xe9rale
- P\xe9diatrie
- Gyn\xe9cologie
- Cardiologie
- Diab\xe9tologie
- Hypertension
- Maladies tropicales courantes
- Pr\xe9vention et hygi\xe8ne
- Nutrition et bien-\xeatre`},...e],temperature:.7,max_tokens:1e3})});if(!t.ok)throw Error("Erreur lors de l'appel \xe0 l'API Mistral");return t.json()}async function d(e){try{let t=await fetch(`https://api.fda.gov/drug/label.json?search=${encodeURIComponent(e)}&limit=1`);if(t.ok){let e=await t.json();return e.results?.[0]||null}}catch(e){console.error("Erreur OpenFDA:",e)}return null}async function x(e){try{let t=l(),{data:{user:r},error:s}=await t.auth.getUser();if(s||!r)return o.NextResponse.json({error:"Non autoris\xe9"},{status:401});let{messages:n,conversationId:a}=await e.json(),i=n[n.length-1],u=await d(i.content);u&&n.push({role:"system",content:`Informations compl\xe9mentaires FDA: ${JSON.stringify(u.openfda||{})}`});let c=(await p(n)).choices[0].message.content,x=`${c}

⚠️ **Avertissement important**: Ces informations sont fournies \xe0 titre \xe9ducatif uniquement et ne remplacent pas une consultation m\xe9dicale professionnelle. Consultez toujours un m\xe9decin du Douala General Hospital ou un professionnel de sant\xe9 qualifi\xe9 pour un diagnostic et un traitement appropri\xe9s.`;return a&&(await t.from("messages").insert({conversation_id:a,role:"user",content:i.content}),await t.from("messages").insert({conversation_id:a,role:"assistant",content:x}),await t.from("conversations").update({updated_at:new Date().toISOString()}).eq("id",a)),o.NextResponse.json({message:x,sources:u?["OpenFDA","Mistral AI","Base m\xe9dicale DocIA"]:["Mistral AI","Base m\xe9dicale DocIA"]})}catch(e){return console.error("Erreur API chat:",e),o.NextResponse.json({error:"Erreur interne du serveur"},{status:500})}}let m=new n.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"C:\\Users\\noxtheteenager\\Pictures\\DocIA-project\\app\\api\\chat\\route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:f,workUnitAsyncStorage:g,serverHooks:h}=m;function v(){return(0,i.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:g})}},11997:e=>{"use strict";e.exports=require("punycode")},23709:()=>{},27910:e=>{"use strict";e.exports=require("stream")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},34631:e=>{"use strict";e.exports=require("tls")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},45590:()=>{},52367:()=>{},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[242,698],()=>r(11457));module.exports=s})();