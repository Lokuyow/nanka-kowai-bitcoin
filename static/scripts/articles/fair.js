(function(){
  // ドル建てのおおよその価格。各点は [年, 月, 価格]。山や谷の時期は月を細かく入れている。
  var PATH = [
    [2011,6,17],[2011,9,5],[2011,11,2.5],[2012,3,4.9],[2012,6,6.7],[2012,9,12],[2012,12,13.5],
    [2013,3,93],[2013,4,140],[2013,7,90],[2013,10,200],[2013,11,1150],[2014,2,550],[2014,6,630],
    [2014,9,390],[2014,12,320],[2015,1,220],[2015,6,263],[2015,9,236],[2015,12,430],[2016,6,670],
    [2016,9,610],[2016,12,960],[2017,3,1080],[2017,6,2500],[2017,9,4300],[2017,12,19000],[2018,2,8000],
    [2018,6,6300],[2018,9,6600],[2018,12,3500],[2019,3,4100],[2019,6,10849],[2019,9,8300],[2019,12,7200],
    [2020,3,5000],[2020,6,9100],[2020,9,10800],[2020,12,29000],[2021,4,60000],[2021,7,33000],[2021,11,66000],
    [2022,3,45000],[2022,6,19000],[2022,11,16000],[2023,3,28000],[2023,6,30476],[2023,9,27000],[2023,12,42000],
    [2024,3,71000],[2024,8,58000],[2024,12,94000],[2025,3,82000],[2025,6,107000],[2025,10,126000],[2025,12,88000]
  ];
  var START = {y2011: '2011-6', y2015: '2015-6', y2019: '2019-6', y2023: '2023-6'};
  var NEWS = {
    '2011-11': ['大きく値下がりし、「やっぱり怪しい」と騒がれた', 'A big drop: "just as shady as we thought," people said'],
    '2013-11': ['初めて1000ドルを超え、ニュースで大きく取り上げられた', 'It passed $1,000 for the first time and made headlines'],
    '2014-2': ['大手取引所のマウントゴックスが破たんした', 'Mt. Gox, a major exchange, collapsed'],
    '2015-1': ['最高値から8割以上下がった', 'Down more than 80% from the peak'],
    '2017-9': ['中国が国内の取引所に営業停止を命じた', 'China ordered its exchanges to shut down'],
    '2017-12': ['「乗り遅れるな」と大ブームになった', '"Don\'t miss out" — it became a huge craze'],
    '2018-12': ['熱狂が冷め、最高値から8割下がった', 'The craze cooled, down 80% from the peak'],
    '2020-3': ['世界的な混乱で、数日で半分近くになった', 'In the global turmoil, it nearly halved in days'],
    '2021-4': ['最高値を更新した', 'A new all-time high'],
    '2021-7': ['数か月で半分近くまで下がった', 'It fell almost by half in a few months'],
    '2022-6': ['大手の暗号資産貸付サービスが引き出しを止めた', 'A major crypto lender froze withdrawals'],
    '2022-11': ['大手取引所のFTXが破たんした', 'FTX, a major exchange, collapsed'],
    '2024-3': ['ETFの承認後、最高値を更新した', 'After ETF approval, a new all-time high'],
    '2025-10': ['また最高値を更新した', 'Another all-time high'],
    '2025-12': ['最高値から3割ほど下がった', 'Down about 30% from the peak']
  };
  var $ = function(id){ return document.getElementById(id); };
  var simArea = $('simArea'), simVal = $('simVal'), simX = $('simX'), simDate = $('simDate'), simDd = $('simDd');
  var simNews = $('simNews'), simRes = $('simRes'), simHead = $('simHead'), simMsg = $('simMsg');
  var resMineLbl = $('resMineLbl'), resMine = $('resMine'), resHold = $('resHold'), resMineX = $('resMineX'), resHoldX = $('resHoldX'), resHoldLbl = $('resHoldLbl');
  var simLine = $('simLine'), afterLine = $('afterLine'), baseLine = $('baseLine'), nowDot = $('nowDot');
  var sellMark = $('sellMark'), sellTick = $('sellTick'), sellDot = $('sellDot');
  var btnSell = $('btnSell'), btnAgain = $('btnAgain');
  var yearBtns = document.querySelectorAll('#yearPick button');

  var key = null, pts = [], i = 0, soldAt = -1, done = false, timer = null, worstDd = 0, worstIdx = 0, lastNews = null, newsAt = -1;
  var lo = 0, hi = 1;

  function invest(){ return window.LANG === 'en' ? 1000 : 10; }
  function valueAt(k){ return invest() * pts[k][2] / pts[0][2]; }
  function fmt(v){
    if (window.LANG === 'en') return '$' + Math.round(v).toLocaleString('en-US');
    var r = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
    return r.toLocaleString('ja-JP') + '万円';
  }
  function mult(v){
    var m = v / invest();
    if (m >= 1.05) return '×' + (m >= 100 ? Math.round(m).toLocaleString('en-US') : m >= 10 ? Math.round(m) : m.toFixed(1));
    if (m <= 0.95) return '−' + Math.round((1 - m) * 100) + '%';
    return '±0%';
  }
  function dateText(p){ return window.LANG === 'en' ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][p[1] - 1] + ' ' + p[0] : p[0] + '年' + p[1] + '月'; }
  function x(k){ return 10 + 300 * k / (pts.length - 1); }
  function y(k){ return 140 - 128 * (Math.log(pts[k][2]) - lo) / (hi - lo); }
  function line(from, to){
    var s = '';
    for (var k = from; k <= to; k++) s += x(k).toFixed(1) + ',' + y(k).toFixed(1) + ' ';
    return s;
  }
  function ddAt(k){
    var peak = 0;
    for (var j = 0; j <= k; j++) peak = Math.max(peak, pts[j][2]);
    return 1 - pts[k][2] / peak;
  }

  function render(){
    if (!key) return;
    var held = soldAt < 0 ? i : soldAt;
    simLine.setAttribute('points', line(0, held));
    afterLine.setAttribute('points', soldAt >= 0 ? line(soldAt, i) : '');
    var by = y(0).toFixed(1);
    baseLine.setAttribute('y1', by); baseLine.setAttribute('y2', by);
    nowDot.setAttribute('cx', x(i).toFixed(1)); nowDot.setAttribute('cy', y(i).toFixed(1));
    nowDot.classList.toggle('ghost', soldAt >= 0);
    sellMark.style.display = soldAt < 0 ? 'none' : '';
    if (soldAt >= 0) {
      sellTick.setAttribute('x1', x(soldAt).toFixed(1)); sellTick.setAttribute('x2', x(soldAt).toFixed(1));
      sellDot.setAttribute('cx', x(soldAt).toFixed(1)); sellDot.setAttribute('cy', y(soldAt).toFixed(1));
    }
    var v = valueAt(held);
    simVal.textContent = fmt(v);
    simX.textContent = mult(v);
    simX.className = 'simx ' + (v >= invest() ? 'up' : 'down');
    simDate.textContent = dateText(pts[i]);
    var dd = ddAt(i);
    simDd.textContent = soldAt >= 0 ? L('売却済み', 'Sold') : dd >= 0.15 ? L('最高値から', 'From peak ') + '−' + Math.round(dd * 100) + '%' : dd < 0.01 && i > 0 ? L('最高値', 'All-time high') : '';
    simDd.className = 'simdd' + (soldAt < 0 && dd >= 0.5 ? ' deep' : '');
    var n = NEWS[pts[i][0] + '-' + pts[i][1]];
    if (n && newsAt !== i) { lastNews = n; newsAt = i; }
    // ニュースは少しのあいだだけ出し、古くなったら消す
    var fresh = lastNews && i - newsAt < 4;
    simNews.textContent = i === 0 ? L('買った。ここから値動きが進む。', 'Bought. The market starts moving.')
      : fresh ? L(lastNews[0], lastNews[1])
      : soldAt >= 0 ? L('売ったあとの値動き', 'What happened after you sold')
      : L('値動きを見守っている…', 'Watching the price…');
    simNews.classList.toggle('quiet', !fresh && i > 0);
    // 結果は終わるまで見えないが、先に中身を入れて高さを確保しておく
    result();
  }

  function result(){
    var end = pts.length - 1, hold = valueAt(end);
    if (soldAt < 0) {
      // 持ち続けた人には、途中でいちばん下がった場面を並べて見せる
      var low = valueAt(worstIdx);
      simHead.textContent = L('最後まで持ち続けた', 'You held to the end');
      resMineLbl.textContent = L('あなたの結果', 'Your result');
      resMine.textContent = fmt(hold); resMineX.textContent = mult(hold);
      resHoldLbl.textContent = L('いちばん下がったとき', 'At the worst point');
      resHold.textContent = fmt(low); resHoldX.textContent = dateText(pts[worstIdx]) + ' ' + mult(low);
      simMsg.textContent = worstIdx === end
        ? L('最高値から最大' + Math.round(worstDd * 100) + '%下がったところで終わった。', 'You ended down ' + Math.round(worstDd * 100) + '% from the peak.')
        : L('途中で最高値から最大' + Math.round(worstDd * 100) + '%下がる場面を持ちこたえた。', 'Along the way you sat through a drop of up to ' + Math.round(worstDd * 100) + '% from the peak.');
    } else {
      var mine = valueAt(soldAt);
      resHoldLbl.textContent = L('最後まで持っていたら', 'If held to the end');
      resHold.textContent = fmt(hold); resHoldX.textContent = mult(hold);
      simHead.textContent = L(dateText(pts[soldAt]) + 'に売った', 'You sold in ' + dateText(pts[soldAt]));
      resMineLbl.textContent = L('売ったときの額', 'When you sold');
      resMine.textContent = fmt(mine); resMineX.textContent = mult(mine);
      simMsg.textContent = soldAt === 0 || Math.abs(mine - invest()) < 1e-6
        ? L('買った直後に同じ額で手放した。そのあとも値動きは続いた。', 'You sold right away at the same price you paid. The market kept moving after that.')
        : mine < invest()
          ? L('怖くなって買った額より安く手放した。早く買った人もこの場面を通ってきた。', 'Fear won, and you sold below what you paid. Many early buyers went through this too.')
          : mine >= hold
            ? L('売ったあとに値下がりした。売りどきはその時点ではわからない。', 'It fell after you sold. No one knows the right time to sell when it happens.')
            : L('利益は出たが売ったあとも値上がりが続いた。売りどきはその時点ではわからない。', 'You made a profit, but the price kept rising after you sold. No one knows the right time to sell when it happens.');
    }
  }

  function stopTimer(){ if (timer) { clearTimeout(timer); timer = null; } }
  function tick(){
    if (i >= pts.length - 1) { finish(); return; }
    i++;
    if (soldAt < 0 && ddAt(i) > worstDd) { worstDd = ddAt(i); worstIdx = i; }
    if (i >= pts.length - 1) { finish(); return; }
    render();
    var fast = soldAt >= 0 ? 0.35 : 1;
    timer = setTimeout(tick, step() * fast);
  }
  function step(){ return Math.max(230, Math.min(800, 13000 / pts.length)); }
  var sellFocused = false;
  function finish(){
    stopTimer();
    done = true;
    var moveFocus = sellFocused || document.activeElement === btnSell;
    sellFocused = false;
    btnSell.disabled = true;
    btnSell.classList.add('off');
    btnAgain.classList.remove('off');
    simNews.classList.add('off');
    simRes.classList.remove('off');
    render();
    if (moveFocus) btnAgain.focus({preventScroll:true});
  }
  function setup(k){
    stopTimer();
    key = k;
    var s = START[k], from = PATH.findIndex(function(p){ return p[0] + '-' + p[1] === s; });
    pts = PATH.slice(from);
    var logs = pts.map(function(p){ return Math.log(p[2]); });
    lo = Math.min.apply(null, logs); hi = Math.max.apply(null, logs);
    var pad = (hi - lo) * 0.06; lo -= pad; hi += pad;
    i = 0; soldAt = -1; done = false; sellFocused = false; worstDd = 0; worstIdx = 0; lastNews = null; newsAt = -1;
    btnSell.disabled = false;
    btnSell.classList.remove('off');
    btnAgain.classList.add('off');
    simNews.classList.remove('off');
    simRes.classList.add('off');
    yearBtns.forEach(function(b){ var on = b.getAttribute('data-year') === k; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    render();
  }
  function start(k){
    setup(k);
    simArea.hidden = false;
    timer = setTimeout(tick, 700);
  }

  yearBtns.forEach(function(b){
    b.addEventListener('click', function(){ start(b.getAttribute('data-year')); });
  });
  btnSell.addEventListener('click', function(){
    if (!key || done || soldAt >= 0) return;
    sellFocused = document.activeElement === btnSell;
    soldAt = i;
    btnSell.disabled = true;
    render();
    // 売ったあとの値動きは早送りで最後まで見せる
    stopTimer();
    timer = setTimeout(tick, 250);
  });
  btnAgain.addEventListener('click', function(){
    if (!key) return;
    start(key);
    var cur = Array.prototype.find.call(yearBtns, function(b){ return b.getAttribute('data-year') === key; }) || yearBtns[0];
    cur.focus({preventScroll:true});
  });
  document.addEventListener('langchange', render);
  // 始める前から遊ぶときと同じ高さを取り、押したときに下の内容が動かないようにする
  setup('y2011');
  yearBtns.forEach(function(b){ b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); });
})();
