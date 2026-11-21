(function(){
  var TOTAL = Math.pow(2, 256);
  var TOTAL_Q = Math.pow(2, 128);
  var SEC_YEAR = 31557600;
  var attempts = 0, rate = 1e8, held = 0, timer = null;
  var countEl = document.getElementById('bfCount');
  var rateEl = document.getElementById('bfRate');
  var pctEl = document.getElementById('bfPct');
  var yearsEl = document.getElementById('bfYears');
  var totalLblEl = document.getElementById('bfTotalLbl');
  var msgEl = document.getElementById('bfMsg');
  var btn = document.getElementById('bfBtn');
  var qbox = document.getElementById('bfQuantum');
  var msgPair = ['宇宙の年齢は約138億年。当たる気がしない理由が桁の大きさでわかる。', 'The universe is about 13.8 billion years old. The sheer scale of the digits shows why a hit feels impossible.'];
  function setMsg(ja, en){ msgPair = [ja, en]; msgEl.textContent = L(ja, en); }
  function fmtSci(x){
    if (x <= 0) return '0';
    var e = Math.floor(Math.log10(x));
    var m = x / Math.pow(10, e);
    return m.toFixed(1) + '×10<sup>' + e + '</sup>';
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
    var total = qbox.checked ? TOTAL_Q : TOTAL;
    totalLblEl.textContent = qbox.checked
      ? L('全体（2の128乗通り）に対して', 'Share of all possibilities (2^128)')
      : L('全体（2の256乗通り）に対して', 'Share of all possibilities (2^256)');
    rateEl.innerHTML = fmtRate(eff);
    var pct = attempts / total * 100;
    pctEl.innerHTML = pct <= 0 ? '0%' : fmtSci(pct) + ' %';
    var years = total / eff / SEC_YEAR;
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
  qbox.addEventListener('change', function(){
    if (qbox.checked) setMsg('量子コンピューターでは総当たりは2の128乗回で済む。それでも全部試すには、宇宙の年齢では全然足りない。しかも鍵が隠れたアドレスはそもそも狙えない。', "With a quantum computer, brute force takes \"only\" 2^128 tries. Even so, the age of the universe isn't nearly enough to try them all. And addresses whose keys stay hidden can't be targeted in the first place.");
    else setMsg('ふつうのコンピューターに戻した。桁の壁は変わらない。', 'Back to a normal computer. The wall of digits is unchanged.');
    upd();
  });
  upd();
})();
