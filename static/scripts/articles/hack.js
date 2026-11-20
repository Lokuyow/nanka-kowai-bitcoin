(function(){
  var mine = 1.0, tries = 0, sending = false;
  var valEl = document.getElementById('hkMineVal');
  var copyEl = document.getElementById('hkCopyMine');
  var others = document.querySelectorAll('.hk-other');
  var editBtn = document.getElementById('hkEdit');
  var sendBtn = document.getElementById('hkSend');
  var msg = document.getElementById('hkMsg');
  var triesEl = document.getElementById('hkTries');
  var card = document.getElementById('hackCard');
  var phase = 'init';
  function renderMsg(){
    if (phase === 'init') msg.textContent = L('台帳は世界中の参加者が同じ写しを持っている。1つだけ書き換えても…？', 'Every participant around the world holds the same copy of the ledger. Rewrite just one of them, and…?');
    else if (phase === 'edited') msg.textContent = L('あなたの写しだけ ' + mine.toFixed(1) + ' BTC に書き換えた。世界の写しは 1.0 BTC のまま。この台帳、通ると思う？', 'You rewrote only your copy to ' + mine.toFixed(1) + ' BTC. The world\'s copies still say 1.0 BTC. Think this ledger will be accepted?');
    else if (phase === 'checking') msg.textContent = L('ネットワークが照合中…', 'The network is checking…');
    else if (phase === 'rejected') {
      if (tries === 1) msg.textContent = L('世界の写しと食い違ったため却下。あなたの書き換えは消えて、数字は元に戻った。', 'Rejected — it disagreed with the world\'s copies. Your edit vanished and the numbers went back.');
      else if (tries === 2) msg.textContent = L('また却下。正しいとされるのは、多数派の写しの方。', 'Rejected again. The copies that count as correct are the majority\'s.');
      else msg.textContent = L('何度送っても同じ。通すには世界中の写しを全部、同時に書き換えるしかない。それは無理な話。', 'Same result every time. To get it through you\'d have to rewrite every copy in the world, all at once. Not happening.');
    }
  }
  document.addEventListener('langchange', renderMsg);
  renderMsg();
  editBtn.addEventListener('click', function(){
    if (sending) return;
    mine += 10;
    valEl.textContent = mine.toFixed(1) + ' BTC';
    valEl.classList.add('bad');
    copyEl.classList.add('edited');
    card.classList.remove('stamped');
    sendBtn.disabled = false;
    phase = 'edited';
    renderMsg();
  });
  sendBtn.addEventListener('click', function(){
    if (sending || mine === 1.0) return;
    sending = true;
    sendBtn.disabled = true;
    editBtn.disabled = true;
    phase = 'checking';
    renderMsg();
    others.forEach(function(o){ o.classList.add('checking'); });
    setTimeout(function(){
      tries++;
      triesEl.textContent = tries;
      card.classList.add('stamped');
      others.forEach(function(o){ o.classList.remove('checking'); });
      phase = 'rejected';
      renderMsg();
      mine = 1.0;
      valEl.textContent = '1.0 BTC';
      valEl.classList.remove('bad');
      copyEl.classList.remove('edited');
      editBtn.disabled = false;
      sending = false;
    }, 900);
  });
})();
