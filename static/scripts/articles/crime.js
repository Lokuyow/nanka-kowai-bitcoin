(function(){
  var rows = document.querySelectorAll('#traceCard .lrow');
  var btn = document.getElementById('traceBtn');
  var msg = document.getElementById('traceMsg');
  var idx = 1;
  var msgIdx = 0;
  var MSGS = [
    ['誰かが送った 0.5 BTC。送り先を1件ずつたどってみよう。', 'Someone sent 0.5 BTC. Trace where it went, one hop at a time.'],
    ['受け取った0.5 BTCのうち、0.2 BTCを別のアドレスへ送った。', 'Of the 0.5 BTC received, 0.2 BTC went to the next address.'],
    ['0.2 BTCがさらに次のアドレスへ移った。', 'The 0.2 BTC moved on to another address.'],
    ['次にどのアドレスへ送ったか、公開台帳で確かめられる。', 'The public ledger shows which address received the next transfer.'],
    ['行き着いた先は取引所のアドレス。取引所に本人確認の記録があれば、持ち主を調べる手がかりになる。', 'The trail ends at an exchange address. If the exchange has identity records, they can help identify the account holder.']
  ];
  function renderTrace(){
    msg.textContent = L(MSGS[msgIdx][0], MSGS[msgIdx][1]);
    btn.textContent = idx >= rows.length ? L('最初からたどり直す', 'Trace again from the start') : L('次の送金をたどる', 'Trace the next transfer');
  }
  document.addEventListener('langchange', renderTrace);
  btn.addEventListener('click', function(){
    if (idx >= rows.length) {
      rows.forEach(function(r, i){ r.classList.toggle('show', i === 0); });
      idx = 1;
      msgIdx = 0;
      renderTrace();
      return;
    }
    rows[idx].classList.add('show');
    msgIdx = idx;
    idx++;
    renderTrace();
  });
  renderTrace();
})();
