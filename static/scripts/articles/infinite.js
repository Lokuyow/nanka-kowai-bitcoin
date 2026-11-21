(function(){
  var S = document.getElementById('dvS');
  var N = document.getElementById('dvN');
  var pieceEl = document.getElementById('dvPiece');
  var capEl = document.getElementById('dvCap');
  var wedge = document.getElementById('dvWedge');
  var lines = document.getElementById('dvLines');
  function divOf(){ return Math.max(1, Math.round(Math.pow(10, +S.value / 1000 * 8))); }
  function setDiv(d){
    d = Math.max(1, Math.min(100000000, Math.round(d)));
    S.value = Math.round(Math.log10(d) / 8 * 1000);
    S.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function polar(deg){
    var rad = (deg - 90) * Math.PI / 180;
    return [130 + 112 * Math.cos(rad), 130 + 112 * Math.sin(rad)];
  }
  function pieceText(d){
    if (d === 1) return '1 BTC';
    if (d === 100000000) return L('0.00000001 BTC（1 satoshi）', '0.00000001 BTC (1 satoshi)');
    if (d <= 1000) return (1 / d) + ' BTC';
    return L('約 ' + (1 / d).toExponential(1).replace('e', '×10の') + ' BTC', 'about ' + (1 / d).toExponential(1) + ' BTC');
  }
  function capFor(d){
    if (d === 1) return L('まだ割っていない状態。1BTCがまるごと1つ。スライダーを右へ引っぱると、好きなだけ細かく割れる。', 'Not split yet — one whole bitcoin. Drag the slider right and split it as fine as you like.');
    if (d === 100000000) return L('これ以上は割れない。1 satoshiが最小単位。線も細かすぎて描ききれない。それでも合計は1BTC。', 'No finer than this. 1 satoshi is the smallest unit. The lines are too fine to draw. And still, the total is 1 BTC.');
    if (d < 10) return L(d + 'つに割っても、全部合わせれば1BTCのまま。濃い色が一切れ。', 'Split into ' + d + ' pieces, it still adds up to 1 BTC. The dark slice is one piece.');
    if (d < 1000) return L('切れ目は増えた。でも全部集めれば1BTC。増えたのは「枚数の数字」だけ。', 'More cuts. But gather them all and it is 1 BTC. The only thing that grew is "the number of pieces".');
    if (d < 1000000) return L('一切れはどんどん小さくなる。合計は1BTCから1 satoshiも増えていない。', 'Each piece keeps shrinking. The total has not grown by even 1 satoshi from 1 BTC.');
    return L('satoshi単位の世界。桁が大きく見えるだけで、量は同じ。', 'The world of satoshi units. The digits look bigger — the amount is the same.');
  }
  function upd(){
    var d = divOf();
    N.textContent = L(d.toLocaleString('ja-JP') + '個', d.toLocaleString('en-US') + (d === 1 ? ' piece' : ' pieces'));
    pieceEl.textContent = pieceText(d);
    capEl.textContent = capFor(d);
    if (d > 1 && d <= 360) {
      var a2 = 360 / d;
      var p1 = polar(0), p2 = polar(a2);
      wedge.setAttribute('d', 'M130 130 L' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) +
        ' A112 112 0 ' + (a2 > 180 ? 1 : 0) + ' 1 ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + ' Z');
      wedge.style.display = '';
    } else {
      wedge.style.display = 'none';
    }
    var n = d === 1 ? 0 : Math.min(d, 720);
    var html = '';
    for (var i = 0; i < n; i++) {
      var p = polar(i * 360 / n);
      html += '<line x1="130" y1="130" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '"/>';
    }
    lines.innerHTML = html;
    lines.setAttribute('stroke-width', d > 100 ? 0.6 : 2);
    lines.setAttribute('opacity', d > 720 ? 0.5 : 1);
  }
  S.addEventListener('input', upd);
  document.addEventListener('langchange', upd);
  document.getElementById('dvX10').addEventListener('click', function(){ setDiv(divOf() * 10); });
  document.getElementById('dvReset').addEventListener('click', function(){ setDiv(1); });
  upd();
})();
