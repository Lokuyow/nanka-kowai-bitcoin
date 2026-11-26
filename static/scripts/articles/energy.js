(function(){
  var range = document.getElementById('mineRange');
  var pctEl = document.getElementById('minePct');
  var msg = document.getElementById('mineMsg');
  var card = document.getElementById('mineCard');
  var tries = 0, wins = 0, kwh = 0;
  var tryEl = document.getElementById('mineTry');
  var winEl = document.getElementById('mineWin');
  var kwhEl = document.getElementById('mineKwh');
  var LOSE = [
    ['外れ。世界のだれかが先に当てた。電気だけが消えた。', 'Miss. Someone in the world solved it first. All that electricity, spent for nothing.'],
    ['また外れ。当たりは世界中の参加者の取り合い。', 'Missed again. The win is a scramble among participants worldwide.'],
    ['外れ。条件を満たす答えを、ほかの参加者が先に見つけた。', 'Miss. Another participant found a valid answer first.']
  ];
  var minePair = ['計算力が大きいほど当たりやすい。でも、外れても電気は使っている。', 'The more hash power you have, the more likely you are to win. But even when you lose, the electricity is spent.'];
  var loseIdx = -1;
  function renderMine(){
    var text = L(minePair[0], minePair[1]);
    if (loseIdx >= 0) text += L('（あなたの実績: ' + tries + '回中 ' + wins + '回）', ' (Your record: ' + wins + ' wins in ' + tries + ' tries)');
    msg.textContent = text;
  }
  document.addEventListener('langchange', function(){
    renderMine();
    kwhEl.textContent = kwh.toLocaleString(window.LANG === 'en' ? 'en-US' : 'ja-JP');
  });
  renderMine();
  range.addEventListener('input', function(){ pctEl.textContent = range.value + '%'; });
  document.getElementById('mineBtn').addEventListener('click', function(){
    var share = +range.value / 100;
    tries++;
    kwh += Math.round(share * 900 + 30 + Math.random() * 60);
    tryEl.textContent = tries;
    kwhEl.textContent = kwh.toLocaleString(window.LANG === 'en' ? 'en-US' : 'ja-JP');
    if (Math.random() < share) {
      wins++;
      winEl.textContent = wins;
      card.classList.remove('flashwin'); void card.offsetWidth; card.classList.add('flashwin');
      minePair = ['当たった！ 記録を書く権利と報酬をゲット。電気はこの瞬間のために使われていた。', 'You won! You earned the right to write the record, plus the reward. The electricity was being spent for this moment.'];
      loseIdx = -1;
      renderMine();
    } else {
      loseIdx = Math.floor(Math.random() * LOSE.length);
      minePair = LOSE[loseIdx];
      renderMine();
    }
  });
})();
