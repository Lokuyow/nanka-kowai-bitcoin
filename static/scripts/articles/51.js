(function(){
  var range = document.getElementById('hpRange');
  var pctEl = document.getElementById('hpPct');
  var youEl = document.getElementById('hpYou');
  var state = document.getElementById('hpState');
  var actions = document.getElementById('hpActions');
  var feed = document.getElementById('hpFeed');
  var costEl = document.getElementById('hpCost');
  var cost = 0, costTimer = null;
  var tried = {};
  function fmtCost(){
    if (window.LANG === 'en') {
      // cost は億円単位。¥150/$ でドル換算する（1兆円 ≒ $6.7 billion）
      if (cost >= 10000) return '$' + (cost / 1500).toFixed(2) + ' billion';
      return '$' + Math.round(cost / 1.5) + ' million';
    }
    if (cost >= 10000) return (cost / 10000).toFixed(2) + '兆円';
    return Math.round(cost).toLocaleString('ja-JP') + '億円';
  }
  function upd(){
    var v = +range.value;
    pctEl.textContent = v + '%';
    youEl.style.width = v + '%';
    if (v < 30) {
      state.textContent = L('まだ過半数には遠い。この割合では記録を書き換える力はない。', 'Still far from a majority. At this share, you have no power to rewrite records.');
      actions.hidden = true;
    } else if (v < 51) {
      state.textContent = L('かなり集めた。でも過半数に届かなければ、ルールを曲げる力はない。あと少し。', "You've gathered a lot. But short of a majority, you have no power to bend the rules. Almost there.");
      actions.hidden = true;
    } else {
      state.textContent = L('過半数を超えた！ 世界の半分より強い。でも、できることには限界がある。下のボタンで試してみよう。', 'Past 50%! Stronger than half the world. But what you can do has limits — try the buttons below.');
      actions.hidden = false;
    }
    if (v >= 51 && !costTimer) {
      costTimer = setInterval(function(){
        cost += 800 + Math.random() * 1200;
        costEl.textContent = fmtCost();
      }, 1000);
    } else if (v < 51 && costTimer) {
      clearInterval(costTimer); costTimer = null;
    }
  }
  range.addEventListener('input', upd);
  upd();
  var feedPair = ['', ''];
  function renderFeed(){
    var done = tried.actDouble && tried.actSteal && tried.actMint;
    feed.innerHTML = L(feedPair[0], feedPair[1]) + (done ? '<br><b>' + L('結論: できるのは自分の送金の取り消しだけ。それも割に合わないから、誰もやらない。', "Conclusion: all you can do is reverse your own payments — and even that isn't worth it, so nobody does it.") + '</b>' : '');
  }
  function finish(id, b, ja, en, ok){
    tried[id] = true;
    b.classList.add('done');
    b.disabled = true;
    if (!ok) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); }
    feedPair = [ja, en];
    renderFeed();
  }
  document.addEventListener('langchange', function(){ upd(); renderFeed(); costEl.textContent = fmtCost(); });
  document.getElementById('actDouble').addEventListener('click', function(){
    finish('actDouble', this, 'できた。ただし取り消せるのは自分の最近の送金だけ。相手が承認を待てば防げるし、この一瞬のためにコストは燃え続ける。', 'It worked. But you can only reverse your own recent payments. The other side can defend by waiting for confirmations — and the cost keeps burning the whole time.', true);
  });
  document.getElementById('actSteal').addEventListener('click', function(){
    finish('actSteal', this, 'できない。他人のコインを動かすには、その人の鍵（署名）が要る。計算力では代わりにならない。', "You can't. Moving someone else's coins takes their key (signature). Hash power is no substitute.", false);
  });
  document.getElementById('actMint').addEventListener('click', function(){
    finish('actMint', this, 'できない。ルールを外れたコインは、世界中のノードが受け取りを拒否する。作っても、ただの数字。', "You can't. Coins that break the rules are refused by nodes all over the world. Mint them, and they're just numbers.", false);
  });
})();
