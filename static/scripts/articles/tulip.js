(function(){
  var ROUNDS = [
    {
      name: '第1戦: チューリップ（1630年代）', color: '#d33', unit: 'ギルダー',
      nameEn: 'Round 1: Tulips (1630s)',
      yearsEn: ['1634', 'Autumn 1634', '1635', 'Winter 1635', '1636', 'Winter 1636', 'Jan 1637', 'Feb 1637', 'Spring 1637', 'Afterwards'],
      msgsEn: [
        'Bulbs are starting to get talked about a little.',
        'Prices are creeping up.',
        'Rare bulbs are starting to fetch high prices.',
        'Bulb trading has begun in the town taverns.',
        'Some bulbs are said to be worth as much as a fine house.',
        'The peak of the mania. It still feels like it will keep rising.',
        'Somehow, the mood feels off.',
        'Suddenly, the buyers vanished.',
        'Prices fell below where they started, with no sign of recovery.',
        'The mania is over. A bulb is just a bulb again.'
      ],
      prices: [2, 3, 8, 30, 80, 100, 60, 8, 2, 2],
      years: ['1634年', '1634年 秋', '1635年', '1635年 冬', '1636年', '1636年 冬', '1637年 1月', '1637年 2月', '1637年 春', 'その後'],
      msgs: [
        '球根が少し話題になり始めた。',
        '値段がじわじわ上がっている。',
        '珍しい球根に高い値がつき始めた。',
        '街の居酒屋でも球根の取引が始まった。',
        '一部の球根は高級住宅並みの値段だと言われる。',
        '熱狂の頂点。まだ上がる気がする。',
        'なんとなく雲行きが怪しい。',
        '突然買い手が消えた。',
        '値段は元より下がり、戻る気配がない。',
        '熱狂は終わった。球根はただの球根に戻った。'
      ],
      endMsg: function(profit, held){
        if (held) return '持ち続けた球根はほぼ紙くずに。チューリップの熱狂は一度きりで、二度と戻らなかった。';
        return profit >= 0 ? 'うまく逃げ切った。でも、それは運とタイミングの話。熱狂そのものは一度きりで終わった。'
                           : '熱狂に巻かれて損をした。チューリップは一度弾けたら、二度と戻らなかった。';
      },
      endMsgEn: function(profit, held){
        if (held) return 'The bulbs you held onto became nearly worthless. The tulip mania happened once — and never came back.';
        return profit >= 0 ? 'You escaped in time. But that was luck and timing. The mania itself happened once and ended.'
                           : 'The mania swept you up and you lost. Once tulips popped, they never came back.';
      }
    },
    {
      name: '第2戦: ビットコイン（2009年〜）', color: '#c97988', unit: '円（イメージ）',
      nameEn: 'Round 2: Bitcoin (2009-)',
      yearsEn: ['2011', '2013', '2015', '2017', '2018', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
      msgsEn: [
        'Still something like an experiment. Few people know of it.',
        'The first big wave arrived.',
        "A big drop. People started saying \"it's over\".",
        'Another big wave. This time the whole world watched.',
        'A drop of about 80%. "Bitcoin is finished" was widely reported.',
        'Quietly recovering.',
        'New all-time highs. The mania returned.',
        'Another drop of about 70%. "This time it really is over," they said.',
        'Still, the network never stopped, and the price came back.',
        'Back around all-time highs again.',
        'The waves continue even now.',
        'The waves that began 17 years ago have not ended yet.'
      ],
      prices: [1, 4, 2, 10, 2, 8, 20, 6, 16, 40, 22, 55],
      years: ['2011年', '2013年', '2015年', '2017年', '2018年', '2020年', '2021年', '2022年', '2023年', '2024年', '2025年', '2026年'],
      msgs: [
        'まだ実験のような存在。知っている人は少ない。',
        '初めての大きな波が来た。',
        '大きく下げた。「終わった」と言われ始めた。',
        'また大きな波。今度は世界中が注目した。',
        '約8割の下げ。「ビットコインは終わった」と大きく報じられた。',
        '静かに戻してきている。',
        '過去最高を更新。熱狂が戻ってきた。',
        'また約7割の下げ。「今度こそ終わり」と言われた。',
        'それでもネットワークは止まらず、価格は戻してきた。',
        'また過去最高のあたりへ。',
        '波は今も続いている。',
        '17年続いた波はまだ終わっていない。'
      ],
      endMsg: function(profit, held){
        if (profit >= 0) return '暴落のたびに「終わった」と言われても、戻ってきた。チューリップとの違いはこの「戻ってくる」が何度も起きたこと。';
        return '途中の暴落で手放すと、戻ってくる波に乗れない。チューリップとの違いは暴落のあとに「次」があったこと。';
      },
      endMsgEn: function(profit, held){
        if (profit >= 0) return "Every crash brought \"it's over\" — and it came back. The difference from tulips: this \"coming back\" happened again and again.";
        return 'Sell in the middle of a crash, and you miss the wave that comes back. The difference from tulips: after each crash, there was a "next".';
      }
    }
  ];
  var round = 0, idx = 0, cash = 1000, units = 0, totalProfit = 0, over = false;
  var msgPair = ['', ''];
  var endState = null;
  function rName(r){ return L(r.name, r.nameEn); }
  function setMsg(ja, en){ msgPair = [ja, en]; endState = null; msgEl.textContent = L(ja, en); }
  function renderEnd(){
    var r = ROUNDS[round];
    var a = endState.a, profit = endState.profit;
    msgEl.innerHTML = L(r.endMsg(profit, endState.held), r.endMsgEn(profit, endState.held)) + '<br>' +
      L('この戦いの結果: 資産 <b>' + Math.round(a).toLocaleString('ja-JP') + '</b>（' + (profit >= 0 ? '+' : '') + Math.round(profit).toLocaleString('ja-JP') + '）',
        'Result of this round: assets <b>' + Math.round(a).toLocaleString('en-US') + '</b> (' + (profit >= 0 ? '+' : '') + Math.round(profit).toLocaleString('en-US') + ')');
  }
  document.addEventListener('langchange', function(){
    roundEl.textContent = rName(ROUNDS[round]);
    draw();
    if (endState) renderEnd();
    else msgEl.textContent = L(msgPair[0], msgPair[1]);
    mainBtn.textContent = round === 0 ? L('第2戦へ（ビットコイン）', 'To round 2 (Bitcoin)') : L('もう一度あそぶ', 'Play again');
  });

  var pathEl = document.getElementById('gmPath');
  var dotEl = document.getElementById('gmDot');
  var yearEl = document.getElementById('gmYear');
  var priceEl = document.getElementById('gmPrice');
  var msgEl = document.getElementById('gmMsg');
  var assetsEl = document.getElementById('gmAssets');
  var holdEl = document.getElementById('gmHold');
  var roundEl = document.getElementById('gmRound');
  var svgEl = document.getElementById('gmSvg');
  var buyBtn = document.getElementById('gmBuy');
  var sellBtn = document.getElementById('gmSell');
  var nextBtn = document.getElementById('gmNext');
  var mainBtn = document.getElementById('gmMain');
  function pts(r){
    var ps = r.prices, min = Math.min.apply(null, ps), max = Math.max.apply(null, ps);
    var lmin = Math.log(min), lmax = Math.log(max);
    return ps.map(function(p, i){
      var x = 34 + i * (272 / (ps.length - 1));
      var y = 158 - (Math.log(p) - lmin) / (lmax - lmin) * 132;
      return [x, y];
    });
  }
  function assets(){ var r = ROUNDS[round]; return cash + units * r.prices[idx]; }
  function draw(){
    var r = ROUNDS[round];
    var P = pts(r);
    var d = '';
    for (var i = 0; i <= idx; i++) d += (i === 0 ? 'M' : 'L') + P[i][0].toFixed(1) + ',' + P[i][1].toFixed(1) + ' ';
    pathEl.setAttribute('d', d);
    pathEl.setAttribute('stroke', r.color);
    dotEl.setAttribute('cx', P[idx][0]); dotEl.setAttribute('cy', P[idx][1]);
    dotEl.setAttribute('stroke', r.color);
    yearEl.textContent = L(r.years[idx], r.yearsEn[idx]);
    priceEl.textContent = L('価格 ' + r.prices[idx], 'Price ' + r.prices[idx]);
    assetsEl.textContent = Math.round(assets()).toLocaleString('ja-JP');
    holdEl.textContent = units > 0 ? L('持ち分: 保有中（資産は価格で上下する）', 'Holding: invested (assets move with the price)') : L('持ち分: 現金のみ', 'Holding: cash only');
    // 押せる方のボタンだけを見せる。現金なら「買う」、保有中なら「売る」。
    buyBtn.hidden = units > 0;
    sellBtn.hidden = units <= 0;
    buyBtn.disabled = over || units > 0;
    sellBtn.disabled = over || units <= 0;
    nextBtn.disabled = over;
    svgEl.setAttribute('aria-label', L('価格のグラフ（' + r.years[idx] + '・価格 ' + r.prices[idx] + '）', 'Price chart (' + r.yearsEn[idx] + ', Price ' + r.prices[idx] + ')'));
  }
  function startRound(n){
    round = n; idx = 0; cash = 1000; units = 0; over = false;
    roundEl.textContent = rName(ROUNDS[n]);
    mainBtn.hidden = true;
    setMsg(ROUNDS[n].msgs[0] + ' まずは様子見か、買ってみるか。', ROUNDS[n].msgsEn[0] + ' Watch and wait, or buy in?');
    draw();
  }
  buyBtn.addEventListener('click', function(){
    if (over || units > 0) return;
    var r = ROUNDS[round];
    units = cash / r.prices[idx];
    cash = 0;
    setMsg('全額で買った。ここから先は価格しだい。', 'You bought with everything. From here, it all depends on the price.');
    draw();
    sellBtn.focus({preventScroll:true});
  });
  sellBtn.addEventListener('click', function(){
    if (over || units <= 0) return;
    var r = ROUNDS[round];
    cash = units * r.prices[idx];
    units = 0;
    setMsg('全部売った。資産は ' + Math.round(cash).toLocaleString('ja-JP') + ' で確定。', 'Sold everything. Assets locked in at ' + Math.round(cash).toLocaleString('en-US') + '.');
    draw();
    buyBtn.focus({preventScroll:true});
  });
  nextBtn.addEventListener('click', function(){
    var r = ROUNDS[round];
    if (idx >= r.prices.length - 1) {
      over = true;
      var a = assets();
      var profit = a - 1000;
      totalProfit += profit;
      endState = {a: a, profit: profit, held: units > 0};
      renderEnd();
      mainBtn.textContent = round === 0 ? L('第2戦へ（ビットコイン）', 'To round 2 (Bitcoin)') : L('もう一度あそぶ', 'Play again');
      mainBtn.hidden = false;
      draw();
      buyBtn.disabled = true; sellBtn.disabled = true; nextBtn.disabled = true;
      mainBtn.focus({preventScroll:true});
      return;
    }
    idx++;
    setMsg(r.msgs[idx], r.msgsEn[idx]);
    draw();
  });
  mainBtn.addEventListener('click', function(){
    if (round === 0) startRound(1);
    else { totalProfit = 0; startRound(0); }
    buyBtn.focus({preventScroll:true});
  });
  // Thompson (2007), Appendix I. The first point represents early November.
  const bulbIndex = [
    [1636, 11, 5, 8.9], [1636, 11, 12, 10.5], [1636, 11, 25, 97],
    [1636, 12, 1, 108], [1636, 12, 12, 176],
    [1637, 2, 1, 199], [1637, 2, 3, 202], [1637, 2, 5, 178],
    [1637, 2, 9, 148], [1637, 2, 11, 145], [1637, 5, 1, 11],
  ];

  // Coin Metrics PriceUSD, rounded month-end values from Jan 2013 to Dec 2025.
  // CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/).
  const bitcoinUsd = [
    [20.51, 33.38, 93.9, 139, 128, 89.48, 98.02, 128, 126, 203, 1119, 730],
    [803, 551, 455, 449, 628, 639, 582, 479, 389, 337, 379, 321],
    [217, 255, 245, 236, 229, 264, 285, 231, 237, 314, 377, 430],
    [366, 438, 416, 450, 531, 674, 625, 572, 609, 699, 742, 969],
    [968, 1188, 1082, 1382, 2299, 2453, 2863, 4740, 4335, 6429, 9997, 13921],
    [10050, 10307, 6922, 9229, 7479, 6376, 7725, 7025, 6604, 6306, 3973, 3687],
    [3410, 3793, 4094, 5267, 8556, 10843, 10059, 9605, 8282, 9155, 7556, 7167],
    [9357, 8582, 6432, 8652, 9434, 9144, 11338, 11678, 10772, 13807, 19664, 29023],
    [33158, 45359, 58792, 57741, 37313, 35065, 41793, 47219, 43782, 61433, 57097, 46355],
    [38463, 43179, 45562, 37714, 31831, 19333, 23356, 20025, 19435, 20491, 17177, 16524],
    [23130, 23146, 28515, 29362, 27218, 30485, 29220, 25955, 26978, 34636, 37713, 42217],
    [42589, 61395, 71227, 60636, 67378, 62763, 64691, 58960, 63260, 70367, 96464, 93390],
    [102263, 84244, 82461, 94237, 104709, 107153, 115848, 108316, 113972, 109554, 90608, 87517],
  ];

  function drawComparison(id, samples){
    const [startDate, startPrice] = samples[0];
    const monthMs = 365.2425 / 12 * 86400000;
    const points = samples.map(([date, price]) => {
      const months = (date - startDate) / monthMs;
      const x = 58 + Math.log1p(months) / Math.log1p(156) * 302;
      const y = 172 - Math.log10(price / startPrice) * 38;
      return [x.toFixed(1), y.toFixed(1)];
    });
    document.getElementById(id).setAttribute('points', points.map(point => point.join(',')).join(' '));
    return points;
  }

  drawComparison('compareBitcoin', bitcoinUsd.flat().map((price, month) => [Date.UTC(2013, month + 1, 0), price]));
  const bulbPoints = drawComparison('compareTulip', bulbIndex.map(([year, month, day, price]) => [Date.UTC(year, month - 1, day), price]));
  const bulbMarkers = document.getElementById('compareTulipMarkers');
  for (const [x, y] of bulbPoints) {
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    marker.setAttribute('cx', x);
    marker.setAttribute('cy', y);
    marker.setAttribute('r', 2.4);
    bulbMarkers.append(marker);
  }
  startRound(0);
})();
