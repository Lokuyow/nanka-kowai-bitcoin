(function(){
  var COUNTRIES = [
    {n: 'アメリカ', e: 'USA', x: 80, y: 66},
    {n: 'ドイツ', e: 'Germany', x: 148, y: 52},
    {n: '中国', e: 'China', x: 212, y: 70},
    {n: '日本', e: 'Japan', x: 238, y: 92},
    {n: 'ブラジル', e: 'Brazil', x: 104, y: 150},
    {n: 'オーストラリア', e: 'Australia', x: 224, y: 152}
  ];
  function cname(c){ return L(c.n, c.e); }
  var nameEls = [];
  var lastLog = ['国のボタンを押して「禁止」にしてみよう。何が起きる？', 'Press a country button and "ban" it. What happens?'];
  function setLog(ja, en){ lastLog = [ja, en]; log.textContent = L(ja, en); }
  function renderNames(){
    COUNTRIES.forEach(function(c, i){
      nameEls[i].tx.textContent = cname(c);
      nameEls[i].b.textContent = banned[i] ? L(c.n + '（禁止中）', c.e + ' (banned)') : L(c.n + 'を禁止', 'Ban ' + c.e);
    });
  }
  document.addEventListener('langchange', function(){
    renderNames();
    log.textContent = L(lastLog[0], lastLog[1]);
  });
  var NS = 'http://www.w3.org/2000/svg';
  var nodesG = document.getElementById('banNodes');
  var minersG = document.getElementById('banMiners');
  var btnsWrap = document.getElementById('banBtns');
  var log = document.getElementById('banLog');
  var countEl = document.getElementById('banCount');
  var banned = {};
  COUNTRIES.forEach(function(c, i){
    var dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', c.x); dot.setAttribute('cy', c.y); dot.setAttribute('r', 7);
    dot.setAttribute('fill', '#f7931a'); dot.id = 'bnode' + i;
    nodesG.appendChild(dot);
    var x1 = document.createElementNS(NS, 'path');
    x1.setAttribute('d', 'M' + (c.x - 5) + ' ' + (c.y - 5) + ' L' + (c.x + 5) + ' ' + (c.y + 5) + ' M' + (c.x + 5) + ' ' + (c.y - 5) + ' L' + (c.x - 5) + ' ' + (c.y + 5));
    x1.setAttribute('stroke', '#d33'); x1.setAttribute('stroke-width', '2.5'); x1.setAttribute('stroke-linecap', 'round');
    x1.id = 'bx' + i; x1.style.display = 'none';
    nodesG.appendChild(x1);
    var tx = document.createElementNS(NS, 'text');
    tx.setAttribute('x', c.x); tx.setAttribute('y', c.y - 13);
    tx.setAttribute('text-anchor', 'middle');
    tx.textContent = cname(c);
    nodesG.appendChild(tx);
    c.miners = [];
    for (var k = 0; k < 2; k++) {
      var m = document.createElementNS(NS, 'circle');
      var mx = c.x + (k === 0 ? -11 : 11), my = c.y + 11;
      m.setAttribute('cx', mx); m.setAttribute('cy', my); m.setAttribute('r', 4);
      m.setAttribute('fill', '#1a1a1a');
      minersG.appendChild(m);
      c.miners.push({el: m, hx: mx, hy: my});
    }
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = L(c.n + 'を禁止', 'Ban ' + c.e);
    b.dataset.i = i;
    btnsWrap.appendChild(b);
    nameEls.push({tx: tx, b: b});
  });
  log.textContent = L(lastLog[0], lastLog[1]);
  function unbannedList(except){
    return COUNTRIES.filter(function(c, i){ return !banned[i] && i !== except; });
  }
  btnsWrap.addEventListener('click', function(e){
    var b = e.target.closest('button');
    if (!b) return;
    var i = +b.dataset.i, c = COUNTRIES[i];
    var dot = document.getElementById('bnode' + i);
    var x = document.getElementById('bx' + i);
    if (!banned[i]) {
      banned[i] = true;
      b.classList.add('banned');
      b.textContent = L(c.n + '（禁止中）', c.e + ' (banned)');
      dot.setAttribute('fill', '#bbb');
      x.style.display = '';
      var targets = unbannedList(i);
      c.miners.forEach(function(mn, k){
        if (targets.length) {
          var t = targets[Math.floor(Math.random() * targets.length)];
          mn.el.setAttribute('cx', t.x + (k === 0 ? -11 : 11));
          mn.el.setAttribute('cy', t.y + 11);
          mn.el.style.opacity = '1';
        } else {
          mn.el.style.opacity = '.15';
        }
      });
      var n = Object.keys(banned).length;
      countEl.textContent = n;
      if (c.n === '中国') setLog('中国が禁止。2021年に実際にあったことで、採掘は国外へ移り、ネットワークは止まらなかった。', 'China banned it. This really happened in 2021 — mining moved abroad and the network never stopped.');
      else if (n >= 6) setLog('全部の国が禁止した。表立った拠点はなくなっても、参加者同士のネットワーク自体は消えていない。そもそも全部の国が足並みをそろえること自体、起きにくい。', 'Every country banned it. Even with no public bases left, the network of participants itself hasn\'t vanished. And getting every country to move in lockstep is unlikely in the first place.');
      else setLog(c.n + 'が禁止。採掘と参加者は国外へ移った。ネットワークは止まらない。', c.e + ' banned it. Mining and participants moved abroad. The network doesn\'t stop.');
    } else {
      delete banned[i];
      b.classList.remove('banned');
      b.textContent = L(c.n + 'を禁止', 'Ban ' + c.e);
      dot.setAttribute('fill', '#f7931a');
      x.style.display = 'none';
      c.miners.forEach(function(mn){
        mn.el.setAttribute('cx', mn.hx);
        mn.el.setAttribute('cy', mn.hy);
        mn.el.style.opacity = '1';
      });
      countEl.textContent = Object.keys(banned).length;
      setLog(c.n + 'の禁止が解けた。活動は戻ってきた。', 'The ban in ' + c.e + ' was lifted. Activity came back.');
    }
  });
})();
