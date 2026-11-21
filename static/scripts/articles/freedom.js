(function(){
  var EVENTS = [
    {t: '別の相手に送金しそうになった',
     bank: {o: '処理が始まる前に窓口に相談でき、この送金は止められた。', good: true},
     btc: {o: '送金が記録されたあとに気づいた。相手から返してもらう必要があった。', good: false}},
    {t: '土曜の夜、海外の家族に送金したい',
     bank: {o: '銀行が休みで、月曜まで待つことになった。', good: false},
     btc: {o: 'その場で送信できた。家族は取引が台帳に載るのを待った。', good: true}},
    {t: '口座が突然凍結された',
     bank: {o: '理由を聞いて解けるのを待つしかなかった。', good: false},
     btc: {o: '凍結する管理者がいないので、そのまま使えた。', good: true}},
    {t: '鍵のメモをなくした',
     bank: {o: '窓口で本人確認をして再発行してもらえた。', good: true},
     btc: {o: '誰にも再発行してもらえない。中身に触れなくなった。', good: false}},
    {t: 'あやしいサイトに送金してしまった',
     bank: {o: '不審な送金として止められ、助かった。', good: true},
     btc: {o: '台帳に載った送金を取り消してくれる窓口はない。このときは返金されなかった。', good: false}},
    {t: '引っ越し先の国でお金を使いたい',
     bank: {o: 'その国の口座を作り直す手続きが要った。', good: false},
     btc: {o: '国が変わっても、同じものをそのまま使えた。', good: true}}
  ];
  var EVENTS_EN = [
    {t: 'You nearly sent money to the wrong recipient',
     bank: 'You reached the bank before processing began, and it stopped this transfer.',
     btc: 'You noticed after it was recorded. You needed the recipient to send it back.'},
    {t: 'Saturday night — you want to send money to family overseas',
     bank: 'The bank was closed, so you had to wait until Monday.',
     btc: 'You submitted it on the spot. Your family waited for the transaction to be recorded.'},
    {t: 'Your account was suddenly frozen',
     bank: 'You had no choice but to ask why and wait for it to be lifted.',
     btc: 'There is no manager to freeze it, so you could keep using it as-is.'},
    {t: 'You lost the note with your key',
     bank: 'At the counter you verified your identity and got it reissued.',
     btc: 'No one can reissue it for you. You could no longer touch what was inside.'},
    {t: 'You sent money to a suspicious site',
     bank: 'It was stopped as a suspicious transfer — you were saved.',
     btc: 'There was no service that could reverse the recorded transaction. In this case, you did not get a refund.'},
    {t: 'You want to use money in the country you moved to',
     bank: 'You had to go through the procedure of opening an account in that country.',
     btc: 'Even in a different country, you could use the same thing as-is.'}
  ];
  EVENTS.forEach(function(ev, i){
    ev.tEn = EVENTS_EN[i].t;
    ev.bank.oEn = EVENTS_EN[i].bank;
    ev.btc.oEn = EVENTS_EN[i].btc;
  });

  var DAYS = 4;
  var sys = null, deck = [], step = 0, good = 0, bad = 0;
  var evList = document.getElementById('evList');
  var sysLine = document.getElementById('sysLine');
  var gTally = document.getElementById('gTally');
  var tGood = document.getElementById('tGood');
  var tBad = document.getElementById('tBad');
  var gMsg = document.getElementById('gMsg');
  var btnDay = document.getElementById('btnDay');
  var btnOther = document.getElementById('btnOther');
  var btnAgain = document.getElementById('btnAgain');
  var sysBtns = document.querySelectorAll('#sysPick button');
  function shuffle(a){
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function setTally(){ tGood.textContent = good; tBad.textContent = bad; }
  var msgPair = ['', ''];
  function renderSysLine(){
    if (!sys) { sysLine.textContent = L('まず、どちらのお金で暮らすか選んでみよう。', 'First, choose which money to live with.'); return; }
    sysLine.innerHTML = (sys === 'bank' ? '<b>' + L('銀行口座', 'A bank account') + '</b>' : '<b>' + L('自分で鍵を持つウォレット', 'A wallet whose keys you hold') + '</b>') + L('を使った場合の例。', ' — see how it might work in practice.');
  }
  function buildCard(ev, idx, animate){
    var r = ev[sys];
    var div = document.createElement('div');
    div.className = 'evcard' + (animate ? ' rise' : '') + ' ' + (r.good ? 'good' : 'bad');
    div.innerHTML = '<p class="et">' + L((idx + 1) + '日目：', 'Day ' + (idx + 1) + ': ') + L(ev.t, ev.tEn) +
      '<span class="tag ' + (r.good ? 'good' : 'bad') + '">' + (r.good ? L('助かった', 'Saved') : L('困った', 'In trouble')) + '</span></p>' +
      '<p class="eo">' + L(r.o, r.oEn) + '</p>';
    return div;
  }
  function renderList(){
    evList.innerHTML = '';
    for (var i = 0; i < step; i++) evList.appendChild(buildCard(deck[i], i, false));
  }

  function start(s, reuseDeck){
    sys = s;
    if (!reuseDeck) deck = shuffle(EVENTS).slice(0, DAYS);
    step = 0; good = 0; bad = 0;
    evList.innerHTML = '';
    gMsg.textContent = ''; msgPair = ['', ''];
    gTally.hidden = false;
    setTally();
    sysBtns.forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-sys') === s); });
    renderSysLine();
    btnDay.hidden = false;
    btnOther.hidden = true;
    btnAgain.hidden = true;
    nextDay();
  }
  function nextDay(){
    if (step >= DAYS) { finish(); return; }
    var ev = deck[step];
    var r = ev[sys];
    step++;
    if (r.good) good++; else bad++;
    evList.appendChild(buildCard(ev, step - 1, true));
    setTally();
    if (step >= DAYS) finish();
  }
  function finish(){
    btnDay.hidden = true;
    btnOther.hidden = false;
    btnAgain.hidden = false;
    msgPair = ['もう一方でも同じ出来事を試して、対応の違いを見てみよう。', 'Try the same situations with the other option to compare the responses.'];
    gMsg.textContent = L(msgPair[0], msgPair[1]);
  }
  sysBtns.forEach(function(b){
    b.addEventListener('click', function(){ start(b.getAttribute('data-sys')); });
  });
  btnDay.addEventListener('click', nextDay);
  btnOther.addEventListener('click', function(){ start(sys === 'bank' ? 'btc' : 'bank', true); });
  btnAgain.addEventListener('click', function(){ start(sys); });
  document.addEventListener('langchange', function(){
    renderSysLine();
    if (sys) renderList();
    gMsg.textContent = L(msgPair[0], msgPair[1]);
  });
  renderSysLine();
})();
