(function(){
  var SCENES = [
    {title: '朝：カフェでコーヒーを買う', choices: [
      {label: '円で払う', out: 'いつも通り何も考えずに払えた。'},
      {label: 'ビットコインで払う', out: 'その場で払えた。ただ、今朝の値段でいくら分かを少しだけ考えた。'}
    ]},
    {title: '昼：海外の友だちに送金する', choices: [
      {label: '銀行経由で送る', out: '手数料がかかり、着くのは数日後になった。'},
      {label: 'ビットコインで送る', out: 'すぐに着いた。でも送り先を間違えないよう、3回見直した。'}
    ]},
    {title: '夜：余ったお金をしまっておく', choices: [
      {label: '銀行に預ける', out: '額面は減らない。その安心感で眠れる。'},
      {label: 'ビットコインで持つ', out: '寝る前につい値段を確認してしまった。'}
    ]}
  ];
  var SCENES_EN = [
    {title: 'Morning: buying coffee at a café', choices: [
      {label: 'Pay in dollars', out: 'As always, you paid without thinking.'},
      {label: 'Pay in Bitcoin', out: "You paid on the spot. But you did think for a moment about how much that was at this morning's price."}
    ]},
    {title: 'Midday: sending money to a friend overseas', choices: [
      {label: 'Send via a bank', out: 'A fee applied, and it arrived a few days later.'},
      {label: 'Send in Bitcoin', out: 'It arrived right away. But you triple-checked the destination so as not to get it wrong.'}
    ]},
    {title: 'Night: putting away the money left over', choices: [
      {label: 'Deposit it in a bank', out: 'The amount will not shrink. You can sleep with that peace of mind.'},
      {label: 'Hold it in Bitcoin', out: 'Before bed, you caught yourself checking the price.'}
    ]}
  ];
  SCENES.forEach(function(s, i){
    s.titleEn = SCENES_EN[i].title;
    s.choices.forEach(function(c, j){
      c.labelEn = SCENES_EN[i].choices[j].label;
      c.outEn = SCENES_EN[i].choices[j].out;
    });
  });

  var idx = 0, picks = [], currentOut = null, done = false;
  var sceneArea = document.getElementById('sceneArea');
  var recapArea = document.getElementById('recapArea');
  var sceneTitle = document.getElementById('sceneTitle');
  var sceneBtns = document.getElementById('sceneBtns');
  var sceneOut = document.getElementById('sceneOut');
  var recapList = document.getElementById('recapList');
  function renderScene(){
    var s = SCENES[idx];
    sceneTitle.textContent = L(s.title, s.titleEn);
    sceneOut.textContent = currentOut ? L(currentOut.out, currentOut.outEn) : '';
    sceneBtns.innerHTML = '';
    if (currentOut) {
      var last = idx >= SCENES.length - 1;
      var nb = document.createElement('button');
      nb.type = 'button';
      nb.className = 'primary-btn';
      nb.textContent = last ? L('1日を終える', 'End the day') : L('次の場面へ', 'Next scene');
      nb.addEventListener('click', function(){
        if (last) finish();
        else { idx++; currentOut = null; renderScene(); }
      });
      sceneBtns.appendChild(nb);
    } else {
      s.choices.forEach(function(c){
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = L(c.label, c.labelEn);
        b.addEventListener('click', function(){
          picks.push({scene: idx, choice: c});
          currentOut = c;
          renderScene();
        });
        sceneBtns.appendChild(b);
      });
    }
  }
  function renderRecap(){
    recapList.innerHTML = picks.map(function(p){
      var s = SCENES[p.scene];
      var chip = window.LANG === 'en' ? s.titleEn.split(':')[0] : s.title.split('：')[0];
      return '<div class="recaprow"><span class="chip">' + chip + '</span><p><b>' + L(p.choice.label, p.choice.labelEn) + '</b>' + L('：', ': ') + L(p.choice.out, p.choice.outEn) + '</p></div>';
    }).join('');
  }
  function finish(){
    done = true;
    sceneArea.hidden = true;
    recapArea.hidden = false;
    renderRecap();
  }
  document.getElementById('btnDayAgain').addEventListener('click', function(){
    idx = 0;
    picks = [];
    currentOut = null;
    done = false;
    recapArea.hidden = true;
    sceneArea.hidden = false;
    renderScene();
  });
  document.addEventListener('langchange', function(){
    if (done) renderRecap();
    else renderScene();
  });
  renderScene();
})();
