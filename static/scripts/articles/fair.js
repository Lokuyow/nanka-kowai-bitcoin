(function(){
  var PLANS = {
    y2011: {start: 10, final: 5200, events: [
      {h: '2011年：大きく値下がり、「やっぱり怪しい」と騒がれた', v: 1.2, peak: null},
      {h: '2014年：取引所が破たんし、最高値から8割下がった', v: 90, peak: 450},
      {h: '2018年：熱狂が冷めて、また8割下がった', v: 500, peak: 2400},
      {h: '2022年：大手の破たんでまた大きく下がった', v: 1500, peak: 4600}
    ]},
    y2015: {start: 10, final: 870, events: [
      {h: '2018年：熱狂が冷めて、8割下がった', v: 55, peak: 280},
      {h: '2022年：大手の破たんでまた大きく下がった', v: 240, peak: 800}
    ]},
    y2019: {start: 10, final: 350, events: [
      {h: '2020年：世界的な混乱で一時半分になった', v: 5, peak: null},
      {h: '2022年：大手の破たんでまた大きく下がった', v: 90, peak: 320}
    ]},
    y2023: {start: 10, final: 62, events: [
      {h: '2025年：最高値から3割ほど下がった', v: 38, peak: 55}
    ]}
  };
  // 英語版はドル建て価格テーブルから評価額を計算する（投資額 $1,000）。
  // buy はその年の半ば（6月末終値。2011年は6月の Mt. Gox 事件直前の水準 $17）、
  // イベント価格は各局面の実際の安値・高値、now は固定の参照価格 $100,000。
  var PRICES_EN = {
    y2011: {buy: 17, now: 100000, events: [
      {p: 2, peak: null},
      {p: 230, peak: 1150},
      {p: 3122, peak: 19783},
      {p: 15476, peak: 69000}
    ]},
    y2015: {buy: 263, now: 100000, events: [
      {p: 3122, peak: 19783},
      {p: 15476, peak: 69000}
    ]},
    y2019: {buy: 10849, now: 100000, events: [
      {p: 4971, peak: null},
      {p: 15476, peak: 69000}
    ]},
    y2023: {buy: 30476, now: 100000, events: [
      {p: 88000, peak: 126198}
    ]}
  };
  var PLANS_EN = {};
  Object.keys(PRICES_EN).forEach(function(k){
    var t = PRICES_EN[k];
    PLANS_EN[k] = {start: 1000, final: Math.round(1000 * t.now / t.buy), events: t.events.map(function(e){
      return {h: '', v: Math.round(1000 * e.p / t.buy), peak: e.peak ? Math.round(1000 * e.peak / t.buy) : null};
    })};
  });
  function plans(){ return window.LANG === 'en' ? PLANS_EN : PLANS; }
  var HEADS_EN = {
    y2011: ['2011: a big drop — "just as shady as we thought", people said',
            '2014: an exchange collapsed, down 80% from the peak',
            '2018: the mania cooled, down 80% again',
            '2022: a major firm collapsed, another big drop'],
    y2015: ['2018: the mania cooled, down 80%',
            '2022: a major firm collapsed, another big drop'],
    y2019: ['2020: in the global turmoil, it briefly halved',
            '2022: a major firm collapsed, another big drop'],
    y2023: ['2025: down about 30% from the peak']
  };
  var plan = null, planKey = null, idx = 0, pts = [], phase = 'crisis';
  var simArea = document.getElementById('simArea');
  var simVal = document.getElementById('simVal');
  var simHead = document.getElementById('simHead');
  var simMsg = document.getElementById('simMsg');
  var simLine = document.getElementById('simLine');
  var simDots = document.getElementById('simDots');
  var baseLine = document.getElementById('baseLine');
  var btnSell = document.getElementById('btnSell');
  var btnHold = document.getElementById('btnHold');
  var btnReset = document.getElementById('btnReset');
  var yearBtns = document.querySelectorAll('#yearPick button');
  function fmt(v){
    if (window.LANG === 'en') return '$' + Math.round(v).toLocaleString('en-US');
    var s = (v % 1 === 0) ? String(Math.round(v)) : v.toFixed(1);
    return Number(s).toLocaleString('ja-JP') + '万円';
  }
  function yPix(v){
    var lo = window.LANG === 'en' ? Math.log10(80) : Math.log10(0.8);
    var hi = window.LANG === 'en' ? Math.log10(10000000) : Math.log10(6000);
    var t = (Math.log10(v) - lo) / (hi - lo);
    return 118 - t * (118 - 12);
  }
  function draw(){
    var total = plan.events.length + 1;
    var line = '', dots = '';
    pts.forEach(function(v, i){
      var x = 14 + (292 * i / total), y = yPix(v);
      line += x.toFixed(1) + ',' + y.toFixed(1) + ' ';
      dots += '<circle class="' + (i === pts.length - 1 ? 'dotnow' : 'dot') + '" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4"/>';
    });
    simLine.setAttribute('points', line);
    simDots.innerHTML = dots;
    var by = yPix(plan.start).toFixed(1);
    baseLine.setAttribute('y1', by);
    baseLine.setAttribute('y2', by);
  }
  function renderSim(){
    if (!plan) return;
    draw();
    var ev = plan.events[Math.min(idx, plan.events.length - 1)];
    if (phase === 'done') {
      simVal.textContent = fmt(plan.final);
      simHead.textContent = L('シミュレーション終了', 'End of the simulation');
      simMsg.textContent = L('最後まで保有した場合の評価額。途中で売っていれば、その場面の金額で結果が決まる。', 'This is the value if you held until the end. Selling earlier would have locked in the value at that point.');
    } else if (phase === 'sold') {
      simVal.textContent = fmt(ev.v);
      simHead.textContent = L(ev.h, HEADS_EN[planKey][idx]);
      simMsg.textContent = L('ここで手放した。早く買うことは暴落のたびに「売るかどうか」を迫られ続けることでもあった。', 'You let go here. Buying early also meant being pressed, at every crash, with the question of whether to sell.');
    } else {
      simVal.textContent = fmt(ev.v);
      simHead.textContent = L(ev.h, HEADS_EN[planKey][idx]);
      simMsg.textContent = ev.peak ? L('最高値では' + fmt(ev.peak) + 'まで育っていた。売るか、持ち続けるか。', 'At the peak it had grown to ' + fmt(ev.peak) + '. Sell, or keep holding?') : L('売るか、持ち続けるか。', 'Sell, or keep holding?');
    }
  }
  function crisis(){
    var ev = plan.events[idx];
    pts.push(ev.v);
    phase = 'crisis';
    btnSell.hidden = false;
    btnHold.hidden = false;
    btnReset.hidden = true;
    renderSim();
  }
  function start(key){
    plan = plans()[key]; planKey = key;
    idx = 0;
    pts = [plan.start];
    simArea.hidden = false;
    yearBtns.forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-year') === key); });
    crisis();
  }
  function finish(){
    pts.push(plan.final);
    phase = 'done';
    btnSell.hidden = true;
    btnHold.hidden = true;
    btnReset.hidden = false;
    renderSim();
  }
  yearBtns.forEach(function(b){
    b.addEventListener('click', function(){ start(b.getAttribute('data-year')); });
  });
  btnHold.addEventListener('click', function(){
    idx++;
    if (idx >= plan.events.length) finish(); else crisis();
  });
  btnSell.addEventListener('click', function(){
    phase = 'sold';
    renderSim();
    btnSell.hidden = true;
    btnHold.hidden = true;
    btnReset.hidden = false;
  });
  btnReset.addEventListener('click', function(){
    simArea.hidden = true;
    yearBtns.forEach(function(b){ b.classList.remove('on'); });
  });
  function rebuildPts(){
    pts = [plan.start];
    var n = phase === 'done' ? plan.events.length : idx + 1;
    for (var i = 0; i < n; i++) pts.push(plan.events[i].v);
    if (phase === 'done') pts.push(plan.final);
  }
  document.addEventListener('langchange', function(){
    if (plan) { plan = plans()[planKey]; rebuildPts(); renderSim(); }
    else simVal.textContent = fmt(plans().y2011.start);
  });
  if (!plan) simVal.textContent = fmt(plans().y2011.start);
})();
