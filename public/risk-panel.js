import {methodVersion,tierMatrix,tierNames,likelihoodLevels,impactLevels,normalizeAssessment,evaluateAssessment} from './risk-model.js';
const root=document.getElementById('lab-scenario-three-columns-oct12'),panel=root.querySelector('#risk-panel');
const fields=Object.fromEntries(['likelihood','impact','evidence','context','rationale'].map(k=>[k,panel.querySelector('#risk-'+k)]));
const storageKey='lab-risk-assessments-'+methodVersion;
let assessments={},active=null;
try {const parsed=JSON.parse(localStorage.getItem(storageKey)||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))assessments=parsed;} catch {}
for(const [key,levels] of [['likelihood',likelihoodLevels],['impact',impactLevels]]){
 const tbody=panel.querySelector('#risk-'+key+'-criteria');
 for(const [value,label,definition] of levels){const option=document.createElement('option');option.value=value;option.textContent=label;fields[key].appendChild(option);const row=document.createElement('tr'),heading=document.createElement('th'),cell=document.createElement('td');heading.scope='row';heading.textContent=label;cell.textContent=definition;row.append(heading,cell);tbody.appendChild(row);}
}
const cells=[];
tierMatrix.forEach((tiers,i)=>{const row=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent='L'+(i+1);row.appendChild(th);tiers.forEach((tier,j)=>{const td=document.createElement('td');td.textContent=tier;td.dataset.level=tier;td.setAttribute('aria-label','L'+(i+1)+'、I'+(j+1)+'：'+tier+' '+tierNames[tier]);cells.push({td,l:String(i+1),i:String(j+1)});row.appendChild(td);});panel.querySelector('#risk-matrix-body').appendChild(row);});
function render(){
 const values=Object.fromEntries(Object.entries(fields).map(([key,el])=>[key,el.value])),result=evaluateAssessment(values);
 const tier=panel.querySelector('#risk-tier');tier.textContent=result.tier+' · '+tierNames[result.tier];tier.dataset.level=result.tier;
 panel.querySelector('#risk-status').textContent=result.reason;
 cells.forEach(({td,l,i})=>{const selected=result.tier!=='U'&&l===values.likelihood&&i===values.impact;td.classList.toggle('risk-selected',selected);if(selected)td.setAttribute('aria-current','true');else td.removeAttribute('aria-current');});
}
function selectScenario(detail){
 if(!detail?.id)return;active=detail.id;
 panel.querySelector('#risk-scenario').textContent=detail.code+' · '+detail.title;
 const a=normalizeAssessment(assessments[active]);Object.entries(fields).forEach(([key,el])=>el.value=a[key]);render();
}
function save(){
 if(!active)return;
 assessments[active]=normalizeAssessment(Object.fromEntries(Object.entries(fields).map(([key,el])=>[key,el.value])));
 try {localStorage.setItem(storageKey,JSON.stringify(assessments));panel.querySelector('#risk-storage').textContent='評価はこのブラウザ内に保存。サーバー送信・他者との共有はありません。';}
 catch {panel.querySelector('#risk-storage').textContent='この環境では保存できません。ページを閉じると入力は失われます。';}render();
}
Object.values(fields).forEach(el=>el.addEventListener('input',save));
root.addEventListener('scenario-selected',event=>selectScenario(event.detail));
selectScenario({id:root.dataset.scenarioId,code:root.dataset.scenarioCode,title:root.dataset.scenarioTitle});
