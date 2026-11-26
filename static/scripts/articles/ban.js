(function(){
  var COUNTRIES = [
    {n: 'アメリカ', e: 'US', eIn: 'the US', x: 80, y: 66},
    {n: 'ドイツ', e: 'Germany', x: 148, y: 52},
    {n: '中国', e: 'China', x: 212, y: 70},
    {n: '日本', e: 'Japan', x: 238, y: 92},
    {n: 'ブラジル', e: 'Brazil', x: 104, y: 150},
    {n: 'オーストラリア', e: 'Australia', x: 224, y: 152}
  ];
  function cname(c){ return L(c.n, c.e); }
  function cprose(c){ return c.eIn || c.e; }
  var nameEls = [];
  var lastLog = ['国のボタンを押して「禁止」にしてみよう。何が起きる？', 'Press a country button and "ban" it. What happens?'];
  function setLog(ja, en){ lastLog = [ja, en]; log.textContent = L(ja, en); }
  function btnLabel(c, isBanned){
    return isBanned ? L(c.n + '（禁止中）', c.e + ' (banned)') : L(c.n + 'を禁止', 'Ban ' + cprose(c));
  }
  function renderNames(){
    COUNTRIES.forEach(function(c, i){
      nameEls[i].tx.textContent = cname(c);
      nameEls[i].b.textContent = btnLabel(c, !!banned[i]);
    });
  }
  document.addEventListener('langchange', function(){
    renderNames();
    log.textContent = L(lastLog[0], lastLog[1]);
    renderState();
  });
  var NS = 'http://www.w3.org/2000/svg';
  var nodesG = document.getElementById('banNodes');
  var minersG = document.getElementById('banMiners');
  var btnsWrap = document.getElementById('banBtns');
  var log = document.getElementById('banLog');
  var countEl = document.getElementById('banCount');
  var banned = {};
  var state = document.getElementById('banState');
  function renderState(){
    var active = COUNTRIES.length - Object.keys(banned).length;
    countEl.textContent = COUNTRIES.length - active;
    state.classList.toggle('ok', active > 0);
    state.textContent = active ? L('図の中で稼働中', 'Running in this model') : L('図の中に稼働拠点なし', 'No active sites in this model');
  }
  COUNTRIES.forEach(function(c, i){
    var dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', c.x); dot.setAttribute('cy', c.y); dot.setAttribute('r', 7);
    dot.setAttribute('fill', '#527c72'); dot.id = 'bnode' + i;
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
      c.miners.push(m);
    }
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = btnLabel(c, false);
    b.dataset.i = i;
    b.setAttribute('aria-pressed', 'false');
    btnsWrap.appendChild(b);
    nameEls.push({tx: tx, b: b});
  });
  log.textContent = L(lastLog[0], lastLog[1]);
  renderState();
  btnsWrap.addEventListener('click', function(e){
    var b = e.target.closest('button');
    if (!b) return;
    var i = +b.dataset.i, c = COUNTRIES[i];
    var dot = document.getElementById('bnode' + i);
    var x = document.getElementById('bx' + i);
    if (!banned[i]) {
      banned[i] = true;
      b.classList.add('banned');
      b.setAttribute('aria-pressed', 'true');
      b.textContent = btnLabel(c, true);
      dot.setAttribute('fill', '#bbb');
      x.style.display = '';
      c.miners.forEach(function(miner){ miner.style.display = 'none'; });
      if (Object.keys(banned).length === COUNTRIES.length) {
        setLog('図に出ている6か国の拠点が止まった。ほかの地域で続ける参加者がいれば、ネットワークは動き続けられる。', 'All six countries shown have stopped. The network can keep running if participants remain elsewhere.');
      } else {
        setLog(c.n + 'の拠点が止まった。ほかの国の拠点は動いている。', 'Sites in ' + cprose(c) + ' stopped. Sites in other countries are still running.');
      }
    } else {
      delete banned[i];
      b.classList.remove('banned');
      b.setAttribute('aria-pressed', 'false');
      b.textContent = btnLabel(c, false);
      dot.setAttribute('fill', '#527c72');
      x.style.display = 'none';
      c.miners.forEach(function(miner){ miner.style.display = ''; });
      setLog(c.n + 'の禁止を解除し、図の拠点を再開した。', 'The ban in ' + cprose(c) + ' was lifted, and its sites in the diagram resumed.');
    }
    renderState();
  });
})();
