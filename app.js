/* SchemeLens – app logic. Needs data.js (T, S, C, A, LI). */
Object.assign(T.en,{tDisc:"Discover",tVoice:"Voice",tWa:"WhatsApp",tDocs:"Documents",tTrack:"Tracker",tag:"Look closer. Find every benefit you deserve."});
Object.assign(T.ta,{tDisc:"கண்டறி",tVoice:"குரல்",tWa:"வாட்ஸ்அப்",tDocs:"ஆவணங்கள்",tTrack:"கண்காணிப்பு",tag:"கூர்ந்து பாருங்கள். உங்களுக்கான ஒவ்வொரு நன்மையையும் கண்டறியுங்கள்."});
Object.assign(T.hi,{tDisc:"खोजें",tVoice:"आवाज़",tWa:"व्हाट्सऐप",tDocs:"दस्तावेज़",tTrack:"ट्रैकर",tag:"गौर से देखें। अपना हर लाभ पाएँ।"});
Object.assign(T.en,{dis:"Person with disability",min:"Minority community",wid:"Widow",preg:"Pregnant / lactating mother"});
Object.assign(T.ta,{dis:"மாற்றுத்திறனாளி",min:"சிறுபான்மை சமூகம்",wid:"விதவை",preg:"கர்ப்பிணி / பாலூட்டும் தாய்"});
Object.assign(T.hi,{dis:"दिव्यांग",min:"अल्पसंख्यक समुदाय",wid:"विधवा",preg:"गर्भवती / स्तनपान कराने वाली"});
const EM={pmkisan:"🌾",pmjay:"🏥",ujjwala:"🔥",psms:"🎓",pmay:"🏠",apy:"👴",pmsby:"🛡️",ssy:"👧",mudra:"💼",nsap:"👵",vish:"🛠️",mgnrega:"⛏️",standup:"🚀",pudhumai:"📚",magalir:"💰"};
const LANG={en:"en-IN",ta:"ta-IN",hi:"hi-IN"};
let L="en",last=null,botRes=[];
const $=i=>document.getElementById(i),g=i=>$(i).value,c=i=>$(i).checked;
const tt=k=>(T[L]&&T[L][k])||T.en[k]||k;
const sch=id=>S.find(s=>s.id==id);
const em=id=>(sch(id)||{}).e||EM[id]||"📄";

/* ---------- common UI ---------- */
function setL(l){L=l;document.documentElement.lang=l;["en","ta","hi"].forEach(x=>$("l-"+x).classList.toggle("on",x==l));
 document.querySelectorAll("[data-i]").forEach(e=>{const v=T[l][e.dataset.i];if(v)e.textContent=v});if(last)render()}
function toggleTheme(){const d=document.documentElement.dataset.theme=="light"?"dark":"light";document.documentElement.dataset.theme=d;$("themeBtn").textContent=d=="light"?"🌙":"☀️"}
function showTab(n){document.querySelectorAll(".tab").forEach(t=>t.hidden=t.id!="tab-"+n);document.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("on",b.dataset.tab==n));scrollTo({top:0,behavior:"smooth"})}

/* ---------- eligibility engine (same for web, voice, WhatsApp) ---------- */
function evaluate(p){
 const res=S.map(s=>{const r=s.r.map(([t,f])=>[t,!!f(p)]);const ok=r.filter(x=>x[1]).length;return{s,r,ok,n:r.length}});
 return{elig:res.filter(x=>x.ok==x.n).sort((a,b)=>b.s.w-a.s.w),
  near:res.filter(x=>x.ok==x.n-1&&x.ok>=1).sort((a,b)=>b.s.w*b.ok/b.n-a.s.w*a.ok/a.n).slice(0,4)}}
const profile=()=>({age:+g("age"),gender:g("gender"),state:g("state"),area:g("area"),inc:+g("inc"),occ:g("occ"),cat:g("cat"),bpl:c("bpl"),house:c("house"),girl:c("girl"),tax:c("tax"),dis:c("dis"),min:c("min"),wid:c("wid"),preg:c("preg")});
function sample(){const v={age:20,inc:180000,gender:"Female",occ:"student",cat:"SC",state:"Tamil Nadu",area:"rural"};
 for(const k in v)$(k).value=v[k];$("bpl").checked=true;["house","girl","tax","dis","min","wid","preg"].forEach(k=>$(k).checked=false);run()}
function run(cb){
 if(g("age")===""||g("inc")===""){$("out").innerHTML='<div class="warn">'+tt("need")+'</div>';return}
 last=evaluate(profile());
 document.querySelectorAll("#flow span").forEach((e,i)=>{e.classList.remove("on");setTimeout(()=>e.classList.add("on"),i*180)});
 setTimeout(()=>{render();if(typeof cb=="function")cb()},6*180)}
function ring(p){const C=2*Math.PI*22;return `<svg class="ring" viewBox="0 0 56 56"><circle class="bg" cx="28" cy="28" r="22"/><circle class="fg" cx="28" cy="28" r="22" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C*(1-p/100)).toFixed(1)}"/><text x="28" y="32">${p}%</text></svg>`}
function card(x,i,near){
 const{s,r,ok,n}=x,pct=Math.round(ok/n*100);
 const why=near?`You meet ${ok} of ${n} conditions. Missing: `+r.filter(y=>!y[1]).map(y=>y[0]).join("; "):`You meet all ${n} condition${n>1?"s":""}.`;
 return `<article class="sc" style="--h:${S.indexOf(s)*24};animation-delay:${i*60}ms"><div class="top"><div class="ic">${em(s.id)}</div><div class="bd"><h3>${s.n}</h3><div class="ben">${s.b}</div></div>${ring(pct)}</div>
 <div class="why">${why}</div>${dlLine(s)}<ul class="chk">${r.map(y=>`<li class="${y[1]?"":"f"}">${y[0]}</li>`).join("")}</ul>
 <details><summary>${tt("docs")} · ${tt("steps")} · ${tt("dl")}</summary><strong>${tt("docs")}</strong><ul>${s.d.map(d=>"<li>"+d+"</li>").join("")}</ul>
 <strong>${tt("steps")}</strong><ol>${s.s.map(d=>"<li>"+d+"</li>").join("")}</ol><span class="dl">⏰ ${tt("dl")}: ${s.dl}</span></details>
 <div class="acts"><button onclick="track('${s.id}')">📌 Track</button><button onclick="goDocs('${s.id}')">📄 Verify documents</button></div></article>`}
function render(){
 if(!last)return;const{elig,near}=last,ids=elig.map(x=>x.s.id);
 let h=`<div class="tiles"><div class="tile"><b>${elig.length}</b><span>${tt("elig")}</span></div><div class="tile"><b>${near.length}</b><span>${tt("near")}</span></div><div class="tile"><b>${S.length}</b><span>Schemes scanned</span></div></div>
 <div class="hd"><h2>${tt("elig")} (${elig.length})</h2><button class="s" onclick="shareWa()">💬 Share on WhatsApp</button></div>`;
 h+=elig.length?elig.map((x,i)=>card(x,i,false)).join(""):`<div class="empty">${tt("none")}</div>`;
 const cf=C.filter(([a,b])=>ids.includes(a)&&ids.includes(b));
 if(cf.length)h+=`<div class="hd"><h2>⚠️ ${tt("conf")}</h2></div><div class="conf"><ul>${cf.map(([a,b,m])=>`<li><strong>${sch(a).n} + ${sch(b).n}:</strong> ${m}</li>`).join("")}</ul></div>`;
 if(near.length)h+=`<div class="hd"><h2>${tt("near")}</h2></div>`+near.map((x,i)=>card(x,i,true)).join("");
 $("out").innerHTML=h;renderUpcoming();
 $("vres").innerHTML=elig.length?`<h2>${tt("elig")} (${elig.length})</h2>`+elig.slice(0,8).map(x=>`<div class="vr">${em(x.s.id)} <b>${x.s.n}</b> – ${x.s.b}</div>`).join("")+`<button class="mini" onclick="showTab('disc')">Open full results →</button>`:`<div class="vr">${tt("none")}</div>`}
const waText=e=>`*SchemeLens* – ${e.elig.length} scheme(s) you may be eligible for:\n`+e.elig.slice(0,8).map((x,i)=>`${i+1}. *${x.s.n}* – ${x.s.b}`).join("\n")+"\n\nPlease verify on the official portal before applying.";
function shareWa(){if(!last)return alert("Find your schemes first.");open("https://wa.me/?text="+encodeURIComponent(waText(last)),"_blank")}

/* ---------- 1. Voice-based scheme search ---------- */
const OCC=[["farmer",/farmer|agricultur|விவசாய|किसान/],["student",/student|college|மாணவ|छात्र|विद्यार्थी/],["self",/self.?employed|business|shop|தொழில்|व्यापार|दुकान/],["artisan",/artisan|craft|potter|weaver|carpenter|கைவினை|कारीगर/],["unemployed",/unemployed|jobless|வேலை இல்லை|बेरोजगार/],["homemaker",/homemaker|housewife|இல்லத்தரசி|गृहिणी/],["retired",/retired|pension(?:er)?|ஓய்வு|सेवानिवृत्त/],["salaried",/salaried|employee|ஊழியர்|नौकरी/]];
function parse(t){t=t.toLowerCase();const o={};let m;
 if(m=t.match(/(\d{1,3})\s*(?:years?|yrs?|வயது|साल|वर्ष)/)||t.match(/(?:age|aged|வயது|आयु)\D{0,6}(\d{1,3})/))o.age=+m[1];
 if(m=t.match(/(\d+(?:\.\d+)?)\s*(?:lakhs?|லட்சம்|लाख)/))o.inc=Math.round(m[1]*1e5);
 else if(m=t.match(/(?:income|salary|earn\w*|வருமானம்|आय)\D{0,14}?(\d[\d,]{3,})/)||t.match(/(\d[\d,]{4,})\s*(?:rupees|rs|₹)/))o.inc=+m[1].replace(/,/g,"");
 if(/\b(woman|women|female|girl|lady)\b|பெண்|महिला|लड़की/.test(t))o.gender="Female";else if(/\b(man|male|boy)\b|ஆண்|पुरुष|लड़का/.test(t))o.gender="Male";
 for(const[k,re]of OCC)if(re.test(t)){o.occ=k;break}
 if(/\bsc\b/.test(t))o.cat="SC";else if(/\bst\b/.test(t))o.cat="ST";else if(/\bobc\b/.test(t))o.cat="OBC";
 if(/rural|village|கிராம|गाँव|गांव/.test(t))o.area="rural";else if(/urban|city|town|நகர|शहर/.test(t))o.area="urban";
 if(/tamil ?nadu|தமிழ்நாடு|तमिलनाडु/.test(t))o.state="Tamil Nadu";
 if(/\bbpl\b|below poverty|வறுமை|गरीबी/.test(t))o.bpl=true;
 if(/disab|divyang|handicap|மாற்றுத்திறன்|दिव्यांग/.test(t))o.dis=true;
 if(/muslim|christian|sikh|buddhist|jain|parsi|minority|சிறுபான்மை|अल्पसंख्यक/.test(t))o.min=true;
 if(/widow|விதவை|विधवा/.test(t))o.wid=true;
 if(/pregnan|expecting|கர்ப்ப|गर्भवती/.test(t))o.preg=true;
 return o}
function voiceText(txt){
 if(!txt||!txt.trim()){$("vstat").textContent="Say or type something first.";return}
 const o=parse(txt);for(const k in o){if(typeof o[k]=="boolean")$(k).checked=o[k];else $(k).value=o[k]}
 $("vgot").innerHTML=`<p class="mu">“${txt}”</p>`+(Object.keys(o).length?Object.entries(o).map(([k,v])=>`<span class="chipx">${k}: ${v}</span>`).join(""):"<span class='mu'>Nothing understood – try again.</span>");
 if(g("age")===""||g("inc")===""){$("vstat").textContent="I still need your "+(g("age")===""?"age":"")+(g("age")===""&&g("inc")===""?" and ":"")+(g("inc")===""?"family income":"")+". Please say it.";return}
 $("vstat").textContent="Analysing…";
 run(()=>{const n=last.elig.length;$("vstat").textContent=n+" scheme(s) found";
  if($("speakOn").checked&&"speechSynthesis"in window){const nm=last.elig.slice(0,5).map(x=>x.s.n).join(", ");
   const msg={en:`You are eligible for ${n} schemes. Top ones: ${nm}.`,ta:`நீங்கள் ${n} திட்டங்களுக்குத் தகுதியுடையவர். ${nm}.`,hi:`आप ${n} योजनाओं के लिए पात्र हैं। ${nm}।`}[L];
   speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(msg);u.lang=LANG[L];speechSynthesis.speak(u)}})}
function listen(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){$("vstat").textContent="Voice input isn’t supported in this browser. Use Chrome or Edge, or type below.";return}
 const r=new SR();r.lang=LANG[L];r.interimResults=false;
 r.onstart=()=>{$("mic").classList.add("rec");$("vstat").textContent="Listening… ("+LANG[L]+")"};
 r.onend=()=>$("mic").classList.remove("rec");
 r.onerror=e=>$("vstat").textContent="Mic error: "+e.error+(e.error=="not-allowed"?" (allow microphone access)":"");
 r.onresult=e=>{const t=e.results[0][0].transcript;$("vtxt").value=t;voiceText(t)};r.start()}

/* ---------- 2. WhatsApp chatbot simulator ---------- */
const Q=[{k:"age",q:"What is your *age*?"},{k:"inc",q:"Your *annual family income* in ₹?"},{k:"gender",q:"Your *gender*?",o:["Female","Male","Other"]},{k:"occ",q:"Your *occupation*?",o:["student","farmer","self","artisan","salaried","unemployed","homemaker","retired"]},{k:"cat",q:"Your *category*?",o:["General","OBC","SC","ST"]},{k:"state",q:"Your *state*?",o:["Tamil Nadu","Other state"]},{k:"area",q:"*Rural* or *urban*?",o:["rural","urban"]},{k:"bpl",q:"Is your household *Below Poverty Line*?",o:["Yes","No"]}];
let bi=0,bp={};
function bubble(t,me){const d=document.createElement("div");d.className="b"+(me?" me":"");d.innerHTML=t.replace(/\*(.+?)\*/g,"<b>$1</b>").replace(/\n/g,"<br>");$("chat").appendChild(d);$("chat").scrollTop=1e9}
function ask(){const q=Q[bi];bubble(q.q);$("quick").innerHTML=(q.o||[]).map(o=>`<button onclick="botIn('${o}')">${o}</button>`).join("")}
function botStart(){$("chat").innerHTML="";bi=0;bp={house:false,girl:false,tax:false,dis:false,min:false,wid:false,preg:false};bubble("👋 Hi! I’m *SchemeLens*. Answer a few questions and I’ll find government schemes for you.");ask()}
function botIn(v){
 v=String(v).trim();if(!v)return;bubble(v,true);$("botTxt").value="";
 if(/^restart$/i.test(v))return botStart();
 if(bi>=Q.length){const m=v.match(/^docs\s*(\d+)/i);
  if(m&&botRes[m[1]-1]){const s=botRes[m[1]-1].s;bubble(`*Documents for ${s.n}*\n`+s.d.map(d=>"• "+d).join("\n")+"\n\nType *restart* to begin again.")}
  else bubble("Type *docs 1* for the documents of scheme 1, or *restart*.");return}
 const q=Q[bi];let val;
 if(q.o){val=q.o.find(o=>o.toLowerCase()==v.toLowerCase());if(!val)return bubble("Please choose one of the options 👇")}
 else{val=parseFloat(v.replace(/,/g,""));if(isNaN(val)||val<0)return bubble("Please send a number.")}
 bp[q.k]=q.k=="bpl"?val=="Yes":val;bi++;
 if(bi<Q.length)return ask();
 $("quick").innerHTML="";const e=evaluate(bp);botRes=e.elig;last=e;render();
 bubble(e.elig.length?waText(e)+"\n\nType *docs 1* for documents, or *restart*.":"No scheme fully matches yet. Type *restart* to try different details.")}

/* ---------- 3. Automated document verification ---------- */
const VD=[[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]];
const VP=[[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];
function verhoeff(n){let x=0;n.split("").reverse().forEach((d,i)=>x=VD[x][VP[i%8][+d]]);return x==0}
const DT={aadhaar:/aadhaar|आधार|unique identification|\b\d{4}\s\d{4}\s\d{4}\b/i,income:/income certificate|annual income|வருமான/i,caste:/community certificate|caste certificate|scheduled (caste|tribe)/i,ration:/ration card|family card|smart card|குடும்ப அட்டை/i,bank:/passbook|ifsc|account n/i,pan:/permanent account number|\b[A-Z]{5}\d{4}[A-Z]\b/,birth:/birth certificate|registrar of births/i};
const needT=d=>/aadhaar/i.test(d)?"aadhaar":/income/i.test(d)?"income":/caste|community/i.test(d)?"caste":/ration/i.test(d)?"ration":/bank|passbook/i.test(d)?"bank":/\bPAN\b/.test(d)?"pan":/birth/i.test(d)?"birth":null;
let DS={};
function fillDocSel(){$("docScheme").innerHTML=S.map(s=>`<option value="${s.id}">${em(s.id)} ${s.n}</option>`).join("")}
function goDocs(id){showTab("docs");$("docScheme").value=id;renderDocs()}
function renderDocs(){
 const id=g("docScheme")||S[0].id,s=sch(id);DS[id]=DS[id]||{};let ready=0;
 $("docList").innerHTML=s.d.map((d,i)=>{const v=DS[id][d];if(v)ready++;const auto=needT(d);
  return `<li><span>${d}</span><span>${v||(auto?"⬜ upload to verify":`<label class="ck" style="margin:0"><input type="checkbox" onchange="manualDoc('${id}',${i},this.checked)"> I have it</label>`)}</span></li>`}).join("");
 $("readyBtn").hidden=ready<s.d.length}
function manualDoc(id,i,on){const d=sch(id).d[i];if(on)DS[id][d]="☑ confirmed by you";else delete DS[id][d];renderDocs()}
async function scan(files){
 const id=g("docScheme"),s=sch(id);DS[id]=DS[id]||{};
 if(typeof Tesseract=="undefined"){$("ocrMsg").textContent="OCR engine not loaded. Connect to the internet (Tesseract.js loads from a CDN) and reload.";return}
 for(const f of files){
  try{$("ocrMsg").textContent="Reading "+f.name+" …";
   const{data}=await Tesseract.recognize(f,"eng",{logger:m=>{if(m.status=="recognizing text")$("ocrMsg").textContent="Reading "+f.name+" … "+Math.round(m.progress*100)+"%"}});
   const txt=data.text,found=Object.keys(DT).filter(k=>DT[k].test(txt));let note="";
   if(found.includes("aadhaar")){const m=txt.match(/\b(\d{4})\s?(\d{4})\s?(\d{4})\b/);note=m?(verhoeff(m[1]+m[2]+m[3])?`number format valid (XXXX XXXX ${m[3]})`:"number failed checksum – re-scan clearly"):"number not readable"}
   s.d.forEach(d=>{const t=needT(d);if(t&&found.includes(t))DS[id][d]="✅ "+f.name});
   $("ocrLog").insertAdjacentHTML("afterbegin",`<div><b>${f.name}</b>: ${found.length?"detected "+found.join(", "):"could not recognise – use a clearer, well-lit photo"}${note?" · Aadhaar "+note:""}</div>`)
  }catch(e){$("ocrLog").insertAdjacentHTML("afterbegin",`<div>${f.name}: OCR failed (${e.message||e})</div>`)}}
 $("ocrMsg").textContent="Done.";renderDocs()}
function docsReady(){const id=g("docScheme");track(id,1)}

/* ---------- 4. Deadline alerts & application tracking ---------- */
const ST=["Not started","Documents ready","Applied","Under review","Approved"];
let TR={};try{TR=JSON.parse(localStorage.getItem("sl_track")||"{}")}catch(e){}
const save=()=>{try{localStorage.setItem("sl_track",JSON.stringify(TR))}catch(e){}};
const pad=n=>String(n).padStart(2,"0");
function defDate(id){return nextDate(sch(id))}
function track(id,st){TR[id]=TR[id]||{st:0,dl:defDate(id)};if(st!==undefined)TR[id].st=Math.max(TR[id].st,st);save();renderTrack();showTab("track")}
const daysLeft=dl=>{const t=new Date();t.setHours(0,0,0,0);return Math.round((new Date(dl+"T00:00:00")-t)/864e5)};
function setSt(id,v){TR[id].st=+v;save();renderTrack()}
function setDl(id,v){TR[id].dl=v;save();renderTrack()}
function rmTrack(id){delete TR[id];save();renderTrack()}
function renderTrack(){
 const ids=Object.keys(TR);
 $("trackList").innerHTML=ids.length?ids.map(id=>{const s=sch(id),t=TR[id],d=t.dl?daysLeft(t.dl):null;
  const badge=d===null?"":t.st==4?`<span class="dd ok">Approved ✓</span>`:`<span class="dd ${d<0?"late":d<=7?"soon":"ok"}">${d<0?Math.abs(d)+" day(s) overdue":d==0?"Due today":d+" day(s) left"}</span>`;
  return `<div class="tk"><div class="top"><div class="ic" style="--c:hsl(${S.indexOf(s)*24} 80% 60%)">${em(id)}</div><div class="bd"><h3 style="margin:0">${s.n}</h3><div class="mu sm">${s.dl}</div></div>${badge}</div>
  <div class="prog"><i style="width:${t.st/4*100}%"></i></div>
  <div class="r"><select onchange="setSt('${id}',this.value)">${ST.map((x,i)=>`<option value="${i}" ${i==t.st?"selected":""}>${x}</option>`).join("")}</select>
  <label class="mu sm" style="margin:0">Deadline <input type="date" value="${t.dl}" onchange="setDl('${id}',this.value)"></label>
  <button class="mini" onclick="ics('${id}')">📅 Add to calendar</button><button class="mini" onclick="goDocs('${id}')">📄 Documents</button><button class="mini" onclick="rmTrack('${id}')">Remove</button></div></div>`}).join(""):`<div class="empty">Nothing tracked yet. Use “📌 Track” on a scheme card.</div>`;
 renderUpcoming();renderAlerts()}
function renderAlerts(){
 const due=Object.keys(TR).filter(id=>TR[id].dl&&TR[id].st<4).map(id=>({id,d:daysLeft(TR[id].dl)})).filter(x=>x.d<=7).sort((a,b)=>a.d-b.d);
 $("alerts").innerHTML=due.map(x=>`<div class="al ${x.d<0?"late":""}" onclick="showTab('track')" style="cursor:pointer">⏰ <b>${sch(x.id).n}</b>: ${x.d<0?Math.abs(x.d)+" day(s) overdue":x.d==0?"due today":x.d+" day(s) left"}</div>`).join("");
 const b=$("badge");b.textContent=due.length;b.hidden=!due.length;
 if(typeof Notification!="undefined"&&Notification.permission=="granted"){const k=new Date().toDateString();due.filter(x=>x.d>=0&&x.d<=3&&TR[x.id].n!=k).forEach(x=>{new Notification("SchemeLens deadline",{body:sch(x.id).n+": "+(x.d?x.d+" day(s) left":"due today")});TR[x.id].n=k});save()}}
function askNotify(){if(typeof Notification=="undefined")return alert("Notifications aren’t supported in this browser.");Notification.requestPermission().then(p=>{alert(p=="granted"?"Alerts enabled. You’ll be notified when a deadline is within 3 days and this page is open.":"Notifications were not allowed.");renderAlerts()})}
function ics(id){
 const t=TR[id];if(!t.dl)return alert("Set a deadline date first.");const d=t.dl.replace(/-/g,""),n=sch(id).n,st=new Date().toISOString().replace(/[-:]|\.\d+/g,"");
 const e=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SchemeLens//EN","BEGIN:VEVENT",`UID:${id}-${d}@schemelens`,`DTSTAMP:${st}`,`DTSTART;VALUE=DATE:${d}`,`SUMMARY:Deadline: ${n}`,`DESCRIPTION:Apply or renew ${n} (SchemeLens)`,"BEGIN:VALARM","TRIGGER:-P3D","ACTION:DISPLAY",`DESCRIPTION:${n} deadline in 3 days`,"END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([e],{type:"text/calendar"}));a.download=id+"-deadline.ics";a.click()}

/* ---------- deadline helpers (data in schemes2.js) ---------- */
const DTL={open:"Open all year",annual:"Yearly deadline",season:"Seasonal deadline",fixed:"Fixed deadline",check:"Check portal"};
function nextDate(s){const x=(s&&s.dx)||{};if(x.t=="fixed")return x.ex||"";
 if(x.dd){const n=new Date();n.setHours(0,0,0,0);let best="";x.dd.forEach(m=>{let d=new Date(n.getFullYear()+"-"+m+"T00:00:00");if(d<n)d=new Date((n.getFullYear()+1)+"-"+m+"T00:00:00");const k=d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());if(!best||k<best)best=k});return best}return""}
const chipD=n=>`<span class="dd ${n<0?"late":n<=14?"soon":"ok"}">${n<0?"closed "+Math.abs(n)+"d ago":n==0?"due today":n+" day(s) left"}</span>`;
function dlLine(s){const x=s.dx||{t:"open"},d=nextDate(s);
 return `<div class="dlr">⏰ <b>${DTL[x.t]||DTL.open}</b> ${d?chipD(daysLeft(d))+" · "+d:""}<div class="mu sm">${s.dl}</div></div>`}
function renderUpcoming(){
 const pool=last?last.elig.map(x=>x.s):S;
 const list=pool.map(s=>({s,d:nextDate(s)})).filter(x=>x.d).map(x=>({...x,n:daysLeft(x.d)})).sort((a,b)=>a.n-b.n);
 $("upcoming").innerHTML=`<h2>📅 Upcoming deadlines ${last?"(your eligible schemes)":"(all schemes)"}</h2>`+(list.length?list.map(x=>`<div class="vr"><b>${em(x.s.id)} ${x.s.n}</b> · ${x.d} ${chipD(x.n)} <button class="mini" onclick="track('${x.s.id}')">📌 Track</button><div class="mu sm">${x.s.dl}</div></div>`).join(""):"<div class='mu'>No dated deadlines for your schemes – most are open all year or announced on the portal.</div>")+`<h2 style="margin-top:20px">Your tracked applications</h2>`}

/* ---------- init ---------- */
if(matchMedia("(prefers-color-scheme: light)").matches)toggleTheme();
fillDocSel();renderDocs();renderTrack();botStart();
