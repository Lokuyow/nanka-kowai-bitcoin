(function(){
  var range = document.getElementById('hpRange');
  var pctEl = document.getElementById('hpPct');
  var youEl = document.getElementById('hpYou');
  var state = document.getElementById('hpState');
  var actions = document.getElementById('hpActions');
  var feed = document.getElementById('hpFeed');
  var tried = {};
  function upd(){
    var v = +range.value;
    pctEl.textContent = v + '%';
    youEl.style.width = v + '%';
    if (v < 30) {
      state.textContent = L('ほかのマイナーのほうが計算力は大きい。', 'The other miners have more computing power.');
      actions.hidden = true;
    } else if (v < 51) {
      state.textContent = L('計算力は増えたが、ほかのマイナーの合計は上回っていない。', "Your computing power has grown, but it does not exceed the other miners' combined power.");
      actions.hidden = true;
    } else {
      state.textContent = L('過半数を超えた！ 世界の半分より強い。でも、できることには限界がある。下のボタンで試してみよう。', 'Past 50%! Stronger than half the world. But what you can do has limits — try the buttons below.');
      actions.hidden = false;
    }
  }
  range.addEventListener('input', upd);
  upd();
  var feedPair = ['', ''];
  function renderFeed(){
    var done = tried.actDouble && tried.actSteal && tried.actMint;
    feed.innerHTML = L(feedPair[0], feedPair[1]) + (done ? '<br><b>' + L('計算力は、どの有効な取引が記録に残るかに影響する。取引を有効にするルールはノードが確かめる。', "Mining power can influence which valid transactions remain recorded. Nodes still check which transactions are valid.") + '</b>' : '');
  }
  function finish(id, b, ja, en, ok){
    tried[id] = true;
    b.classList.add('done');
    b.disabled = true;
    if (!ok) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); }
    feedPair = [ja, en];
    renderFeed();
  }
  document.addEventListener('langchange', function(){ upd(); renderFeed(); });
  document.getElementById('actDouble').addEventListener('click', function(){
    finish('actDouble', this, 'この例では、元の支払いを含まない記録が採用され、支払いが取り消された。', 'In this example, the network accepted a history that left out the original payment, reversing it.', true);
  });
  document.getElementById('actSteal').addEventListener('click', function(){
    finish('actSteal', this, 'できない。他人のコインを動かすには、その人の鍵（署名）が要る。計算力では代わりにならない。', "You can't. Moving someone else's coins takes their key (signature). Hash power is no substitute.", false);
  });
  document.getElementById('actMint').addEventListener('click', function(){
    finish('actMint', this, 'できない。ルールを外れたコインは、世界中のノードが受け取りを拒否する。作っても、ただの数字。', "You can't. Coins that break the rules are refused by nodes all over the world. Mint them, and they're just numbers.", false);
  });
})();
