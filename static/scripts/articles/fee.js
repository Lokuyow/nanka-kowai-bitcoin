(function(){
  var range = document.getElementById('amtRange');
  var amtLbl = document.getElementById('amtLbl');
  var routeEx = document.getElementById('routeEx');
  var routeSelf = document.getElementById('routeSelf');
  var selfOpts = document.getElementById('selfOpts');
  var spdWait = document.getElementById('spdWait');
  var spdFast = document.getElementById('spdFast');
  var result = document.getElementById('sendResult');
  var route = 'ex', speed = 'wait';
  function isEn(){ return window.LANG === 'en'; }
  function amt(v){
    v = v === undefined ? +range.value : v;
    if (isEn()) {
      var rawU = 5 * Math.pow(1000, v / 100);   /* 英語モードの金額: $5〜$5,000 */
      return rawU >= 1000 ? Math.round(rawU / 10) * 10 : Math.round(rawU);
    }
    var raw = 500 * Math.pow(1000, v / 100);
    return raw >= 100000 ? Math.round(raw / 1000) * 1000 : Math.round(raw / 100) * 100;
  }
  function money(n){ return isEn() ? '$' + n.toLocaleString('en-US') : n.toLocaleString('ja-JP') + '円'; }
  function updLbl(){ amtLbl.textContent = money(amt()); }
  range.addEventListener('input', updLbl);
  updLbl();
  function setRoute(r){
    route = r;
    routeEx.classList.toggle('on', r === 'ex');
    routeSelf.classList.toggle('on', r === 'self');
    routeEx.setAttribute('aria-pressed', String(r === 'ex'));
    routeSelf.setAttribute('aria-pressed', String(r === 'self'));
    selfOpts.hidden = r !== 'self';
  }
  routeEx.addEventListener('click', function(){ setRoute('ex'); });
  routeSelf.addEventListener('click', function(){ setRoute('self'); });
  spdWait.addEventListener('click', function(){ speed = 'wait'; spdWait.classList.add('on'); spdFast.classList.remove('on'); spdWait.setAttribute('aria-pressed', 'true'); spdFast.setAttribute('aria-pressed', 'false'); });
  spdFast.addEventListener('click', function(){ speed = 'fast'; spdFast.classList.add('on'); spdWait.classList.remove('on'); spdFast.setAttribute('aria-pressed', 'true'); spdWait.setAttribute('aria-pressed', 'false'); });
  var lastRun = null; /* { route, speed, v, mode:'live'|'legacy' } */
  var liveData = null;  /* LiveData の取得結果（使えなければ null） */
  var settled = false;  /* 取得が終わったかどうか（免責文の出し分け用） */
  var noteEl = document.getElementById('feeNote');
  function fmtRate(rate){
    return rate < 10 ? String(Math.round(rate * 10) / 10) : String(Math.round(rate));
  }
  function congIdxFor(rate){
    return rate < 10 ? 0 : (rate < 60 ? 1 : 2);
  }
  function curPrice(){ return liveData ? (isEn() ? liveData.usd : liveData.jpy) : null; }
  function liveReady(){ return !!(liveData && liveData.tiers && curPrice()); }
  function liveFee(route, speed){
    var price = curPrice();
    if (route === 'ex') return { fee: Math.round(0.0005 * price), rate: null };
    var rate = speed === 'fast' ? liveData.tiers.fastest : liveData.tiers.hour;
    return { fee: Math.round(rate * window.LiveData.VB * price / 1e8), rate: rate };
  }
  var EX_FEE = { jpy: 7500, usd: 50 };                      /* 従来計算の取引所手数料（0.0005 BTC の目安換算） */
  var SELF_BASE = { jpy: 400, usd: 3 };  /* 実データがない場合の低めの手数料の例 */
  function updateNote(){
    if (!noteEl || !settled) return;
    if (liveReady()) {
      var srcs = liveData.rateSource === liveData.priceSource ? liveData.rateSource : liveData.rateSource + ' / ' + liveData.priceSource;
      noteEl.textContent = L('「自分で送金する」の手数料はいまの実データ（' + srcs + '）から計算しています。取引所の出金手数料は一例として 0.0005 BTC を同じ価格で円に換算しています。',
        'The "send it yourself" fee is calculated from live data (' + srcs + '). The exchange withdrawal fee is an example 0.0005 BTC, converted to dollars at the same price.');
    } else {
      noteEl.textContent = L('実データを取得できなかったため、手数料は目安の数値で計算しています。取引所の出金手数料は一例として 0.0005 BTC（1 BTC=1,500万円なら7,500円）で計算しています。',
        'Live data could not be loaded, so the fees are calculated with illustrative values. The exchange withdrawal fee is an example 0.0005 BTC ($50 if 1 BTC = $100,000).');
    }
  }
  function renderResult(){
    if (!lastRun) return;
    var a = amt(lastRun.v);
    var isLive = lastRun.mode === 'live' && liveReady();
    var run = isLive ? liveFee(lastRun.route, lastRun.speed)
      : lastRun.route === 'ex' ? { fee: isEn() ? EX_FEE.usd : EX_FEE.jpy, rate: null }
      : { fee: Math.round((isEn() ? SELF_BASE.usd : SELF_BASE.jpy) * (lastRun.speed === 'fast' ? 3 : 1)), rate: null };
    var fee = run.fee, msg;
    var congIdx = isLive ? congIdxFor(liveData.tiers.halfHour) : null;
    if (lastRun.route === 'ex') {
      if (fee >= a) msg = L('予算が出金手数料以下なので、この条件では送れない。', "The withdrawal fee uses up the entire budget or more, so the transfer cannot go ahead.");
      else {
        var pct = Math.round(fee / a * 100);
        msg = L('手数料は予算の' + pct + '%。金額が小さいほど、固定料金の重さが目立ってくる。', 'The fee is about ' + pct + '% of the total. The smaller the amount, the heavier the fixed charge feels.');
        if (pct <= 2) msg += L('大きな額なら割合は小さくなる。でも、それはネットワークの手数料が下がったからではない。', ' With a large amount the share shrinks — but not because the network fee went down.');
      }
    } else if (fee >= a) {
      msg = L('予算がネットワーク手数料以下なので、この条件では送れない。', 'The network fee uses up the entire budget or more, so the transfer cannot go ahead.');
    } else {
      var congNames = [['空いている', 'quiet'], ['ふつう', 'normal'], ['混雑している', 'busy']];
      var pct2 = fee / a * 100;
      var pctTxt = pct2 < 0.1 ? '0.1%未満' : pct2.toFixed(1) + '%';
      var pctTxtEn = pct2 < 0.1 ? 'less than 0.1%' : pct2.toFixed(1) + '%';
      if (isLive) {
        msg = L('いまのネットワークは「' + congNames[congIdx][0] + '」。手数料レートは約' + fmtRate(run.rate) + ' sat/vBで、手数料は予算の' + pctTxt + '。この図では同じ大きさの取引を送るので、予算を変えても手数料は同じ。',
                'The network is "' + congNames[congIdx][1] + '" right now, at a fee rate of about ' + fmtRate(run.rate) + ' sat/vB. The fee is ' + pctTxtEn + ' of the budget. The fee stays the same as you change the budget because the transaction data stays the same size.');
      } else {
        msg = L('例として、手数料は予算の' + pctTxt + '。この図では同じ大きさの取引を送るので、予算を変えても手数料は同じ。',
                'In this example, the fee is ' + pctTxtEn + ' of the budget. The fee stays the same as you change the budget because the transaction data stays the same size.');
      }
    }
    var got = Math.max(0, a - fee);
    document.getElementById('rAmt').textContent = money(a);
    document.getElementById('rFee').textContent = money(fee);
    document.getElementById('rGot').textContent = money(got);
    document.getElementById('rBar').style.width = got / a * 100 + '%';
    document.getElementById('rMsg').textContent = msg;
    result.hidden = false;
  }
  document.getElementById('sendBtn').addEventListener('click', function(){
    lastRun = { route: route, speed: speed, v: +range.value, mode: 'legacy' };
    if (liveReady()) {
      lastRun.mode = 'live';
    }
    renderResult();
  });
  window.LiveData.load().then(function(d){
    settled = true;
    /* シミュレータの実データ計算にはレートと表示通貨の価格の両方が要る。欠けたら従来計算のまま */
    liveData = (d && d.tiers && (d.jpy || d.usd)) ? d : null;
    updateNote();
    if (lastRun && liveReady()) { lastRun.mode = 'live'; renderResult(); }
  });
  document.addEventListener('langchange', function(){
    updLbl(); updateNote();
    if (lastRun && liveReady()) lastRun.mode = 'live';
    renderResult();
  });
})();

;
/* いまの送金手数料の目安（実データ表示）
   取得は共通モジュール LiveData（シミュレータと共用・ページ内で1回だけ）。目安には
   halfHour 相当のレートを使い、取れなければ何も表示しない（ページは従来どおり動く）。 */
(function(){
  var line = document.getElementById('liveFeeLine');
  var labelEl = document.getElementById('liveFeeLabel');
  var mainEl = document.getElementById('liveFeeMain');
  var srcEl = document.getElementById('liveFeeSrc');
  if (!line || !window.LiveData) return;
  var VB = window.LiveData.VB;
  var state = null; /* { rate: sat/vB, source: 表示名 } */
  function roundSats(sats){
    /* 目安として誠実な桁に丸める */
    if (sats < 100) return Math.round(sats);
    if (sats < 1000) return Math.round(sats / 10) * 10;
    return Math.round(sats / 100) * 100;
  }
  function fmtBtc(sats){
    /* sats ÷ 1億。小数8桁まで出して末尾の不要な0を落とす */
    var s = (sats / 1e8).toFixed(8).replace(/0+$/, '');
    if (s.endsWith('.')) s = s.slice(0, -1);
    return s;
  }
  function fmtRate(rate){
    return rate < 10 ? String(Math.round(rate * 10) / 10) : String(Math.round(rate));
  }
  function render(){
    if (!state) return;
    var sats = roundSats(state.rate * VB);
    var rateTxt = fmtRate(state.rate);
    labelEl.textContent = L('いまの目安', 'Live estimate');
    mainEl.innerHTML = L(
      '約' + fmtBtc(sats) + ' BTC<span class="livefee-detail">（' + sats.toLocaleString('ja-JP') + ' sats・' + rateTxt + ' sat/vB）</span>',
      'about ' + fmtBtc(sats) + ' BTC<span class="livefee-detail">(' + sats.toLocaleString('en-US') + ' sats, ' + rateTxt + ' sat/vB)</span>');
    srcEl.textContent = L(
      'いまの実データ（' + state.source + '）から計算。普通の送金1回を約140 vBとして計算しています',
      'Calculated from live data (' + state.source + '), for a typical transfer of about 140 vB');
    line.hidden = false;
    srcEl.hidden = false;
  }
  document.addEventListener('langchange', render);
  window.LiveData.load().then(function(d){
    if (!d || !d.tiers) return; /* レートが取れなければ何も表示しない */
    state = { rate: d.tiers.halfHour, source: d.rateSource };
    render();
  });
})();
