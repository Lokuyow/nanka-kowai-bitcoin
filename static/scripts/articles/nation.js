(function(){
  // 作り手の行と、その時代に作り手だったかどうか（時代は左から 前3000, 前600, 1024, 1661, 1870, 1971, 2009）。
  // 「モノ」は、金や銀のように発行する人がいなくても物そのものに価値があると考えられたお金。
  var LANES = [
    {key: 'state', ja: '国・王', en: 'State', on: [0, 1, 1, 0, 1, 1, 1]},
    {key: 'private', ja: '民間', en: 'Private', on: [0, 0, 1, 1, 1, 0, 0]},
    {key: 'goods', ja: 'モノ', en: 'Goods', on: [1, 1, 0, 0, 1, 0, 0]},
    {key: 'rule', ja: 'ルール', en: 'Rules', on: [0, 0, 0, 0, 0, 0, 1]}
  ];
  var lanes = document.getElementById('lanes');
  var eraBtns = lanes.querySelectorAll('.era-btn');
  var panels = document.querySelectorAll('#eraPanels .era');
  var prev = document.getElementById('eraPrev');
  var next = document.getElementById('eraNext');
  var pos = document.getElementById('eraPos');
  var total = eraBtns.length;
  var current = 0;
  var labels = [];

  // 行は飾りの図なので、読み上げからは外す。マスを押しても時代を選べる。
  LANES.forEach(function(lane){
    var lbl = document.createElement('span');
    lbl.className = 'lane-lbl ' + lane.key;
    lbl.setAttribute('aria-hidden', 'true');
    labels.push({el: lbl, lane: lane});
    lanes.appendChild(lbl);
    lane.on.forEach(function(on, i){
      var cell = document.createElement('span');
      cell.className = 'cell ' + lane.key + (on ? ' on' : '');
      cell.setAttribute('aria-hidden', 'true');
      cell.dataset.era = i;
      cell.addEventListener('click', function(){ select(i); });
      lanes.appendChild(cell);
    });
  });

  function renderLabels(){
    labels.forEach(function(x){ x.el.textContent = L(x.lane.ja, x.lane.en); });
  }

  function select(i){
    current = Math.max(0, Math.min(total - 1, i));
    eraBtns.forEach(function(b, j){ b.setAttribute('aria-pressed', String(j === current)); });
    lanes.querySelectorAll('.cell').forEach(function(c){ c.classList.toggle('sel', +c.dataset.era === current); });
    panels.forEach(function(p, j){
      var on = j === current;
      p.classList.toggle('off', !on);
      if (on) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
    });
    prev.disabled = current === 0;
    next.disabled = current === total - 1;
    pos.textContent = (current + 1) + ' / ' + total;
  }

  eraBtns.forEach(function(b, j){ b.addEventListener('click', function(){ select(j); }); });
  prev.addEventListener('click', function(){ select(current - 1); });
  next.addEventListener('click', function(){ select(current + 1); });
  document.addEventListener('langchange', renderLabels);
  renderLabels();
  select(0);
})();

(function(){
  // 通貨どうしの競争の単純なモデル。
  // 選ばれやすさ = −(1年に増える量) −(使いにくさ)。決まりがあると、持つお金の7割は国の通貨に固定される。
  // 残りを選ばれやすさで分け合い、毎年その割合へ4分の1ずつ近づく（乗り換えには時間がかかる）。
  var YEARS = 20, FORCED = 0.7, SPEED = 0.25, K = 40;
  var GOLD = {infl: 0.01, cost: 0.04}, BTC = {infl: 0, cost: 0.06};
  var law = true;
  var range = document.getElementById('inflRange');
  var inflVal = document.getElementById('inflVal');
  var lawOn = document.getElementById('lawOn'), lawOff = document.getElementById('lawOff');
  var areas = ['areaState', 'areaGold', 'areaBtc'].map(function(id){ return document.getElementById(id); });
  var shEls = ['shState', 'shGold', 'shBtc'].map(function(id){ return document.getElementById(id); });
  var keepVal = document.getElementById('keepVal');
  var simOut = document.getElementById('simOut');

  function message(law, s, v, st){
    return law
      ? (s >= 0.05
        ? L('国の通貨は年' + v + '%ずつ増えても、20年後も' + st + 'が使われている。税金や給料で使う決まりがあるので、目減りしても手放せない。', 'Even growing ' + v + '% a year, the state currency still makes up ' + st + ' after 20 years. Rules for taxes and wages mean people cannot let go of it, even as it loses value.')
        : L('国の通貨は増やしすぎていないので、決まりがなくても選ばれやすい。20年後も' + st + 'が使われている。', 'It is not growing too fast, so people would choose it even without the rules. After 20 years it still makes up ' + st + '.'))
      : (s >= 0.05
        ? L('人々は価値を保ちやすいお金へ移り、20年後の国の通貨は' + st + 'だけになった。増やしすぎると選ばれなくなる。', 'People move to money that holds its value, and after 20 years the state currency is down to ' + st + '. Grow it too fast and no one chooses it.')
        : L('増やしすぎなければ、国の通貨も選ばれ続ける（' + st + '）。競争があると、発行する側に価値を守る理由が生まれる。', 'If it is not grown too fast, the state currency keeps being chosen (' + st + '). Competition gives issuers a reason to protect value.'));
  }
  var ghosts = [0, 1, 2, 3].map(function(){
    var g = document.createElement('p');
    g.className = 'simout ghost';
    g.setAttribute('aria-hidden', 'true');
    simOut.parentNode.insertBefore(g, simOut);
    return g;
  });
  var box = document.createElement('div');
  box.className = 'simbox';
  simOut.parentNode.insertBefore(box, ghosts[0]);
  ghosts.forEach(function(g){ box.appendChild(g); });
  box.appendChild(simOut);
  function run(s){
    var a = [Math.exp(-K * s), Math.exp(-K * (GOLD.infl + GOLD.cost)), Math.exp(-K * (BTC.infl + BTC.cost))];
    var sum = a[0] + a[1] + a[2];
    var free = a.map(function(x){ return x / sum; });
    var target = law ? [FORCED + (1 - FORCED) * free[0], (1 - FORCED) * free[1], (1 - FORCED) * free[2]] : free;
    var sh = [1, 0, 0], hist = [sh.slice()];
    for (var y = 0; y < YEARS; y++) {
      sh = sh.map(function(v, i){ return v + SPEED * (target[i] - v); });
      hist.push(sh.slice());
    }
    return hist;
  }
  function x(y){ return 4 + 312 * y / YEARS; }
  function yy(v){ return 132 - 124 * v; }
  function band(hist, lo, hi){
    var top = '', bot = '';
    hist.forEach(function(h, y){
      var b = 0; for (var i = 0; i < lo; i++) b += h[i];
      top += (y ? 'L' : 'M') + x(y).toFixed(1) + ' ' + yy(b + h[lo]).toFixed(1);
    });
    for (var y = YEARS; y >= 0; y--) {
      var b = 0; for (var i = 0; i < lo; i++) b += hist[y][i];
      bot += 'L' + x(y).toFixed(1) + ' ' + yy(b).toFixed(1);
    }
    return top + bot + 'Z';
  }
  function pct(v){ return Math.round(v * 100) + '%'; }
  function render(){
    var s = +range.value / 100;
    inflVal.textContent = range.value + '%';
    lawOn.setAttribute('aria-pressed', String(law));
    lawOff.setAttribute('aria-pressed', String(!law));
    var hist = run(s), end = hist[YEARS];
    areas.forEach(function(el, i){ el.setAttribute('d', band(hist, i)); });
    shEls.forEach(function(el, i){ el.textContent = pct(end[i]); });
    var keep = 100 / Math.pow(1 + s, YEARS);
    keepVal.textContent = L(Math.round(keep) + '万円分', '¥' + (Math.round(keep) * 10000).toLocaleString('en-US') + ' worth');
    simOut.textContent = message(law, s, range.value, pct(end[0]));
    // 4通りの文を見えない形で重ね、いちばん長い文に高さを合わせる（切り替えても下が動かない）
    ghosts.forEach(function(g, i){ g.textContent = message(i < 2, i % 2 ? 0.2 : 0, '20', '100%'); });
    if (window.updateRangeFill) window.updateRangeFill(range);
  }
  range.addEventListener('input', render);
  lawOn.addEventListener('click', function(){ law = true; render(); });
  lawOff.addEventListener('click', function(){ law = false; render(); });
  document.addEventListener('langchange', render);
  render();
})();
