var el = document.getElementById('nowPrice');
  var msg = document.getElementById('dealMsg');
  var unitEl = document.getElementById('unitLbl');
  var noteEl = document.getElementById('liveNote');
  var myTrades = 0;
  var tradesEl = document.getElementById('myTrades');
  var lastPair = null;
  var lastFill = null;
  var fillTimer;
  // 板：段は {p: 価格（表示通貨）, a: 量}。バーの幅は a そのもの（最大100の固定スケール。正規化しない）
  // 表示通貨は日本語=円／英語=ドル。出発価格は実データ（LiveData）が取れたら
  // その現在価格、取れなければ例示価格（円とドルで対にしたイメージ）から始める。
  var EXAMPLE = { jpy: 15015000, usd: 100100 }; // 1ドル=150円のイメージで対にした例示価格
  var ASK_A = [88, 66, 50, 34]; // 売り段の量（最良気配から）
  var BID_A = [90, 72, 55, 38]; // 買い段の量（最良気配から）
  var cur = window.LANG === 'en' ? 'usd' : 'jpy';
  var price, TICK, asks, bids;
  var liveRates = null;  // {jpy, usd} 実価格（取れた場合のみ）
  var liveSource = null; // 価格の出典表示名
  // 刻み幅は価格水準に対して相対的に決める（価格の約1/1500を、1・2・5×10^n の
  // きりのよい値に丸める）。円でもドルでも同じ感覚の動きになる。
  function niceTick(p){
    var target = p / 1500;
    var pow = Math.pow(10, Math.floor(Math.log10(target)));
    var best = pow;
    [1, 2, 5, 10].forEach(function(m){
      var c = m * pow;
      if (Math.abs(Math.log(c / target)) < Math.abs(Math.log(best / target))) best = c;
    });
    return best;
  }
  // 中心価格から板を組む。段は刻みの格子（刻みの倍数）に置き、最良の売りは
  // 中心より上の最初の格子、最良の買いはその1段下。
  function buildBook(center){
    TICK = niceTick(center);
    if (cur !== 'usd') TICK = Math.max(TICK, 10000); // 円は板を1万円単位（万円表記で割り切れる）にする
    price = center;
    var bestAsk = Math.ceil((center + 1) / TICK) * TICK;
    asks = ASK_A.map(function(a, i){ return { p: bestAsk + i * TICK, a: a }; }); // 安い順（先頭が最良気配）
    bids = BID_A.map(function(a, i){ return { p: bestAsk - (i + 1) * TICK, a: a }; }); // 高い順（先頭が最良気配）
  }
  // 言語切替時の換算：取得済みの円ドル両レート（取れなければ例示の対）で
  // 現在のシミュレーション価格を換算し、量を保ったまま新しい刻みで板を組み直す。
  function convertTo(newCur){
    if (newCur === cur) return;
    var pair = liveRates || EXAMPLE;
    var newPrice = Math.round(price * pair[newCur] / pair[cur]);
    var askA = asks.map(function(lv){ return lv.a; });
    var bidA = bids.map(function(lv){ return lv.a; });
    cur = newCur;
    buildBook(newPrice);
    // 組み直しで段数が初期値に戻らないよう、量の並びを現在の板から引き継ぐ
    asks.forEach(function(lv, i){ if (askA[i] !== undefined) lv.a = askA[i]; });
    bids.forEach(function(lv, i){ if (bidA[i] !== undefined) lv.a = bidA[i]; });
    if (lastFill) {
      var book = lastFill.side === 'ask' ? asks : bids;
      lastFill.p = book[0].p + (lastFill.remaining ? 0 : lastFill.side === 'ask' ? -TICK : TICK);
    }
  }
  var askRows = document.getElementById('askRows');
  var bidRows = document.getElementById('bidRows');
  function renderTrades(){ tradesEl.textContent = L('あなたの取引: ' + myTrades + '回', 'Your trades: ' + myTrades); }
  function fmtPrice(n){
    return cur === 'usd' ? '$' + Math.round(n).toLocaleString('en-US')
                         : Math.round(n).toLocaleString('ja-JP');
  }
  function manLabel(p){
    if (cur === 'usd') return '$' + Math.round(p).toLocaleString('en-US');
    // 板の価格は1万円刻みなので、万円表記にそろえる（千の位以下は出さない）
    return Math.round(p / 10000).toLocaleString('ja-JP') + '万円';
  }
  function renderUnit(){
    var base = cur === 'usd' ? 'USD / BTC' : '円 / BTC';
    unitEl.textContent = liveRates ? base : base + L('（イメージ）', ' (illustrative)');
  }
  function renderNote(){
    if (liveRates && liveSource) {
      noteEl.textContent = L('出発点はいまの実価格（' + liveSource + '）',
                             'Starts at the current real price (' + liveSource + ')');
      noteEl.hidden = false;
    } else {
      noteEl.hidden = true;
    }
  }
  function makeRow(lv, fill){
    var row = document.createElement('div');
    row.className = 'row';
    row.dataset.p = lv.p;
    var p = document.createElement('span');
    p.className = 'p';
    p.textContent = manLabel(lv.p);
    var track = document.createElement('div');
    track.className = 'bar-track';
    var bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.width = lv.a + '%';
    track.appendChild(bar);
    if (fill) {
      row.classList.add('filled');
      var consumed = document.createElement('div');
      consumed.className = 'consumed';
      consumed.style.left = fill.remaining + '%';
      consumed.style.width = fill.amount + '%';
      track.appendChild(consumed);
    }
    row.appendChild(p);
    row.appendChild(track);
    return row;
  }
  function renderSide(wrap, book, side){
    var fill = lastFill && lastFill.side === side ? lastFill : null;
    var levels = book.slice();
    if (fill && !fill.remaining) {
      levels.unshift({p: fill.p, a: 0});
    }
    if (side === 'ask') levels.reverse();
    wrap.replaceChildren(...levels.map(function(lv){
      return makeRow(lv, fill && lv.p === fill.p ? fill : null);
    }));
  }
  function render(){
    renderSide(askRows, asks, 'ask');
    renderSide(bidRows, bids, 'bid');
  }
  function show(d, pair){
    el.textContent = fmtPrice(price);
    el.className = 'nowprice ' + (d > 0 ? 'up' : d < 0 ? 'down' : '');
    lastPair = pair;
    msg.textContent = L(pair[0], pair[1]);
  }
  // side='ask' は買い（最良の売り注文を取る）、'bid' は売り（最良の買い注文を取る）。
  // 約定した段だけが減り、空になったら消えて外側に新しい段が補充される。他の段は変わらない。
  function deal(side, size, pair){
    var book = side === 'ask' ? asks : bids;
    var lv = book[0];
    var hitP = lv.p;
    var amount = Math.min(size, lv.a);
    lv.a -= amount;
    if (lv.a <= 0) {
      book.shift();
      var np = side === 'ask' ? book[book.length - 1].p + TICK : book[book.length - 1].p - TICK;
      book.push({p: np, a: 25 + Math.round(Math.random() * 70)});
    }
    var d = hitP - price;
    price = hitP;
    lastFill = { side: side, p: hitP, amount: amount, remaining: lv.a };
    clearTimeout(fillTimer);
    fillTimer = setTimeout(function(){
      lastFill = null;
      render();
    }, 2600);
    show(d, pair);
    render();
  }
  buildBook(EXAMPLE[cur]);
  el.textContent = fmtPrice(price);
  renderUnit();
  render();
  // 実データが取れたら、その現在価格を出発点に板を組み直す（取引回数は引き継ぐ）
  if (window.LiveData) {
    window.LiveData.loadPrices().then(function(d){
      if (myTrades || !d || (!d.jpy && !d.usd)) return;
      liveRates = {
        jpy: d.jpy || Math.round(d.usd * EXAMPLE.jpy / EXAMPLE.usd),
        usd: d.usd || Math.round(d.jpy * EXAMPLE.usd / EXAMPLE.jpy)
      };
      liveSource = d.source;
      buildBook(liveRates[cur]);
      el.textContent = fmtPrice(price);
      renderUnit();
      renderNote();
      render();
    });
  }
  document.getElementById('buyBtn').addEventListener('click', function(){
    myTrades++;
    renderTrades();
    deal('ask', 30 + Math.round(Math.random() * 25), ['あなたが買った分だけ売り注文が減った', 'Your purchase reduced the sell orders at that price']);
  });
  document.getElementById('sellBtn').addEventListener('click', function(){
    myTrades++;
    renderTrades();
    deal('bid', 30 + Math.round(Math.random() * 25), ['あなたが売った分だけ買い注文が減った', 'Your sale reduced the buy orders at that price']);
  });
  document.addEventListener('langchange', function(){
    convertTo(window.LANG === 'en' ? 'usd' : 'jpy');
    el.textContent = fmtPrice(price);
    renderTrades();
    renderUnit();
    renderNote();
    render();
    if (lastPair) msg.textContent = L(lastPair[0], lastPair[1]);
  });
/* 取引所ごとの値段のずれを、安い方で買って高い方で売ることで埋めていく試し。
   値段は基準価格に対する倍率で持ち、日本語は円、英語はドルで表示する。 */
(function(){
  var card = document.getElementById('arbCard');
  if (!card) return;
  var $ = function(id){ return document.getElementById(id); };
  var BASE = { jpy: 15000000, usd: 100000 };
  var OPEN_GAP = 0.006;   // 差が開いたときの幅（基準価格の0.6%）
  var FEE = 0.0005;       // 売り買い合わせた手数料（基準価格の0.05%）
  var SIZE = 0.1;         // 1回に売り買いする量（BTC）
  var mA, mB, profit, lastMsg, news, touched = false;
  function cur(){ return window.LANG === 'en' ? 'usd' : 'jpy'; }
  function money(m){
    var v = Math.round(m * BASE[cur()]);
    return cur() === 'usd' ? '$' + v.toLocaleString('en-US') : v.toLocaleString('ja-JP') + '円';
  }
  function price(m){
    var v = Math.round(m * BASE[cur()]);
    return cur() === 'usd' ? '$' + v.toLocaleString('en-US') : v.toLocaleString('ja-JP');
  }
  function name(x){ return L('取引所' + x, 'Exchange ' + x); }
  function cheap(){ return mA <= mB ? 'A' : 'B'; }
  function pricey(){ return mA <= mB ? 'B' : 'A'; }
  function gap(){ return Math.abs(mA - mB); }
  function done(){ return gap() <= FEE; }
  function setMsg(ja, en){ lastMsg = [ja, en]; $('arbMsg').textContent = L(ja, en); }
  function flash(el, dir){
    el.classList.remove('up', 'down');
    void el.offsetWidth;
    if (dir) el.classList.add(dir);
  }
  function render(){
    $('arbPriceA').textContent = price(mA);
    $('arbPriceB').textContent = price(mB);
    $('arbGap').textContent = money(gap());
    var c = cheap(), h = pricey(), same = done();
    ['A', 'B'].forEach(function(x){
      var box = $('arbBox' + x), tag = $('arbTag' + x);
      box.classList.toggle('cheap', !same && x === c);
      box.classList.toggle('pricey', !same && x === h);
      tag.textContent = same ? L('ほぼ同じ', 'about the same') : x === c ? L('安い', 'cheaper') : L('高い', 'pricier');
    });
    var trade = $('arbTrade');
    trade.textContent = L('安い' + name(c) + 'で買って、高い' + name(h) + 'で売る',
                          'Buy on ' + name(c) + ', sell on ' + name(h));
    trade.disabled = same;
    $('arbNews').textContent = L('片方の取引所に注文が殺到する', 'Orders flood into one exchange');
    $('arbProfit').textContent = L('あなたの利益（手数料を引いた後）: ', 'Your profit (after fees): ') + money(profit);
    $('arbNote').textContent = L('1回に' + SIZE + ' BTCずつ売り買いし、手数料は合わせて' + money(FEE) + 'とした（イメージ）。',
                                 'Each round trades ' + SIZE + ' BTC, with ' + money(FEE) + ' in total fees (illustrative).');
    if (lastMsg) $('arbMsg').textContent = L(lastMsg[0], lastMsg[1]);
  }
  function reset(){
    mA = 1; mB = 1 + OPEN_GAP; profit = 0; news = 0;
    setMsg('同じ時刻なのに、取引所Bの方が取引所Aより高い。安い方で買って高い方で売ると、どうなる？',
           'At the same moment, Exchange B is pricier than Exchange A. What happens if you buy on the cheaper one and sell on the pricier one?');
    render();
  }
  $('arbTrade').addEventListener('click', function(){
    if (done()) return;
    touched = true;
    var c = cheap(), h = pricey(), g = gap();
    profit += (g - FEE) * SIZE;
    // 安い方は買われて売り注文が減るので上がり、高い方は売られて買い注文が減るので下がる
    var step = g / 4;
    if (c === 'A') { mA += step; mB -= step; } else { mB += step; mA -= step; }
    flash($('arbPrice' + c), 'up');
    flash($('arbPrice' + h), 'down');
    if (done()) {
      setMsg('差が手数料より小さくなり、もう得をしない。値段をそろえる係はいないのに、差で得をしようとする人たちの売り買いで、2つの値段は近づいた。',
             'The gap is now smaller than the fees, so there is no profit left. No one is in charge of matching prices, yet trades by people chasing the gap pulled the two prices together.');
    } else {
      setMsg(name(c) + 'で買ったので売り注文が減って値段が上がり、' + name(h) + 'で売ったので買い注文が減って値段が下がった。差が縮んだ。',
             'Buying on ' + name(c) + ' used up sell orders and pushed its price up. Selling on ' + name(h) + ' used up buy orders and pushed its price down. The gap shrank.');
    }
    render();
  });
  $('arbNews').addEventListener('click', function(){
    // 交互に片方だけ買いが殺到して、その取引所の値段だけが上がる
    touched = true;
    var x = news++ % 2 === 0 ? 'A' : 'B';
    var other = x === 'A' ? mB : mA;
    if (x === 'A') mA = other + OPEN_GAP; else mB = other + OPEN_GAP;
    flash($('arbPrice' + x), 'up');
    setMsg(name(x) + 'だけに買い注文が殺到して、' + name(x) + 'の値段だけが上がった。また差が開いた。',
           'Buy orders flooded into ' + name(x) + ' only, so only its price rose. The gap opened again.');
    render();
  });
  document.addEventListener('langchange', render);
  reset();
  // 上の注文板と同じく、実データが取れたらいまの価格（円は1万円、ドルは100ドル単位に丸める）を基準にする
  if (window.LiveData) {
    window.LiveData.loadPrices().then(function(d){
      if (touched || !d || (!d.jpy && !d.usd)) return;
      var jpy = d.jpy || d.usd * BASE.jpy / BASE.usd;
      var usd = d.usd || d.jpy * BASE.usd / BASE.jpy;
      BASE = { jpy: Math.round(jpy / 10000) * 10000, usd: Math.round(usd / 100) * 100 };
      render();
    });
  }
})();
