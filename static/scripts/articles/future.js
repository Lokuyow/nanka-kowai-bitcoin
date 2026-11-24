(function(){
  // 円の世界は物価が毎年2%上がる。本位制の世界はお金の量が増えず、物を作る効率が毎年1.5%上がるので物価が1.5%下がる。
  var YEN_RATE = 0.02, BTC_RATE = -0.015, YEARS = 30;
  var COFFEE_YEN = 500, COFFEE_SAT = 3300, SAVE_CUPS = 2000, LOAN_CUPS = 20000;
  var $ = function(id){ return document.getElementById(id); };
  var range = $('yearRange');

  function priceYen(t){ return COFFEE_YEN * Math.pow(1 + YEN_RATE, t); }
  function priceSat(t){ return COFFEE_SAT * Math.pow(1 + BTC_RATE, t); }
  function cupsYen(t){ return SAVE_CUPS / Math.pow(1 + YEN_RATE, t); }
  function cupsBtc(t){ return SAVE_CUPS / Math.pow(1 + BTC_RATE, t); }
  function n(v){ return Math.round(v).toLocaleString(window.LANG === 'en' ? 'en-US' : 'ja-JP'); }
  function cups(v){ return L(n(v) + '杯', n(v) + ' cups'); }

  // 杯数のグラフ。縦軸は 0〜4,000 杯、横軸は 0〜30 年。
  function x(t){ return 6 + 308 * t / YEARS; }
  function y(c){ return 118 - 110 * c / 4000; }
  function path(fn){
    var d = '';
    for (var t = 0; t <= YEARS; t++) d += (t ? 'L' : 'M') + x(t).toFixed(1) + ' ' + y(fn(t)).toFixed(1);
    return d;
  }
  $('lineYen').setAttribute('d', path(cupsYen));
  $('lineBtc').setAttribute('d', path(cupsBtc));
  $('lblYen').setAttribute('y', (y(cupsYen(YEARS)) + 16).toFixed(1));
  $('lblBtc').setAttribute('y', (y(cupsBtc(YEARS)) - 8).toFixed(1));
  $('cupBase').setAttribute('y1', y(SAVE_CUPS).toFixed(1));
  $('cupBase').setAttribute('y2', y(SAVE_CUPS).toFixed(1));

  function message(t){
    var down = Math.round((1 - cupsYen(t) / SAVE_CUPS) * 100), up = Math.round((cupsBtc(t) / SAVE_CUPS - 1) * 100);
    return t === 0
      ? L('今はどちらの世界でも、コーヒー1杯は同じ値打ち。年数を進めてみよう。', 'Right now a cup of coffee is worth the same in both worlds. Move the years forward.')
      : L(t + '年後、円の世界では貯金で買える杯数が' + down + '%減り、本位制の世界では' + up + '%増えた。借金は逆に、本位制の世界のほうが重くなる。',
          'After ' + t + (t === 1 ? ' year' : ' years') + ', savings buy ' + down + '% fewer cups in the yen world and ' + up + '% more on the bitcoin standard. Debt works the other way: it gets heavier on the bitcoin standard.');
  }
  var out = $('worldOut'), box = document.createElement('div');
  box.className = 'outbox';
  out.parentNode.insertBefore(box, out);
  var ghosts = [0, 1].map(function(){
    var g = document.createElement('p');
    g.className = 'worldout ghost';
    g.setAttribute('aria-hidden', 'true');
    box.appendChild(g);
    return g;
  });
  box.appendChild(out);

  function render(){
    var t = +range.value;
    $('lblYen').textContent = L('円の世界', 'Yen world');
    $('lblBtc').textContent = L('本位制の世界', 'Bitcoin standard');
    $('yearVal').textContent = L(t + '年', t + (t === 1 ? ' year' : ' years'));
    $('priceYen').textContent = L(n(priceYen(t)) + '円', '¥' + n(priceYen(t)));
    $('priceBtc').textContent = n(priceSat(t)) + ' sats';
    $('cupsYen').textContent = cups(cupsYen(t));
    $('cupsBtc').textContent = cups(cupsBtc(t));
    $('loanYen').textContent = cups(LOAN_CUPS / Math.pow(1 + YEN_RATE, t));
    $('loanBtc').textContent = cups(LOAN_CUPS / Math.pow(1 + BTC_RATE, t));
    $('cupNow').setAttribute('x1', x(t).toFixed(1));
    $('cupNow').setAttribute('x2', x(t).toFixed(1));
    $('dotYen').setAttribute('cx', x(t).toFixed(1)); $('dotYen').setAttribute('cy', y(cupsYen(t)).toFixed(1));
    $('dotBtc').setAttribute('cx', x(t).toFixed(1)); $('dotBtc').setAttribute('cy', y(cupsBtc(t)).toFixed(1));
    $('worldOut').textContent = message(t);
    // 0年と30年の文を見えない形で重ね、いちばん長い文に高さを合わせる
    ghosts[0].textContent = message(0);
    ghosts[1].textContent = message(30);
    if (window.updateRangeFill) window.updateRangeFill(range);
  }
  range.addEventListener('input', render);

  // 立場の切り替え。全部の面を重ね、見えない面は場所だけ取る。
  var roleBtns = document.querySelectorAll('.rolepick button');
  var roles = document.querySelectorAll('#roles .role');
  roleBtns.forEach(function(b){
    b.addEventListener('click', function(){
      var r = b.getAttribute('data-role');
      roleBtns.forEach(function(x){ x.setAttribute('aria-pressed', String(x === b)); });
      roles.forEach(function(p){
        var on = p.getAttribute('data-role') === r;
        p.classList.toggle('off', !on);
        if (on) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
      });
    });
  });

  document.addEventListener('langchange', render);
  render();
})();
