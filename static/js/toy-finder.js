(() => {
'use strict';
const app=typeof document!=='undefined'?document.getElementById('toy-finder-app'):null;
const audienceOptions=[['vulva','For someone with a vulva'],['penis','For someone with a penis'],['couple','For a couple to share']];
const sensationOptions={
 vulva:[['point','Focused external sensation'],['broad','A wider area'],['inside','Internal sensation'],['both','Internal and external']],
 penis:[['stroker','Stroker / sleeve'],['ring','Vibrating ring'],['broad','External body massage'],['unsure','Not sure yet']],
 couple:[['broad','External wand / body massage'],['ring','Vibrating ring (requires a penis)'],['restraint','Consensual restraint play'],['unsure','Not sure yet']]
};
const baseQuestions=[
 {key:'audience',title:'What body is the toy for?',options:audienceOptions},
 {key:'experience',title:'Is this your first toy?',options:[['first','My first toy'],['have','I already have toys']]},
 {key:'priority',title:'What matters most?',options:[['quiet','Quiet'],['bath','Waterproof for the bath'],['remote','Remote control'],['cheap','A lower price']]},
 {key:'budget',title:'What is your budget?',options:[['under30','Under $30'],['mid','$30–60'],['open','No fixed limit']]}
];
function questionsFor(a){return [baseQuestions[0],baseQuestions[1],{key:'sensation',title:'What kind of sensation interests you?',options:sensationOptions[a.audience]||sensationOptions.vulva},baseQuestions[2],baseQuestions[3]];}
function recommend(data,a){
 let pool=data.products.filter(p=>Array.isArray(p.audience)&&p.audience.includes(a.audience)&&p.kind!=='anal'&&(p.kind!=='bondage'||a.sensation==='restraint'));
 const score=p=>{let n=(p.sensations.includes(a.sensation)||(a.sensation==='stroker'&&p.kind==='sleeve')||(a.sensation==='ring'&&p.kind==='ring')||(a.sensation==='restraint'&&p.kind==='bondage'))?20:0;n+=p.features.includes(a.priority)?6:0;n+=(a.experience==='first'&&p.beginner)?2:0;n+=(a.audience==='couple'&&p.kind==='ring')?3:0;return n;};
 const affordable=p=>a.budget==='under30'?p.price<30:a.budget==='mid'?p.price<=60:true;
 let picked=pool.filter(affordable).sort((x,y)=>score(y)-score(x)||x.price-y.price||x.id.localeCompare(y.id));
 if(picked.length<2)picked.push(...pool.filter(p=>!picked.some(q=>q.id===p.id)).sort((x,y)=>score(y)-score(x)||x.price-y.price));
 return picked.slice(0,2).map(p=>p.id);
}
if(typeof module!=='undefined')module.exports={questionsFor,recommend,sensationOptions};
if(!app)return;
let data,answers={},step=0;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
function render(){const qs=questionsFor(answers),q=qs[step];app.innerHTML='<p class="quiz-progress" tabindex="-1">Question '+(step+1)+' of 5</p><fieldset><legend>'+q.title+'</legend><div class="quiz-options">'+q.options.map(([v,t])=>'<label><input type="radio" name="answer" value="'+v+'" '+(answers[q.key]===v?'checked':'')+'><span>'+t+'</span></label>').join('')+'</div></fieldset><div class="quiz-controls">'+(step?'<button type="button" class="quiz-back">← Back</button>':'')+'<button type="button" class="vn-button quiz-next" '+(answers[q.key]?'':'disabled')+'>'+(step===4?'See my picks →':'Next →')+'</button></div>';
 app.querySelectorAll('input').forEach(x=>x.onchange=()=>{answers[q.key]=x.value;app.querySelector('.quiz-next').disabled=false});
 const back=app.querySelector('.quiz-back');if(back)back.onclick=()=>{step--;render()};app.querySelector('.quiz-next').onclick=()=>{if(step===4)results();else{step++;render()}};app.querySelector('.quiz-progress').focus({preventScroll:true});}
function results(){const ids=recommend(data,answers);app.innerHTML='<section class="quiz-results"><h2 tabindex="-1">Your two picks</h2><p>These picks are matched to: '+escape(audienceOptions.find(x=>x[0]===answers.audience)[1])+'.</p><h3>Main pick</h3><div id="quiz-main"></div><h3>One alternative</h3><div id="quiz-more"></div><p class="sd-section-publisher">The Velvet Notes is published by the team behind SinDept.</p><button type="button" class="quiz-reset vn-button">Start again</button></section>';
 ids.forEach((id,i)=>{const t=document.getElementById('quiz-template-'+id),target=document.getElementById(i?'quiz-more':'quiz-main');target.append(t.content.cloneNode(true));target.querySelector('a.sindept-recommendation-card')?.classList.add('quiz-result-card')});const notes=[];ids.forEach((id,i)=>{const p=data.products.find(x=>x.id===id);if(!p.features.includes(answers.priority))notes.push((i?'Alternative':'Main pick')+': your selected feature is not confirmed in this catalog; check the exact product details.');if(answers.budget==='mid'&&p.price<30)notes.push((i?'Alternative':'Main pick')+': below your $30–60 budget.');});if(answers.audience==='couple')notes.push('A ring requires a penis. Sharing means partnered use, not moving a toy between bodies without cleaning and suitable barriers.');if(notes.length){const n=document.createElement('p');n.className='quiz-match-note';n.textContent=notes.join(' ');app.querySelector('.quiz-results h3').before(n);}app.querySelector('.quiz-reset').onclick=start;app.querySelector('h2').focus({preventScroll:true});}
function start(){answers={};step=0;render();}
fetch(app.dataset.dataUrl).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(x=>{data=x;start()}).catch(()=>{app.innerHTML='<p>The quiz could not load. Reload this page to try again, or read our <a href="'+escape(app.dataset.fallbackUrl)+'">first-toy guide</a>.</p>'});
})();
