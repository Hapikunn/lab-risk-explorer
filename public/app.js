
    (()=>{
      const root=document.getElementById('lab-scenario-three-columns-oct12');
      const names={researcher:'実験者',synthesis:'遺伝子合成会社',cloud:'クラウドラボ',lab:'自分の研究室',attacker:'攻撃者'};
      const stories={
        researcher:[
          {id:'order-swap',short:'発注データの差し替え',title:'承認した配列と、発注された配列が違う',edge:'order',before:'実験者はSEQ-Aの合成を承認する。',intervention:'侵害された連携ソフトが、送信前にSEQ-Bへ変更する。',after:'不一致を見逃すと、SEQ-Bの注文が受け付けられる。',entry:'実験者が使用する発注用の連携ソフト。攻撃者はその送信処理を変更できるという仮定。',condition:'連携ソフトが実際の発注データにアクセスでき、独立した承認済み原本との照合で止まらない。会社側の審査を通ることも必要。',defense:'実験者の承認原本と、会社が受け付けた注文を照合する。変更時に再承認する。TLSだけでは送信前の変更を防がない。',evidence:'承認SEQ-A、送信SEQ-B、受付記録の差分。ダミー識別子で確認する。',limit:'製造された物理検体の内容、発現、毒性、菌の死滅は、このデモでは確認しない。'},
          {id:'key-abuse',short:'API鍵の悪用',title:'本人が依頼していない実験が、本人の名義で送信される',edge:'run',before:'実験者はPLAN-01だけを承認している。',intervention:'攻撃者が取得した実験依頼API鍵で、別の計画を送る。',after:'追加の承認確認がなければ、未承認の依頼が受理され得る。',entry:'実験者のAPI鍵。漏えい経路は別途確認する必要がある。',condition:'鍵が有効で実験依頼の権限を持ち、クラウドラボのAPIへ到達できる。独立した実験承認で止まらない。',defense:'鍵の権限と対象を限定し、実験承認と実行要求を結合する。認証と本人の実験承認を区別する。',evidence:'鍵の権限、本人の承認履歴、要求と受理・拒否の記録。',limit:'鍵の取得自体、実設備の認証回避、実機での操作は未実証。'}
        ],
        synthesis:[
          {id:'manufacture-swap',short:'受付後のデータ変更',title:'注文は正しくても、製造へ渡すデータが変わる',edge:'order',before:'会社はSEQ-Aの注文を受け付ける。',intervention:'侵害された内部の連携処理が、製造用データをSEQ-Bへ変更する。',after:'注文との照合がなければ、異なるデータが製造へ渡る。',entry:'合成会社の受付から製造への内部連携システム。内部システムの変更権限を得たという仮定。',condition:'攻撃者が製造用データに書き込める。受付原本との照合や再審査が変更を検出しない。',defense:'受付・審査・製造に使った版を結び付け、変更時に処理を止める。受領物の確認は別に行う。',evidence:'注文原本、審査対象、製造指示の版とダイジェストの対応。',limit:'会社の内部実装と侵入経路は未確認。SEQ-Bの製造や生物学的影響は未実証。'},
          {id:'report-swap',short:'検体報告の取り違え',title:'届いた検体と、確認報告が対応していない',edge:'report',before:'SAMPLE-01の確認報告が返される予定。',intervention:'報告APIや登録処理を侵害した攻撃者が、SAMPLE-02の報告を結び付ける。',after:'実験者やラボが、別検体の報告を信じて作業を進める。',entry:'合成会社の報告データや登録API。報告の変更権限が必要。',condition:'検体IDと報告の対応を書き換えられ、受領検体の独立した確認が不一致を見つけない。',defense:'報告の真正性に加えて、注文・検体・実際の確認測定の対応を調べる。',evidence:'注文ID、検体ID、報告ID、測定対象の対応と変更履歴。',limit:'署名された報告でも、物理検体を正しく確認した証明にはそれだけではならない。'}
        ],
        cloud:[
          {id:'run-swap',short:'依頼から命令への改変',title:'受け付けた計画と、装置へ渡す命令が違う',edge:'run',before:'ラボはSAMPLE-01を使うPLAN-01を受け付ける。',intervention:'侵害された実行変換ソフトが、対象をSAMPLE-02へ変更する。',after:'最終照合がなければ、承認外の対象への命令が生成される。',entry:'ラボ内の計画を装置命令へ変換するソフト。ネットワークからその変更権限に至る経路は別確認。',condition:'対象の変換処理を変更でき、利用者・検体・承認計画の制約が実行直前に適用されない。',defense:'装置へ渡す命令を、別に保護した承認計画と照合する。利用者ごとの対象制限も維持する。',evidence:'受付計画、生成命令、利用者と検体の権限、拒否・実行ログ。',limit:'実機で別検体を操作したことや、生物学的な影響は確認しない。'},
          {id:'result-swap',short:'結果の差し替え',title:'返された結果が、別の実験のものだった',edge:'result',before:'実験者はRUN-01の結果を受け取る。',intervention:'結果APIの登録・返却処理を侵害した攻撃者が、RUN-02の結果を渡す。',after:'誤った結果を使って、次の実験計画が決まる可能性がある。',entry:'結果の登録・返却API、またはその対応表を変更できる処理。',condition:'結果の内容か対応を変更でき、同じ利用者・実行・検体の記録との照合で止まらない。',defense:'元の測定記録、実行ID、検体ID、返却先を照合する。次の計画へ使う前に検証する。',evidence:'元の測定記録、返却データ、対応表の差分。次計画へ取り込まれたかも記録する。',limit:'閉ループでの生物学的な結果や被害は未実証。配列情報のOUTPUTも同じ対応確認の対象。'}
        ]
      };
      stories.lab=[
        {id:'local-import',short:'取り込む指示の改変',title:'研究室はオフラインでも、取り込んだ指示が変更されていた',edge:'local',before:'実験者はSAMPLE-01を使う計画を承認する。',intervention:'取り込み元の連携処理を侵害した攻撃者が、外部から渡す実行指示を変更する。',after:'研究室のソフトが無照合で取り込むと、承認外の命令が生成され得る。',entry:'研究室へ取り込むファイルの供給元。USBや別PCなどの経路が実在する場合だけ対象。',condition:'研究室が外部入力を取り込み、攻撃者がその入力を変更できる。実行前の承認照合で止まらない。接点がなければ不成立。',defense:'取り込み元と版を確認し、別に保持した承認計画と照合する。制御PCの隔離と入力検査を分ける。',evidence:'承認計画、取り込み前後の指示、実行命令の差分と、供給元の書き込み権限。',limit:'実際の研究室で経路が存在するかは未確認。菌の死滅や毒性は未実証。'},
        {id:'physical-mismatch',short:'検体と報告の不一致',title:'期待した検体と届いた検体が異なるのに、報告だけを信じる',edge:'sample-local',before:'研究室はSEQ-Aに対応するSAMPLE-01を受領する。',intervention:'合成会社側のデータが変更され、別の内容の検体に元の確認情報が付くという仮定。',after:'受領時の確認がなければ、想定と違う材料で実験を開始する可能性がある。',entry:'合成会社側の注文・製造・報告データ。研究室のネットワークへの侵入を必須としない。',condition:'上流で変更が起こり、製造・審査・報告の確認を通過し、届いた実物との不一致が見逃される。',defense:'注文・検体・報告の対応を確認する。必要な独立検査で、実物の内容を確かめる。',evidence:'発注原本、製造・報告の記録、受領IDと独立した確認結果。',limit:'物理検体の不一致から生物学的被害までは別検証。仮の配列IDだけでは実物の内容は証明できない。'}
      ];
      stories.attacker=[
        {id:'attacker-client',short:'発注側への介入',title:'発注側の送信処理に介入し、注文データを変更する',edge:'order',before:'実験者はSEQ-Aを承認する。',intervention:'攻撃者が発注用連携ソフトの変更権限を得たと仮定する。',after:'送信前の変更は、TLSで暗号化しても変更されたまま届く。',entry:'発注用連携ソフト。どう変更権限を得るかは、このデモでは再現していない。',condition:'実データを扱う処理に介入でき、承認原本との照合と会社側審査で止まらない。',defense:'独立した承認原本との照合、受付注文の確認、連携ソフトの変更管理。',evidence:'介入権限と、承認・送信・受付の差分を別に示す。',limit:'侵入自体も実設備の脆弱性も未実証。'},
        {id:'attacker-cloud',short:'ラボAPI鍵の悪用',title:'API鍵の取得によって、クラウドラボへの依頼が可能になる',edge:'run',before:'本人の承認した依頼だけが受理される予定。',intervention:'攻撃者が実験依頼の権限を持つ有効なAPI鍵を得たと仮定する。',after:'独立した承認がなければ、本人が承認していない依頼が受理され得る。',entry:'有効なAPI鍵と到達可能な実験依頼API。',condition:'鍵が対象の操作を許可する。鍵の取得、到達性、追加の承認・審査を確認する。',defense:'最小権限、鍵の失効・管理、実験承認との照合、操作記録。',evidence:'API鍵の操作範囲、承認履歴、受理または拒否の記録。',limit:'取得した鍵にない権限を自動的に得られるとは仮定しない。'}
      ];

      const oldTargets={'order-swap':'researcher','key-abuse':'researcher','manufacture-swap':'synthesis','report-swap':'synthesis','run-swap':'cloud','result-swap':'cloud','local-import':'lab','physical-mismatch':'synthesis'};
      const all=Object.entries(stories).filter(([actor])=>actor!=='attacker').flatMap(([actor,items])=>items.map(s=>({...s,actor,attack:{kind:'node',target:oldTargets[s.id]}})));
      const extra=[
        {id:'network-order',short:'通信途中の発注改変',title:'発注経路の途中で配列識別子が変わる',edge:'order',actor:null,attack:{kind:'edge',target:'order'},before:'実験者はSEQ-Aを送り、会社は同じ内容を受け取る予定。',intervention:'通信経路に介入できる攻撃者が、内容をSEQ-Bへ変更するという仮定。',after:'通信の完全性と承認照合が欠ければ、異なる注文が受理され得る。',entry:'実験者と合成会社を結ぶ通信経路。送信側・受付側の侵害とは別。',condition:'攻撃者が通信経路を変更でき、TLSを使用していないか相手検証が不適切。正しく使用・検証されたTLSでは、この内容改変は成立しない。',defense:'TLSの正しい使用・相手検証に加え、承認原本と受付注文を照合する。',evidence:'送信・受信データの差分と、通信経路・TLS設定の確認。',limit:'ネットワーク介入とTLSの不備は未確認。SEQ-Bの生物学的影響は評価しない。'},
        {id:'request-replay',short:'同じ依頼の再受理',title:'過去の実験依頼が、もう一度受理される',edge:'run',actor:null,attack:{kind:'edge',target:'run'},before:'承認した依頼REQ-01は一度だけ実行される。',intervention:'要求を再送できる主体が、同じ依頼を受付処理へ渡す。',after:'重複を識別しなければ、同じ実験が再度予約される可能性がある。',entry:'実験依頼の受け渡しと受付。同じ要求を正規のAPIへ再送できる権限が必要。',condition:'要求が再送可能で認証・審査を通り、受付・実行時の重複制御がない。TLS通信を観察するだけではこの能力は得られない。',defense:'依頼IDと承認を結び付け、同じ依頼の重複実行を拒否する。正当な再実験は新規承認として扱う。',evidence:'同一依頼IDの受付回数と予約・実行記録。',limit:'実装の重複制御は未検証。実機での二重実験は行わない。'},
        {id:'result-handoff',short:'結果と実行IDの不一致',title:'返却時の対応が変わり、別実行の結果を受け取る',edge:'result',actor:null,attack:{kind:'edge',target:'result'},before:'実験者はRUN-01に対応する結果を受領する。',intervention:'受け渡しの連携処理を侵害した攻撃者が、RUN-02の結果をRUN-01へ結び付ける。',after:'利用者が、別実行の結果を次の判断に使う可能性がある。',entry:'結果返却の対応付け処理。暗号化された通信の途中だけではなく、変更権限を持つ連携点の侵害を仮定。',condition:'結果の対応表を変更でき、返却先・検体・実行との照合で検出されない。',defense:'元の測定記録と、利用者・実行・検体の対応を確認する。',evidence:'元記録と返却記録の実行ID・検体ID・内容の比較。',limit:'実行結果への生物学的影響や、次実験の被害は未評価。'},
        {id:'sample-cloud-link',short:'検体と依頼の対応変更',title:'配送された検体が、別の実験依頼に登録される',edge:'sample-cloud',actor:null,attack:{kind:'edge',target:'sample-cloud'},before:'検体SAMPLE-01は、その注文と依頼に対応して登録される。',intervention:'検体登録の情報を変更できる主体が、対応する依頼IDを変更する。',after:'ラボが、別の依頼の材料として検体を扱う可能性がある。',entry:'物理輸送そのものではなく、輸送と依頼を結ぶ登録情報。',condition:'登録情報の変更権限があり、注文・検体・依頼の照合で止まらない。',defense:'受領時に注文・検体・依頼を照合し、登録履歴を残す。',evidence:'輸送記録、受領検体ID、登録情報、実験依頼の対応。',limit:'物理検体への直接的なネットワーク攻撃ではない。実物の内容は別確認。'},
        {id:'sample-local-link',short:'検体と報告の対応変更',title:'研究室への受け渡しで、検体に別の報告が付く',edge:'sample-local',actor:null,attack:{kind:'edge',target:'sample-local'},before:'研究室はSAMPLE-01と、それを確認した報告を受領する。',intervention:'報告・受領登録の情報を変更できる主体が、別検体の報告を付ける。',after:'研究室が、誤った確認情報を信じて実験を始める可能性がある。',entry:'受領検体と電子報告を対応付ける情報。物理輸送の途中を侵害したとは仮定しない。',condition:'対応情報を変更でき、実物の受領確認と独立した内容確認で不一致が見つからない。',defense:'注文・検体・確認報告の対応と、必要に応じた実物の独立確認。',evidence:'受領記録と報告対象の対応、変更履歴。',limit:'ネットワーク情報の不一致と、検体の生物学的性質は別の証拠が必要。'},
        {id:'plan-handoff',short:'計画の版の差し替え',title:'研究室へ渡る計画が、承認した版と違う',edge:'local',actor:null,attack:{kind:'edge',target:'local'},before:'実験者はPLAN-v2を承認し、研究室はその版を実行する。',intervention:'受け渡しデータを変更できる主体が、旧版PLAN-v1へ差し替える。',after:'確認がなければ、承認と異なる条件の命令が生成される。',entry:'計画を研究室へ渡す共有フォルダやファイル取り込み。経路が実在する場合だけ対象。',condition:'攻撃者が渡す版を変更でき、実行時の承認済み版との照合がない。閉じた環境で接点がなければ不成立。',defense:'承認版を保護し、実行に使うスナップショットと照合する。',evidence:'承認版、受領版、実行版と生成命令の対応。',limit:'現研究室のアクセス権や入力経路は未確認。'}
      ];
      all.push(...extra);all.forEach((s,i)=>s.code='S'+String(i+1).padStart(2,'0'));
      const scope=root.querySelector('#lss-scope'),list=root.querySelector('#lss-list'),svg=root.querySelector('svg.ls-flow'),map=root.querySelector('.ls-map');
      let selected=extra[0];
      const ns='http://www.w3.org/2000/svg';
      const labeledEdges={order:'実験者と合成会社の受け渡しを選択',run:'クラウドラボへの実験依頼を選択',result:'クラウドラボからの結果返却を選択','sample-cloud':'合成会社からクラウドラボへの検体を選択','sample-local':'合成会社から研究室への検体を選択',local:'実験者と研究室の計画と結果を選択'};
      function set(k,v){root.querySelector('#lss-'+k).textContent=v;}
      function matches(s){const v=scope.value;if(v==='all'||v==='actor:attacker')return true;const [kind,id]=v.split(':');return kind==='actor'?s.actor===id:s.edge===id||(id==='order'&&s.edge==='report');}
      function chooseScope(value){scope.value=value;const options=all.filter(matches);if(!options.some(s=>s.id===selected.id))selected=(value.startsWith('edge:')?options.find(s=>!s.actor):null)||options[0];show();}
      function show(){
        list.replaceChildren();
        all.filter(matches).forEach(s=>{const b=document.createElement('button');b.type='button';b.className='cursor-interaction';b.setAttribute('aria-pressed',String(s.id===selected.id));b.dataset.scenario=s.id;const code=document.createElement('span');code.className='ls-id';code.textContent=s.code;const body=document.createElement('span');body.className='ls-list-item';body.textContent=s.short;const meta=document.createElement('span');meta.className='ls-list-meta';meta.textContent=s.actor?'主体関連 · '+names[s.actor]:'二者間の受け渡し';body.appendChild(meta);b.appendChild(code);b.appendChild(body);b.addEventListener('click',()=>{selected=s;show();});list.appendChild(b);});
        ['title','before','intervention','after','condition','defense','entry','evidence','limit'].forEach(k=>set(k,selected[k]));
        set('category',selected.code+' · '+(selected.actor?'主体関連のシナリオ':'二者間の接点への介入')+' · 未実証');
        root.querySelectorAll('[data-actor]').forEach(b=>b.setAttribute('aria-pressed',String(scope.value==='actor:'+b.dataset.actor)));
        set('target',selected.attack.kind==='edge'?'攻撃矢印の接続先：二者間の接点（変更対象は右側で確認）':'攻撃矢印の接続先：'+names[selected.attack.target]+'内の処理');
        draw();
      }
      function draw(){
        const w=map.getBoundingClientRect().width||600,narrow=w<=480,h=narrow?610:490;map.style.height=h+'px';
        const sy=narrow?322:240,ly=narrow?562:442,ay=narrow?142:118,sx=w*(narrow?.23:.22),cx=w*(narrow?.77:.78),ax=w*(narrow?.23:.15);
        [['researcher',w*.5,8],['synthesis',sx,sy-24],['cloud',cx,sy-24],['attacker',ax,ay-24],['lab',w*.5,ly-24]].forEach(([id,x,y])=>{const node=root.querySelector('[data-node="'+id+'"]');node.style.left=x+'px';node.style.top=y+'px';});
        svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.replaceChildren();
        const title=document.createElementNS(ns,'title');title.textContent=selected.title;svg.appendChild(title);
        const defs=document.createElementNS(ns,'defs');
        for(const [id,color] of [['neutral','var(--ls-line)'],['selected','var(--ls-blue)'],['attack','var(--ls-red)']]){const m=document.createElementNS(ns,'marker');m.setAttribute('id','three-columns-arrow-'+id);m.setAttribute('viewBox','0 0 10 10');m.setAttribute('refX','9');m.setAttribute('refY','5');m.setAttribute('markerWidth','7');m.setAttribute('markerHeight','7');m.setAttribute('orient','auto-start-reverse');const p=document.createElementNS(ns,'path');p.setAttribute('d','M 0 0 L 10 5 L 0 10 z');p.setAttribute('fill',color);m.appendChild(p);defs.appendChild(m);}svg.appendChild(defs);
        const mid={order:[(w*.5-28+sx+16)/2,(66+sy-28)/2],run:[(w*.5+28+cx-16)/2,(66+sy-28)/2],result:[w*.85,sy*.55],'sample-cloud':[w*.5,sy+53],'sample-local':[(sx+10+w*.5-38)/2,(sy+28+ly-27)/2],local:[w*.5,sy+105]};
        function label(v,x,y,id){const t=document.createElementNS(ns,'text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('text-anchor','middle');t.textContent=v;if(id){t.classList.add('cursor-interaction');t.setAttribute('role','button');t.setAttribute('tabindex','0');t.setAttribute('aria-label',labeledEdges[id]);t.addEventListener('click',()=>chooseScope('edge:'+id));t.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseScope('edge:'+id);}});}svg.appendChild(t);}
        function edge(id,d,l,x,y,physical=false,both=false){const active=id===selected.edge||(id==='order'&&selected.edge==='report'),p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.setAttribute('class','ls-edge'+(active?' selected':'')+(physical?' physical':''));p.setAttribute('marker-end','url(#three-columns-arrow-'+(active?'selected':'neutral')+')');if(both)p.setAttribute('marker-start','url(#three-columns-arrow-'+(active?'selected':'neutral')+')');svg.appendChild(p);const hit=document.createElementNS(ns,'path');hit.setAttribute('d',d);hit.setAttribute('class','ls-hit cursor-interaction');hit.addEventListener('click',()=>chooseScope('edge:'+id));svg.appendChild(hit);label(l,x,y,id);}
        edge('order','M '+(w*.5-28)+' 66 L '+(sx+16)+' '+(sy-28),'発注・報告',w*.35,sy*.52,false,true);
        edge('run','M '+(w*.5+28)+' 66 L '+(cx-16)+' '+(sy-28),'実験依頼',w*.65,sy*.52);
        edge('result','M '+(cx+30)+' '+(sy-28)+' Q '+(w-15)+' '+(sy*.5)+' '+(w*.5+58)+' 54','結果返却',w*.86,sy*.48);
        edge('sample-cloud','M '+(sx+26)+' '+(sy+26)+' Q '+w*.5+' '+(sy+80)+' '+(cx-26)+' '+(sy+26),'検体',w*.5,sy+76,true);
        edge('sample-local','M '+(sx+10)+' '+(sy+28)+' L '+(w*.5-38)+' '+(ly-27),'検体',w*.29,sy+(ly-sy)*.63,true);
        edge('local','M '+w*.5+' 68 L '+w*.5+' '+(ly-27),'計画・結果',w*.5+36,sy+115,false,true);
        const end=selected.attack.kind==='edge'?mid[selected.attack.target]:{researcher:[w*.5-60,45],synthesis:[sx,sy-29],cloud:[cx-60,sy-10],lab:[w*.5-62,ly]}[selected.attack.target];
        if(end){const a=document.createElementNS(ns,'path');a.setAttribute('d','M '+(ax+38)+' '+(ay+10)+' Q '+(ax+55)+' '+(end[1]-40)+' '+end[0]+' '+end[1]);a.setAttribute('class','ls-edge attack');a.setAttribute('marker-end','url(#three-columns-arrow-attack)');svg.appendChild(a);if(selected.attack.kind==='edge'){const c=document.createElementNS(ns,'circle');c.setAttribute('cx',end[0]);c.setAttribute('cy',end[1]);c.setAttribute('r','5');c.setAttribute('fill','var(--ls-bg)');c.setAttribute('stroke','var(--ls-red)');c.setAttribute('stroke-width','2');svg.appendChild(c);}}
      }
      scope.addEventListener('change',()=>chooseScope(scope.value));root.querySelectorAll('[data-actor]').forEach(b=>b.addEventListener('click',()=>chooseScope('actor:'+b.dataset.actor)));
      new ResizeObserver(draw).observe(map);show();
    })();
  