var wedge = document.getElementById('wedge');
  var lines = document.getElementById('sliceLines');
  var ptext = document.getElementById('pizzaText');
  var cx = 110, cy = 110, r = 96;
  function pt(deg){ var a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function wedgePath(sweep){
    if (sweep >= 360) return 'M110 14 A96 96 0 1 1 109.9 14 Z';
    var e = pt(sweep), large = sweep > 180 ? 1 : 0;
    return 'M110 110 L110 14 A96 96 0 ' + large + ' 1 ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1) + ' Z';
  }
  var L = window.L || function (ja) { return ja; };
  var steps = [
    {sweep: 360, ja: '1ホール全部（1 BTC）', en: 'The whole pizza (1 BTC)', ln: 0},
    {sweep: 180, ja: '半分（0.5 BTC）', en: 'Half (0.5 BTC)', ln: 2},
    {sweep: 90,  ja: '1/4 ホール（0.25 BTC）', en: '1/4 of the pizza (0.25 BTC)', ln: 4},
    {sweep: 6,   ja: '100万分の1（0.000001 BTC）', en: 'One millionth (0.000001 BTC)', ln: 12},
    {sweep: 1.2, ja: '1 satoshi（0.00000001 BTC）：これでも買える', en: '1 satoshi (0.00000001 BTC) — you can buy even this', ln: 12}
  ];
  var curStep = 2;
  function draw(step){
    var s = steps[step];
    wedge.setAttribute('d', wedgePath(s.sweep));
    var html = '';
    for (var i = 0; i < s.ln; i++){
      var p = pt(360 * i / s.ln);
      html += '<line x1="110" y1="110" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '"/>';
    }
    lines.innerHTML = html;
    curStep = step;
    ptext.innerHTML = L('あなたの分: ', 'Your share: ') + '<b>' + L(s.ja, s.en) + '</b>';
    document.querySelectorAll('#cutBtns button').forEach(function(b, i){
      b.classList.toggle('on', i === step);
    });
  }
  document.querySelectorAll('#cutBtns button').forEach(function(b){
    b.addEventListener('click', function(){ draw(+b.dataset.step); });
  });
  document.addEventListener('langchange', function(){ draw(curStep); });
  draw(2);

;
(function(){
  var range = document.getElementById('yenRange');
  var lbl = document.getElementById('yenLbl');
  var numEl = document.getElementById('satNum');
  var btcEl = document.getElementById('satBtc');
  var bar = document.getElementById('satBar');
  var msg = document.getElementById('satMsg');
  var hintEl = document.getElementById('satHint');
  if (window.LANG === 'en') range.value = 37;   /* 英語モードの初期位置は $100 になる位置 */
  var shown = window.LANG === 'en' ? 100000 : 6667, raf = null;
  var btcJpy = 15000000, btcUsd = 100000;   /* 換算に使う1BTCの価格（円／ドル）。実データが取れたら差し替える */
  var livePrice = null;    /* { jpy, usd, source } 実価格（取れた場合のみ） */
  function renderHint(){
    if (!hintEl) return;
    if (livePrice && (window.LANG === 'en' ? livePrice.usd : livePrice.jpy)) {
      var man = Math.round(livePrice.jpy / 10000).toLocaleString('ja-JP');
      hintEl.textContent = L(
        '1BTC = 約' + man + '万円（いまの実価格・' + livePrice.source + '）として計算。量は少なくても、れっきとしたビットコイン。値動きの割合は丸ごと買った場合と同じ。',
        'Calculated at 1 BTC = $' + Math.round(livePrice.usd).toLocaleString('en-US') + ' (the current price, live from ' + livePrice.source + '). A small amount is still real bitcoin, and its percentage moves match buying a whole coin.');
    } else {
      hintEl.textContent = L(
        '1BTC = 1,500万円として計算（イメージ）。量は少なくても、れっきとしたビットコイン。値動きの割合は丸ごと買った場合と同じ。',
        'Calculated at 1 BTC = $100,000 (illustrative). A small amount is still real bitcoin, and its percentage moves match buying a whole coin.');
    }
  }
  function yen(){ return Math.round(100 * Math.pow(10000, +range.value / 100) / 10) * 10; }
  function usd(){ return Math.round(10 * Math.pow(500, +range.value / 100)); }   /* 英語モードの金額: $10〜$5,000 */
  function amount(){ return window.LANG === 'en' ? usd() : yen(); }
  function price(){ return window.LANG === 'en' ? btcUsd : btcJpy; }
  function msgFor(a){
    var en = window.LANG === 'en';
    var t1 = en ? 20 : 1000, t2 = en ? 200 : 10000, t3 = en ? 2000 : 100000;
    if (a < t1) return L('お小遣いでも、ちゃんと買える。', 'Even pocket money buys some, properly.');
    if (a < t2) return L('ランチ代で、これだけの量になる。', 'For the price of lunch, you get this much.');
    if (a < t3) return L('怯むのは「1BTCの値段」。買うのは、そのうちの割合でいい。', 'What makes you flinch is "the price of 1 BTC". But you only need to buy a fraction of it.');
    return L('それでも1BTCには届かない。でも値動きの割合は、丸ごと買った場合と同じ。', 'Still not a whole BTC. But the percentage moves are the same as buying it whole.');
  }
  function upd(){
    var y = amount();
    var sats = Math.round(y / price() * 100000000);
    lbl.textContent = window.LANG === 'en' ? '$' + y.toLocaleString('en-US') : y.toLocaleString('ja-JP') + '円';
    btcEl.textContent = L('＝ ', '= ') + (sats / 100000000).toFixed(8) + ' BTC';
    bar.style.width = Math.max(2, +range.value) + '%';
    msg.textContent = msgFor(y);
    if (raf) cancelAnimationFrame(raf);
    var from = shown, to = sats, t0 = null;
    function step(t){
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 300);
      shown = Math.round(from + (to - from) * p);
      numEl.textContent = shown.toLocaleString(window.LANG === 'en' ? 'en-US' : 'ja-JP');
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  range.addEventListener('input', upd);
  document.addEventListener('langchange', function(){ renderHint(); upd(); });
  renderHint();
  upd();
  // 実データが取れたら、その現在価格（円／ドル）で換算し直す
  if (window.LiveData) {
    window.LiveData.load().then(function(d){
      if (!d || (!d.jpy && !d.usd)) return;
      if (d.jpy) btcJpy = d.jpy;
      if (d.usd) btcUsd = d.usd;
      livePrice = { jpy: d.jpy, usd: d.usd, source: d.priceSource };
      renderHint();
      upd();
    });
  }
})();
