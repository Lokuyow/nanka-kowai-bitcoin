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
    if (phase === 'init') msg.textContent = L('ノードは取引履歴を保存し、取引がルールに合うか確かめる。', 'Nodes store transaction history and check transactions against the rules.');
    else if (phase === 'edited') msg.textContent = L('あなたの写しだけ ' + mine.toFixed(1) + ' BTC に書き換えた。世界の写しは 1.0 BTC のまま。この台帳、通ると思う？', 'You rewrote only your copy to ' + mine.toFixed(1) + ' BTC. The world\'s copies still say 1.0 BTC. Think this ledger will be accepted?');
    else if (phase === 'checking') msg.textContent = L('ネットワークが照合中…', 'The network is checking…');
    else if (phase === 'rejected') {
      if (tries === 1) msg.textContent = L('増やした残高に対応する有効な取引がないので、ほかのノードは受け入れなかった。', 'The other nodes rejected the higher balance because there was no valid transaction to account for it.');
      else if (tries === 2) msg.textContent = L('また却下。各ノードが同じルールで確かめている。', 'Rejected again. Each node checks the same rules independently.');
      else msg.textContent = L('何度送っても結果は同じ。残高を増やすには、受け取りを示す有効な記録が必要。', 'Resending changes nothing. A higher balance needs a valid record of funds received.');
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
