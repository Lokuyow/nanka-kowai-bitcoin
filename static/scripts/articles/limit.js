(function(){
  var nodes = Array.prototype.slice.call(document.querySelectorAll('#capNodes .node'));
  var tally = document.getElementById('capTally');
  var msg = document.getElementById('capMsg');
  var go = document.getElementById('capGo');
  var card = document.getElementById('capCard');
  var capPair = ['2,200万枚', '22 million'];
  var running = false;
  var played = false;
  var rejected = 0;
  var msgPair = ['', ''];
  var LINES = [
    ['ノードA「元の上限を超える発行を確認。ブロックを拒否」', 'Node A: "Issuance exceeds the old cap. Block rejected."'],
    ['ノードB「同じ発行ルールで検証。ブロックを拒否」', 'Node B: "Checked against the same issuance rules. Block rejected."'],
    ['ノードC「上限を超えたブロックは台帳に加えません」', 'Node C: "A block that exceeds the cap cannot join my ledger."'],
    ['ノードD「元のルールに合わないので拒否」', 'Node D: "The block fails the old rules. Rejected."'],
    ['ノードE「このブロックには余分な発行がある。拒否」', 'Node E: "This block issues extra coins. Rejected."']
  ];
  function setMsg(ja, en){ msgPair = [ja, en]; msg.textContent = L(ja, en); }
  function stText(st){
    return st === 'sent' ? L('届いた', 'Received') : st === 'ng' ? L('× 拒否', '× Rejected') : L('待機中', 'Waiting');
  }
  function setSt(n, st){ n.dataset.st = st; n.querySelector('.st').textContent = stText(st); }
  function renderGo(){ go.textContent = played ? L('もう一度試す', 'Try again') : L('ブロックを送る', 'Send the block'); }
  document.querySelectorAll('#capBtns button').forEach(function(b){
    b.addEventListener('click', function(){
      if (running) return;
      document.querySelectorAll('#capBtns button').forEach(function(x){ x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('on');
      b.setAttribute('aria-pressed', 'true');
      capPair = [b.dataset.cap, b.dataset.capEn];
    });
  });
  function setTally(count){
    rejected = count;
    var total = '<b>' + count + ' / ' + nodes.length + '</b>';
    tally.innerHTML = L('ブロックを拒否したノード ', 'Nodes that rejected the block ') + total;
  }
  document.addEventListener('langchange', function(){
    nodes.forEach(function(n){ setSt(n, n.dataset.st || 'wait'); });
    setTally(rejected);
    msg.textContent = L(msgPair[0], msgPair[1]);
    renderGo();
  });
  go.addEventListener('click', function(){
    if (running) return;
    running = true;
    played = true;
    go.disabled = true;
    card.classList.remove('stamped');
    nodes.forEach(function(n){
      n.className = 'node';
      setSt(n, 'wait');
    });
    setTally(0);
    setMsg('上限を' + capPair[0] + 'に変え、増やした分の発行を含むブロックを送った…', 'Sending a block that issues extra coins under your new cap (' + capPair[1] + ')…');
    var i = 0;
    function step(){
      if (i > 0) {
        var prev = nodes[i - 1];
        prev.classList.add('ng');
        setSt(prev, 'ng');
        setTally(i);
        setMsg(LINES[i - 1][0], LINES[i - 1][1]);
      }
      if (i >= nodes.length) {
        card.classList.add('stamped');
        setMsg('5つのノードはそれぞれ元のルールで確かめ、ブロックを拒否した。', 'All five nodes checked the block against the old rules and rejected it independently.');
        renderGo();
        go.disabled = false;
        running = false;
        return;
      }
      nodes[i].classList.add('sent');
      setSt(nodes[i], 'sent');
      i++;
      setTimeout(step, 620);
    }
    setTimeout(step, 350);
  });
  renderGo();
})();
