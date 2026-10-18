(() => {
'use strict';
const app=document.getElementById('toy-finder-app');if(!app)return;
const questions=[
{key:'use',title:'Who is it for?',options:[['solo','For myself'],['couple','For two people']]},
{key:'experience',title:'Is this your first toy?',options:[['first','My first toy'],['have','I already have toys']]},
{key:'sensation',title:'What kind of sensation interests you?',options:[['point','Focused in one place'],['broad','A wider area'],['inside','Internal'],['both','Internal and external']]},
{key:'priority',title:'What matters most?',options:[['quiet','Quiet'],['bath','Waterproof for the bath'],['remote','Remote control'],['cheap','A lower price']]},
{key:'budget',title:'What is your budget?',options:[['under30','Under $30'],['mid','$30–60'],['open','No fixed limit']]}];
function recommend(data,a,category='all-products'){
 let pool=data.products.filter(p=>category==='bdsm-bondage'?p.kind==='bondage':category==='anal-pleasure'?p.kind==='anal':!['anal','bondage'].includes(p.kind));
 const cat=data.categories.find(c=>c.slug===category);
 const score=p=>{let n=p.sensations.includes(a.sensation)?8:0;n+=p.features.includes(a.priority)?6:0;n+=(a.experience==='first'&&p.beginner)?2:0;n+=(a.use==='couple'&&p.kind==='ring')?3:0;n+=(cat&&p.categories.includes(cat.id))?10:0;return n;};
 const affordable=p=>a.budget==='under30'?p.price<30:a.budget==='mid'?p.price<=60:true;
 pool=pool.filter(affordable).sort((x,y)=>score(y)-score(x)||x.price-y.price||x.id.localeCompare(y.id));
 // Specific-interest collections may have only one curated item. Keep that pick
 // and offer a distinct, budget-compatible alternative from the wider catalog.
 if(pool.length<2)pool.push(...data.products.filter(p=>affordable(p)&&!['anal','bondage'].includes(p.kind)&&!pool.some(q=>q.id===p.id)).sort((x,y)=>score(y)-score(x)));
 return pool.slice(0,2).map(p=>p.id);
}
if(typeof module!=='undefined')module.exports={questions,recommend};
let data,answers={},step=0,category='all-products';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
function render(){const q=questions[step];app.innerHTML='<p class="quiz-progress" tabindex="-1">Question '+(step+1)+' of 5</p><fieldset><legend>'+q.title+'</legend><div class="quiz-options">'+q.options.map(([v,t])=>'<label><input type="radio" name="answer" value="'+v+'" '+(answers[q.key]===v?'checked':'')+'><span>'+t+'</span></label>').join('')+'</div></fieldset><div class="quiz-controls">'+(step?'<button type="button" class="quiz-back">← Back</button>':'')+'<button type="button" class="vn-button quiz-next" '+(answers[q.key]?'':'disabled')+'>'+(step===4?'See my picks →':'Next →')+'</button></div>';app.querySelectorAll('input').forEach(x=>x.onchange=()=>{answers[q.key]=x.value;app.querySelector('.quiz-next').disabled=false});const back=app.querySelector('.quiz-back');if(back)back.onclick=()=>{step--;render()};app.querySelector('.quiz-next').onclick=()=>{if(step===4)results();else{step++;render()}};app.querySelector('.quiz-progress').focus({preventScroll:true});}
function results(){const ids=recommend(data,answers,category);app.innerHTML='<section class="quiz-results"><h2 tabindex="-1">Your two picks</h2><p>Compare the format as well as the features: a sleeve, ring, internal toy and external massager are used differently.</p><p class="quiz-match-note"></p><h3>Main pick</h3><div id="quiz-main"></div><h3>One alternative</h3><div id="quiz-more"></div><p class="sd-section-publisher">The Velvet Notes is published by the team behind SinDept.</p><button type="button" class="quiz-reset vn-button">Start again</button></section>';
 ids.forEach((id,i)=>{const t=document.getElementById('quiz-template-'+id);const target=document.getElementById(i?'quiz-more':'quiz-main');target.append(t.content.cloneNode(true));target.querySelector('a.sindept-recommendation-card')?.classList.add('quiz-result-card')});
 const p=data.products.find(x=>x.id===ids[0]),messages=[];
 if(!p.sensations.includes(answers.sensation))messages.push('This pick prioritizes your other preferences; compare the sensation described on its card.');
 if(!p.features.includes(answers.priority))messages.push('For your selected feature, compare the alternative and the exact product details.');
 if(answers.budget==='mid'&&p.price<30)messages.push('This option comes in below your $30–60 budget.');
 app.querySelector('.quiz-match-note').textContent=messages.join(' ');app.querySelector('.quiz-reset').onclick=start;app.querySelector('h2').focus({preventScroll:true});}
function start(){answers={};step=0;app.innerHTML='<h2>Let’s narrow it down</h2><p>Optional: already know the collection you want? Choose it here, or explore the full selection.</p><label for="quiz-category">Collection</label><select id="quiz-category">'+data.categories.map(c=>'<option value="'+c.slug+'">'+escape(c.name)+'</option>').join('')+'</select><p>Anal and restraint products appear only when you explicitly choose that collection. For sleeves or rings, check that the format suits your body and plans.</p><button type="button" class="vn-button quiz-start">Start the five questions →</button>';app.querySelector('.quiz-start').onclick=()=>{category=app.querySelector('select').value;render()};}
fetch(app.dataset.dataUrl).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(x=>{data=x;start()}).catch(()=>{app.innerHTML='<p>The quiz could not load. Reload this page to try again, or read our <a href="/guides/how-to-choose-your-first-vibrator/">first-toy guide</a>.</p>'});
})();
