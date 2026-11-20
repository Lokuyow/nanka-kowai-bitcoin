(function(){
  var nodes = Array.prototype.slice.call(document.querySelectorAll('#capNodes .node'));
  var tally = document.getElementById('capTally');
  var msg = document.getElementById('capMsg');
  var go = document.getElementById('capGo');
  var card = document.getElementById('capCard');
  var capPair = ['2,200万枚', '22 million'];
  var running = false;
  var played = false;
  var lastTally = [0, 0, 0];
  var msgPair = ['', ''];
  var LINES = [
    ['ノードA「上限が約束と違う。受け取れません」', 'Node A: "The cap differs from the promise. I can\'t accept it."'],
    ['ノードB「その版とは取引しません」', 'Node B: "I won\'t trade with that version."'],
    ['ノードC「ルールが違うので、別の通貨として扱います」', 'Node C: "Different rules — I\'ll treat it as a different currency."'],
    ['ノードD「今までの版を使い続けます」', 'Node D: "I\'ll keep using the current version."'],
    ['ノードE「賛成はゼロ。却下します」', 'Node E: "Zero in favor. Rejected."']
  ];
  function setMsg(ja, en){ msgPair = [ja, en]; msg.textContent = L(ja, en); }
  function stText(st){
    return st === 'sent' ? L('届いた', 'Received') : st === 'ng' ? L('× 拒否', '× Rejected') : L('待機中', 'Waiting');
  }
  function setSt(n, st){ n.dataset.st = st; n.querySelector('.st').textContent = stText(st); }
  function renderGo(){ go.textContent = played ? L('もう一度試す', 'Try again') : L('書き換えた版を配る', 'Send out the rewritten version'); }
  document.querySelectorAll('#capBtns button').forEach(function(b){
    b.addEventListener('click', function(){
      if (running) return;
      document.querySelectorAll('#capBtns button').forEach(function(x){ x.classList.remove('on'); });
      b.classList.add('on');
      capPair = [b.dataset.cap, b.dataset.capEn];
    });
  });
  function setTally(ok, ng, users){
    lastTally = [ok, ng, users];
    tally.innerHTML = L('賛成 <b>' + ok + '</b> ・ 拒否 <b>' + ng + '</b> ・ あなたの版の利用者 <b>' + users + '人</b>',
                        'For <b>' + ok + '</b> · Against <b>' + ng + '</b> · Users of your version <b>' + users + '</b>');
  }
  document.addEventListener('langchange', function(){
    nodes.forEach(function(n){ setSt(n, n.dataset.st || 'wait'); });
    setTally(lastTally[0], lastTally[1], lastTally[2]);
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
    setTally(0, 0, 0);
    setMsg('上限を' + capPair[0] + 'に書き換えた版を、世界に配り始めた…', 'Your rewritten version (cap: ' + capPair[1] + ') starts going out to the world…');
    var i = 0;
    function step(){
      if (i > 0) {
        var prev = nodes[i - 1];
        prev.classList.add('ng');
        setSt(prev, 'ng');
        setTally(0, i, 0);
        setMsg(LINES[i - 1][0], LINES[i - 1][1]);
      }
      if (i >= nodes.length) {
        card.classList.add('stamped');
        setMsg('全員が拒否。あなたの版は、あなた1人だけの通貨になった。書き換えるのは自由。でも、ついてくる人がいなければ意味がない。', 'Everyone refused. Your version is now a currency of one — you. Rewriting is free. But with nobody following, it means nothing.');
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
