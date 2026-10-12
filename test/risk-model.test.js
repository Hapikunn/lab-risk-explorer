import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeAssessment,evaluateAssessment,tierMatrix} from '../public/risk-model.js';
const justified={context:'A defined configuration with current controls',rationale:'A documented assessment rationale'};
test('absence of evidence is never classified as low risk',()=>{
 assert.equal(evaluateAssessment().tier,'U');
 assert.equal(evaluateAssessment({...justified,likelihood:'unknown',impact:'4'}).tier,'U');
 assert.equal(evaluateAssessment({...justified,likelihood:'1',impact:'unknown'}).tier,'U');
});
test('a tier requires context and rationale, not just selecting numbers',()=>{
 assert.equal(evaluateAssessment({likelihood:'4',impact:'4'}).tier,'U');
 assert.equal(evaluateAssessment({...justified,likelihood:'4',impact:'4'}).tier,'R4');
});
test('invalid stored values do not become a risk ranking',()=>{
 for(const likelihood of ['0','5',2,null])assert.equal(evaluateAssessment({...justified,likelihood,impact:'2'}).tier,'U');
 assert.equal(normalizeAssessment(null).likelihood,'unknown');
 assert.equal(normalizeAssessment({evidence:'verified-by-magic'}).evidence,'hypothesis');
});
test('increasing likelihood or impact cannot reduce priority',()=>{
 const n=tier=>Number(tier.slice(1));
 for(let l=0;l<4;l++)for(let i=0;i<4;i++){
  if(l<3)assert.ok(n(tierMatrix[l+1][i])>=n(tierMatrix[l][i]));
  if(i<3)assert.ok(n(tierMatrix[l][i+1])>=n(tierMatrix[l][i]));
 }
});
test('severe impact does not disappear under low likelihood',()=>{
 assert.equal(evaluateAssessment({...justified,likelihood:'1',impact:'4'}).tier,'R3');
});
test('a self-reported evidence label does not automatically lower priority',()=>{
 for(const evidence of ['hypothesis','literature','configuration','reproduction'])assert.equal(evaluateAssessment({...justified,likelihood:'3',impact:'3',evidence}).tier,'R3');
});
