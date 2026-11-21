(function(){
  var PATHS = {
    fish: '<path d="M2.5 12C5.5 7.5 9 5 13 5c3.5 0 6.5 2.5 8.5 7-2 4.5-5 7-8.5 7-4 0-7.5-2.5-10.5-7Z"/><path d="M2.5 12 1 8.5M2.5 12 1 15.5"/><circle cx="16.8" cy="10.3" r="1.1" fill="currentColor" stroke="none"/>',
    bread: '<path d="M5.2 10.2A5.2 4.6 0 0 1 10.4 5.6h3.2a5.2 4.6 0 0 1 5.2 4.6c.7.6 1.2 1.4 1.2 2.4V15a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 15v-2.4c0-1 .5-1.8 1.2-2.4Z"/><path d="M8.8 9.3l1.6 2.2M13 9.3l1.6 2.2"/>',
    egg: '<path d="M12 3.5c2.9 0 5.6 5.1 5.6 9.4a5.6 5.6 0 1 1-11.2 0C6.4 8.6 9.1 3.5 12 3.5Z"/>',
    cloth: '<rect x="4" y="6" width="16" height="12" rx="1"/><path d="M4 10.2c2.7-1.7 5.3 1.7 8 0s5.3 1.7 8 0M4 14.2c2.7-1.7 5.3 1.7 8 0s5.3 1.7 8 0"/>',
    wood: '<circle cx="8" cy="16.5" r="3.4"/><circle cx="16" cy="16.5" r="3.4"/><circle cx="12" cy="9.5" r="3.4"/><circle cx="8" cy="16.5" r="1.1"/><circle cx="16" cy="16.5" r="1.1"/><circle cx="12" cy="9.5" r="1.1"/>',
    shell: '<path d="M4 19c0-6.8 3.8-12.8 8.5-12.8S21 12.2 21 19"/><path d="M3.5 19h18"/><path d="M12 6.8V19M7.9 8.4 9.5 19M16.1 8.4 14.5 19"/>'
  };
  var NAMES = {fish:'魚', egg:'卵', bread:'パン', cloth:'布', wood:'まき', shell:'貝がら'};
  var NAMES_EN = {fish:'Fish', egg:'Eggs', bread:'Bread', cloth:'Cloth', wood:'Firewood', shell:'Shells'};
  function nameOf(k){ return L(NAMES[k], NAMES_EN[k]); }
  function whoOf(p){ return L(p.who, p.whoEn); }
  var PEOPLE = [
    {who:'パンを焼く人', has:'bread', want:'egg',
     reject:'「魚はいらないなあ。卵を持ってきてくれたら交換するよ」',
     accept:'「その卵がほしかったんだ。さあ、パンをどうぞ」'},
    {who:'布を織る人', has:'cloth', want:'bread',
     reject:'「それでは困るなあ。パンなら交換するのに」'},
    {who:'木こり', has:'wood', want:'cloth',
     reject:'「それはいらない。布がほしいんだ」'},
    {who:'漁師', has:'fish', want:'wood',
     reject:'「お互い魚どうしだね。まきがあれば交換するよ」',
     reject2:'「卵はいらない。まきがあれば交換するよ」'},
    {who:'卵を売る人', has:'egg', want:'fish',
     accept:'「魚がほしかったんだ。交換しよう」',
     reject2:'「卵はもう足りてる。魚があれば交換するよ」'}
  ];
  var PEOPLE_EN = [
    {who:'The baker',
     reject:"\"I don't need fish. Bring me eggs and I'll trade.\"",
     accept:"\"Those eggs are just what I wanted. Here — take the bread.\""},
    {who:'The weaver',
     reject:"\"That won't do. If it were bread, I'd trade.\""},
    {who:'The woodcutter',
     reject:"\"Don't need that. I want cloth.\""},
    {who:'The fisher',
     reject:"\"Fish for fish, eh? If you had firewood, I'd trade.\"",
     reject2:"\"I don't need eggs. If you had firewood, I'd trade.\""},
    {who:'The egg seller',
     accept:"\"Fish is what I wanted. Let's trade.\"",
     reject2:"\"I have enough eggs. If you had fish, I'd trade.\""}
  ];
  PEOPLE.forEach(function(p, i){
    var e = PEOPLE_EN[i];
    p.whoEn = e.who; p.rejectEn = e.reject; p.acceptEn = e.accept; p.reject2En = e.reject2;
  });

  function icon(name){
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + PATHS[name] + '</svg>';
  }
  function shuffle(a){
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  var holdIcon = document.getElementById('holdIcon');
  var holdName = document.getElementById('holdName');
  var pWho = document.getElementById('pWho');
  var pHas = document.getElementById('pHas');
  var pWant = document.getElementById('pWant');
  var pHasIcon = document.getElementById('pHasIcon');
  var pWantIcon = document.getElementById('pWantIcon');
  var pMsg = document.getElementById('pMsg');
  var pTally = document.getElementById('pTally');
  var personCard = document.getElementById('personCard');
  var btnAsk = document.getElementById('btnAsk');
  var btnNext = document.getElementById('btnNext');
  var btnMoney = document.getElementById('btnMoney');
  var btnRetry = document.getElementById('btnRetry');
  document.getElementById('goalIcon').innerHTML = icon('bread');
  var holding, rejects, trades, deck, pos, busy, finished;
  function person(){ return PEOPLE[deck[pos]]; }
  var msgPair = ['', ''];
  function setMsg(ja, en){ msgPair = [ja, en]; pMsg.textContent = L(ja, en); }
  function setTally(){
    pTally.innerHTML = L('断られた回数 <b>' + rejects + '</b> ・ 交換した回数 <b>' + trades + '</b>', 'Turned down <b>' + rejects + '</b> times · Trades made <b>' + trades + '</b>');
  }
  function setHold(){
    holdIcon.innerHTML = icon(holding);
    holdName.textContent = nameOf(holding);
  }
  function showPerson(){
    var p = person();
    pWho.textContent = whoOf(p);
    pHas.textContent = nameOf(p.has);
    pWant.textContent = nameOf(p.want);
    pHasIcon.innerHTML = icon(p.has);
    pWantIcon.innerHTML = icon(p.want);
  }
  function buttons(mode){
    btnAsk.hidden = mode !== 'ask';
    btnNext.hidden = mode !== 'next';
    btnRetry.hidden = mode !== 'retry';
    btnMoney.hidden = !(rejects >= 1 && !finished && mode !== 'retry');
  }
  function start(){
    holding = 'fish'; rejects = 0; trades = 0;
    deck = shuffle([0, 1, 2, 3, 4]); pos = 0;
    busy = false; finished = false;
    personCard.style.display = '';
    setHold(); showPerson(); setTally();
    setMsg('村の広場に来た。誰かに交換を持ちかけてみよう。', 'You arrived at the village square. Offer a trade to someone.');
    buttons('ask');
    btnMoney.hidden = true;
  }
  function finish(kind, acceptPair){
    finished = true;
    personCard.style.display = 'none';
    if (kind === 'barter') {
      setMsg(acceptPair[0] + ' 物々交換でもパンにたどり着けた。でもそれは相手の欲しい物を持っている人に会える運と、何度も交換する手間があってのことだった。',
             acceptPair[1] + ' You reached bread by barter. But that took the luck of meeting people who wanted what you had, and the trouble of trading again and again.');
    } else {
      setMsg('お金を使うと、交換は一気に簡単になった。相手の「欲しい」と自分の「欲しい」が重ならなくてもよくなったからだ。',
             'With money, trading became simple at once — your "want" and theirs no longer had to match.');
    }
    buttons('retry');
    setTally();
  }
  btnAsk.addEventListener('click', function(){
    if (busy || finished) return;
    var p = person();
    if (p.want === holding) {
      trades++;
      var got = p.has;
      if (got === 'bread') {
        holding = 'bread'; setHold(); setTally();
        finish('barter', [p.who + '：' + p.accept, whoOf(p) + ': ' + p.acceptEn]);
      } else {
        holding = got; setHold(); setTally();
        setMsg(p.who + '：' + p.accept + ' 卵を手に入れた。パンを焼く人は卵を欲しがっていたはずだ。', whoOf(p) + ': ' + p.acceptEn + ' You got eggs. The baker wanted eggs, if I recall.');
        buttons('next');
      }
    } else {
      rejects++;
      var line = (holding !== 'fish' && p.reject2) ? p.reject2 : p.reject;
      var lineEn = (holding !== 'fish' && p.reject2En) ? p.reject2En : p.rejectEn;
      setMsg(p.who + '：' + line, whoOf(p) + ': ' + lineEn);
      setTally();
      buttons('next');
    }
  });
  btnNext.addEventListener('click', function(){
    if (busy || finished) return;
    pos++;
    if (pos >= deck.length) {
      deck = shuffle(deck); pos = 0;
      showPerson();
      setMsg('村を一周してしまった。並びを変えてもう一度ためしてみよう。', 'You circled the whole village. The order is shuffled — try again.');
    } else {
      showPerson();
      setMsg('', '');
    }
    buttons('ask');
  });
  btnMoney.addEventListener('click', function(){
    if (busy || finished) return;
    busy = true;
    buttons('none');
    btnMoney.hidden = true;
    setMsg('魚を貝がらと交換した。', 'You traded your fish for shells.');
    holding = 'shell'; setHold();
    setTimeout(function(){
      setMsg('貝がらでパンを買った。', 'You bought bread with the shells.');
      holding = 'bread'; setHold();
      setTimeout(function(){ finish('money'); }, 800);
    }, 850);
  });
  document.addEventListener('langchange', function(){
    setHold(); setTally();
    if (!finished) showPerson();
    pMsg.textContent = L(msgPair[0], msgPair[1]);
  });
  btnRetry.addEventListener('click', start);
  start();
})();
