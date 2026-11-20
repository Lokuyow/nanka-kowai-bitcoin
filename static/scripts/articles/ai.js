(function(){
  var range = document.getElementById('powRange');
  var pctEl = document.getElementById('powPct');
  var cap = document.getElementById('powCap');
  var bars = {
    mine: [document.getElementById('powMine'), document.getElementById('powMineV')],
    move: [document.getElementById('powMove'), document.getElementById('powMoveV')],
    all: [document.getElementById('powAll'), document.getElementById('powAllV')]
  };
  function setBar(k, v){
    v = Math.max(0, Math.min(100, Math.round(v)));
    bars[k][0].style.width = v + '%';
    bars[k][1].textContent = v;
  }
  function upd(){
    var x = +range.value;
    pctEl.textContent = x + '%';
    var region = Math.max(4, 80 * (1 - x / 100 * 1.15));
    var left = 80 - region;
    var moved = left * 0.9;
    var world = 100 - left * 0.1 + (Math.random() * 2 - 1);
    setBar('mine', region / 80 * 80);
    setBar('move', moved);
    setBar('all', world);
    if (x < 35) cap.textContent = L('この地域では、AIとマイニングがまだ両立している。', 'In this region, AI and mining still coexist.');
    else if (x < 65) cap.textContent = L('電気の取り合いで値段が上がり、マイナーは安い地域へ引っ越し始めた。', 'Competition for electricity pushed prices up, and miners started moving to cheaper regions.');
    else cap.textContent = L('その地域のマイニングは、ほぼ撤退。でも世界全体はほとんど減っていない。行き先は、水力などの安い電気がある場所。', 'Mining has mostly left this region. But the world total has barely dropped. The destination: places with cheap power, like hydro.');
  }
  range.addEventListener('input', upd);
  document.addEventListener('langchange', upd);
  upd();
})();
