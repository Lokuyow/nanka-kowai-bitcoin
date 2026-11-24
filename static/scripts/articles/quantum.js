(function(){
  var TOTAL = Math.pow(2, 256);
  var SEC_YEAR = 31557600;
  var attempts = 0, rate = 1e8, held = 0, timer = null;
  var countEl = document.getElementById('bfCount');
  var rateEl = document.getElementById('bfRate');
  var pctEl = document.getElementById('bfPct');
  var yearsEl = document.getElementById('bfYears');
  var totalLblEl = document.getElementById('bfTotalLbl');
  var msgEl = document.getElementById('bfMsg');
  var btn = document.getElementById('bfBtn');
  var msgPair = ['宇宙の年齢は約138億年。当たる気がしない理由が桁の大きさでわかる。', 'The universe is about 13.8 billion years old. The sheer scale of the digits shows why a hit feels impossible.'];
  function setMsg(ja, en){ msgPair = [ja, en]; msgEl.textContent = L(ja, en); }
  function fmtSci(x){
    if (x <= 0) return '0';
    var e = Math.floor(Math.log10(x));
    var m = x / Math.pow(10, e);
    // 日本語は本文と同じ「10の61乗」形式、英語は上付き文字
    return L(m.toFixed(1) + '×10の' + e + '乗', m.toFixed(1) + '×10<sup>' + e + '</sup>');
  }
  function fmtRate(r){
    if (window.LANG === 'en') {
      if (r < 1e12) { var oku = Math.round(r / 1e8); return oku < 10 ? (oku * 100) + ' million / sec' : (oku / 10) + ' billion / sec'; }
      return fmtSci(r) + ' / sec';
    }
    if (r < 1e12) return '毎秒 ' + Math.round(r / 1e8) + '億回';
    return '毎秒 ' + fmtSci(r) + ' 回';
  }
  function upd(){
    countEl.innerHTML = attempts < 1e15 ? Math.floor(attempts).toLocaleString('ja-JP') : fmtSci(attempts);
    var eff = rate;
    totalLblEl.textContent = L('全体（約2の256乗通り）に対して', 'Share of all possibilities (roughly 2^256)');
    rateEl.innerHTML = fmtRate(eff);
    var pct = attempts / TOTAL * 100;
    pctEl.innerHTML = pct <= 0 ? '0%' : fmtSci(pct) + ' %';
    var years = TOTAL / eff / SEC_YEAR;
    yearsEl.innerHTML = L('約 ' + fmtSci(years) + ' 年', 'About ' + fmtSci(years) + ' years');
    if (attempts > 1e18) setMsg('100京回を超えた。でも全体は10の77乗通り。残り時間はほぼ減っていない。', 'Over 100 quintillion tries. But the total is 10^77 possibilities — the remaining time has barely shrunk.');
    else if (attempts > 1e12) setMsg('1兆回を試した。それでも全体のほんの入口にも届いていない。', "A trillion tries — and you still haven't reached even the entrance of the whole space.");
    else if (attempts > 1e9) setMsg('10億回。速さは上がっていくのに、ゴールは遠いまま。', 'A billion tries. The speed keeps climbing, but the goal stays just as far away.');
  }
  function tick(){
    held += 0.05;
    if (held >= 1) { held = 0; if (rate < 1e18) rate *= 10; }
    var eff = rate;
    attempts += eff * 0.05;
    upd();
  }
  function start(e){
    if (e) e.preventDefault();
    if (timer) return;
    btn.classList.add('holding');
    attempts += rate * 0.2;
    timer = setInterval(tick, 50);
    upd();
  }
  function stop(){
    btn.classList.remove('holding');
    if (timer) { clearInterval(timer); timer = null; }
  }
  btn.addEventListener('pointerdown', start);
  window.addEventListener('pointerup', stop);
  btn.addEventListener('pointerleave', stop);
  btn.addEventListener('keydown', function(e){ if (e.key === ' ' || e.key === 'Enter') start(); });
  btn.addEventListener('keyup', stop);
  document.addEventListener('langchange', function(){ msgEl.textContent = L(msgPair[0], msgPair[1]); upd(); });
  upd();
})();

// いま／もし将来の切り替え
(function(){
  var now = document.getElementById('qNow');
  var future = document.getElementById('qFuture');
  var nowState = document.getElementById('qStateNow');
  var futureState = document.getElementById('qStateFuture');
  if (!now || !future) return;
  function show(isFuture){
    now.setAttribute('aria-pressed', String(!isFuture));
    future.setAttribute('aria-pressed', String(isFuture));
    nowState.classList.toggle('off', isFuture);
    futureState.classList.toggle('off', !isFuture);
    nowState.setAttribute('aria-hidden', String(isFuture));
    futureState.setAttribute('aria-hidden', String(!isFuture));
  }
  now.addEventListener('click', function(){ show(false); });
  future.addEventListener('click', function(){ show(true); });
})();
