// اختبار القبول: node tests/run-tests.js  (يتطلب: npm i playwright-core xlsx@0.18.5 chart.js@4.4.1 وGoogle Chrome)
const {chromium}=require('playwright-core'),fs=require('fs'),path=require('path');
const HTML=path.join(__dirname,'..','index.html'),EXP=require('./expected.json');
const NM=path.join(__dirname,'node_modules'),lib=m=>path.join(NM,m,'x');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox']});let fail=0;
{const p=await b.newPage();await p.route('**/*',r=>{const u=r.request().url();if(u.includes('xlsx.full'))return r.fulfill({path:path.join(NM,'xlsx/dist/xlsx.full.min.js')});if(u.includes('chart.umd'))return r.fulfill({path:path.join(NM,'chart.js/dist/chart.umd.js')});if(u.startsWith('file:'))return r.continue();return r.abort()});
 await p.goto('file://'+HTML);await p.waitForTimeout(300);
 const u=await p.evaluate(()=>{const{nqThr}=window.__nq;return[1,2,3].map(y=>Math.round(nqThr(6,200,y)[0]*100)/100)});
 const ok=JSON.stringify(u)==='[23.98,26.98,29.98]';console.log(ok?'✓':'✗','مثال الدليل: الصناعات 200 عامل، حد الأخضر المنخفض 2026/2027/2028',u.join(' / '));fail+=ok?0:1;await p.close()}
for(const[key,x]of Object.entries(EXP)){const[f,act]=key.split('@');const p=await b.newPage({viewport:{width:1400,height:900}});const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text())});
 await p.route('**/*',r=>{const u=r.request().url();if(u.includes('xlsx.full'))return r.fulfill({path:path.join(NM,'xlsx/dist/xlsx.full.min.js')});if(u.includes('chart.umd'))return r.fulfill({path:path.join(NM,'chart.js/dist/chart.umd.js')});if(u.startsWith('file:'))return r.continue();return r.abort()});
 await p.goto('file://'+HTML);await p.waitForTimeout(400);
 if(act!=null)await p.selectOption('#act',act);
 if(f!=='__sample__'){await p.setInputFiles('#file',path.join(__dirname,'cases',f));await p.waitForTimeout(1300)}
 const opts=await p.$$eval('#dept option',o=>o.map(v=>v.value));for(const v of opts.slice(0,10)){await p.selectOption('#dept',v);await p.waitForTimeout(60)}await p.selectOption('#dept','');await p.waitForTimeout(250);
 const r=await p.evaluate(()=>{const{m,dc}=window.__hr,y0=new Date(new Date().getFullYear(),0,31),now=new Date();
  const kpi=document.querySelector('#kpis').innerText,depts=new Set(m.act.map(e=>e.dept)).size;
  const changed=m.all.filter(e=>(e.hire&&e.hire>y0&&(e.status==='نشط'||e.status==='تجربة'))||(e.exit&&e.exit>y0&&e.exit<=now)).reduce((s,e)=>s+(e.salary||0),0);
  const q=m.nq;return{nq:q?{band:q.band,need:q.need,r:Math.round(q.r*100)/100,tiny:!!q.tiny}:null,accepted:/^✓/.test(document.querySelector('#toast').textContent),score:dc.score,level:dc.lvl[0],head:dc.head,acts:dc.acts.map(a=>a.t),lack:dc.lack,
   costLine:(kpi.match(/[↑↓] [\d.,]+% منذ يناير/)||[null])[0],deltaOK:m.deltaOK,depts,costGap:Math.abs(m.cost-m.cost0),changed,
   bad:(document.body.innerText.match(/NaN|undefined|Infinity|\[object/g)||[]).length}});
 const P=[];const chk=(ok,msg)=>{if(!ok)P.push(msg)};
 if(f!=='__sample__')chk(r.accepted===x.accepted,`القبول: ${r.accepted}`);
 chk(r.score===x.score,`الدرجة ${r.score} والمتوقع ${x.score}`);chk(r.level===x.level,`المستوى ${r.level}`);
 chk(r.head===x.head,`القرار «${r.head}»`);chk(JSON.stringify(r.acts)===JSON.stringify(x.acts),`الإجراءات ${JSON.stringify(r.acts)}`);
 chk(r.costLine===x.costLine,`تغير التكلفة ${r.costLine}`);
 if('nq' in x)chk(JSON.stringify(r.nq)===JSON.stringify(x.nq),`نطاقات ${JSON.stringify(r.nq)}`);
 // شروط عامة
 chk(!(r.lack.length&&r.score!=null),'ملف ناقص أخذ درجة');
 chk(!(r.depts<3&&r.acts.some(a=>a.startsWith('مراجعة تكلفة'))),'توصية تكلفة مع أقل من 3 إدارات');
 chk(!(r.costLine&&!r.deltaOK),'تغير تكلفة بلا تواريخ تعيين ومغادرة');
 chk(!r.costLine||r.costGap<=r.changed+1,`فرق التكلفة ${r.costGap} يتجاوز رواتب المتغيرين ${r.changed}`);
 chk(!errs.length,'أخطاء وحدة التحكم: '+errs.join(' | '));chk(!r.bad,'قيم NaN أو undefined ظاهرة');
 console.log(P.length?'✗':'✓',key,P.length?'\n   '+P.join('\n   '):'');fail+=P.length?1:0;await p.close()}
await b.close();console.log(fail?`\n${fail} ملف لم يجتز`:'\nاجتازت كل الملفات');process.exit(fail?1:0)})();
