export const methodVersion='discussion-matrix-v1';
// Proposed discussion policy; not an empirical probability model or AST tier.
export const tierMatrix=[['R1','R1','R2','R3'],['R1','R2','R2','R3'],['R2','R2','R3','R4'],['R2','R3','R4','R4']];
export const tierNames={U:'未評価',R1:'経過確認',R2:'対策を検討',R3:'優先して検証・対策',R4:'実行前に責任者レビュー'};
export const likelihoodLevels=[
 ['1','L1 · 低い','接点が限定的で必要条件が多く、有効な防御を確認できている。'],
 ['2','L2 · 中程度','接点はあるが特別な権限や追加条件が必要。標的性・防御を含めて中程度と判断。'],
 ['3','L3 · 高い','攻撃機会が多く、成立条件が少ない。防御の不足と攻撃者の能力・標的性に根拠がある。'],
 ['4','L4 · 非常に高い','継続した攻撃や強い標的性が観測され、成立条件と防御の不足を確認できている。']
];
export const impactLevels=[
 ['1','I1 · 軽微','単一作業のやり直しなど。容易に復旧でき、重要情報・貴重な検体・安全への影響はない。'],
 ['2','I2 · 限定的','単一実験の失敗、限定した検体・結果の損失。局所的で復旧可能。'],
 ['3','I3 · 重大','複数実験や貴重な試料の損失、重要データの漏えい、長い停止など。影響範囲が大きい。'],
 ['4','I4 · 深刻','人・環境への深刻な影響、または研究室の主要資産や活動を失う規模の重大・回復困難な損失。']
];
export function normalizeAssessment(raw={}){
 if(!raw||typeof raw!=='object')raw={};
 return {likelihood:['1','2','3','4'].includes(raw.likelihood)?raw.likelihood:'unknown',impact:['1','2','3','4'].includes(raw.impact)?raw.impact:'unknown',evidence:['hypothesis','literature','configuration','reproduction'].includes(raw.evidence)?raw.evidence:'hypothesis',context:typeof raw.context==='string'?raw.context.slice(0,1000):'',rationale:typeof raw.rationale==='string'?raw.rationale.slice(0,3000):''};
}
export function evaluateAssessment(raw){
 const a=normalizeAssessment(raw);
 if(a.likelihood==='unknown'||a.impact==='unknown')return {tier:'U',reason:'起こりやすさ・影響度の未評価項目があります。'};
 if(!a.context.trim()||!a.rationale.trim())return {tier:'U',reason:'対象構成と評価理由を記録すると、仮Tierを表示します。'};
 return {tier:tierMatrix[Number(a.likelihood)-1][Number(a.impact)-1],reason:'入力した前提に基づく議論用の仮Tier。発生確率や安全性の証明ではありません。'};
}
