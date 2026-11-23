(function(){
  // 作り手の行と、その時代に作り手だったかどうか（時代は左から 708, 12世紀, 1600, 1661, 1871, 1899, 2009）。
  var LANES = [
    {key: 'state', ja: '国', en: 'State', on: [1, 0, 1, 1, 1, 1, 1]},
    {key: 'han', ja: '藩', en: 'Domains', on: [0, 0, 0, 1, 0, 0, 0]},
    {key: 'private', ja: '民間', en: 'Private', on: [0, 1, 1, 1, 1, 0, 0]},
    {key: 'foreign', ja: '外国', en: 'Foreign', on: [0, 1, 1, 0, 0, 0, 0]},
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
