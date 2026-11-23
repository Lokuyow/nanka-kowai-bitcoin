(function(){
  // 説明のための架空の相場（1 BTC あたりの円）。月曜から日曜まで。
  var RATES = [15000000, 15600000, 14400000, 13800000, 14700000, 16200000, 15300000];
  var DAYS = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'];
  var DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var PRICE_YEN = 500;
  // ビットコインの値札は、月曜の相場で500円分を切りのよい数にしたもの。
  var PRICE_SAT = 3300;

  var unit = 'yen';
  var range = document.getElementById('dayRange');
  var unitYen = document.getElementById('unitYen');
  var unitBtc = document.getElementById('unitBtc');
  var tagPrice = document.getElementById('tagPrice');
  var tagPay = document.getElementById('tagPay');
  var tagGet = document.getElementById('tagGet');
  var flowPay = document.getElementById('flowPay');
  var flowGet = document.getElementById('flowGet');
  var rateVal = document.getElementById('rateVal');
  var dayName = document.getElementById('dayName');
  var unitOut = document.getElementById('unitOut');
  var sparkLine = document.getElementById('sparkLine');
  var sparkDot = document.getElementById('sparkDot');

  function n(x){ return Math.round(x).toLocaleString('en-US'); }
  function yen(x){ return '¥' + n(x); }
  function sat(x){ return n(x) + ' satoshi'; }
  function man(x){ return L(n(x / 10000) + '万円', '¥' + n(x)); }

  // 相場の折れ線。高いほど上に描く。
  var lo = Math.min.apply(null, RATES), hi = Math.max.apply(null, RATES);
  function px(i){ return 8 + i * (152 / (RATES.length - 1)); }
  function py(r){ return 56 - (r - lo) / (hi - lo) * 48; }
  sparkLine.setAttribute('d', RATES.map(function(r, i){ return (i ? 'L' : 'M') + px(i).toFixed(1) + ' ' + py(r).toFixed(1); }).join(''));

  function render(){
    var d = range.valueAsNumber || 0;
    var rate = RATES[d];
    var isYen = unit === 'yen';
    var pay = isYen ? PRICE_YEN / rate * 1e8 : PRICE_SAT;
    var get = isYen ? PRICE_YEN : PRICE_SAT * rate / 1e8;
    tagPrice.textContent = isYen ? yen(PRICE_YEN) : sat(PRICE_SAT);
    tagPay.textContent = sat(pay);
    tagGet.textContent = yen(get);
    flowPay.classList.toggle('moves', isYen);
    flowGet.classList.toggle('moves', !isYen);
    rateVal.textContent = '1 BTC = ' + man(rate);
    dayName.textContent = L(DAYS[d], DAYS_EN[d]);
    sparkDot.setAttribute('cx', px(d).toFixed(1));
    sparkDot.setAttribute('cy', py(rate).toFixed(1));
    unitYen.setAttribute('aria-pressed', String(isYen));
    unitBtc.setAttribute('aria-pressed', String(!isYen));
    unitOut.textContent = isYen
      ? L('店の売上はいつも500円。値動きの分は、客が払うsatoshiの数で吸収される。', "The shop always gets ¥500. The price swing shows up in how many satoshi the customer pays.")
      : L('客が払うのはいつも3,300 satoshi。値動きの分は、店が受け取る円の価値で吸収される。', 'The customer always pays 3,300 satoshi. The price swing shows up in what the shop receives in yen.');
    if (window.updateRangeFill) window.updateRangeFill(range);
  }

  unitYen.addEventListener('click', function(){ unit = 'yen'; render(); });
  unitBtc.addEventListener('click', function(){ unit = 'btc'; render(); });
  range.addEventListener('input', render);

  // 立場の切り替え。4つの面は重ねてあり、見えるものだけを入れ替える。
  var roleBtns = document.querySelectorAll('.rolepick button');
  var roles = document.querySelectorAll('#roles .role');
  roleBtns.forEach(function(b){
    b.addEventListener('click', function(){
      var key = b.getAttribute('data-role');
      roleBtns.forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
      roles.forEach(function(r){
        var on = r.getAttribute('data-role') === key;
        r.classList.toggle('off', !on);
        if (on) r.removeAttribute('aria-hidden'); else r.setAttribute('aria-hidden', 'true');
      });
    });
  });
  roles.forEach(function(r){ if (r.classList.contains('off')) r.setAttribute('aria-hidden', 'true'); });

  document.addEventListener('langchange', render);
  render();
})();
