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
    return p % 10000 === 0 ? (p / 10000).toLocaleString('ja-JP') + '万円'
                           : Math.round(p).toLocaleString('ja-JP') + '円';
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
  function deal(side, size, pair, ownTrade){
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
    if (ownTrade) {
      lastFill = { side: side, p: hitP, amount: amount, remaining: lv.a };
      clearTimeout(fillTimer);
      fillTimer = setTimeout(function(){
        lastFill = null;
        render();
      }, 2600);
    }
    show(d, pair);
    render();
  }
  buildBook(EXAMPLE[cur]);
  el.textContent = fmtPrice(price);
  renderUnit();
  render();
  // 実データが取れたら、その現在価格を出発点に板を組み直す（取引回数は引き継ぐ）
  if (window.LiveData) {
    window.LiveData.load().then(function(d){
      if (myTrades || !d || (!d.jpy && !d.usd)) return;
      liveRates = {
        jpy: d.jpy || Math.round(d.usd * EXAMPLE.jpy / EXAMPLE.usd),
        usd: d.usd || Math.round(d.jpy * EXAMPLE.usd / EXAMPLE.jpy)
      };
      liveSource = d.priceSource;
      buildBook(liveRates[cur]);
      el.textContent = fmtPrice(price);
      renderUnit();
      renderNote();
      render();
    });
  }
  setInterval(function(){
    if (lastFill) return;
    if (Math.random() < 0.5) {
      deal('ask', 10 + Math.round(Math.random() * 20), ['世界の誰かが、少し高い値段で買った', 'Someone in the world just bought at a slightly higher price']);
    } else {
      deal('bid', 10 + Math.round(Math.random() * 20), ['世界の誰かが、少し安い値段で売った', 'Someone in the world just sold at a slightly lower price']);
    }
  }, 2600);
  document.getElementById('buyBtn').addEventListener('click', function(){
    myTrades++;
    renderTrades();
    deal('ask', 30 + Math.round(Math.random() * 25), ['あなたが買った分だけ、売り注文が減った', 'Your purchase reduced the sell orders at that price'], true);
  });
  document.getElementById('sellBtn').addEventListener('click', function(){
    myTrades++;
    renderTrades();
    deal('bid', 30 + Math.round(Math.random() * 25), ['あなたが売った分だけ、買い注文が減った', 'Your sale reduced the buy orders at that price'], true);
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
