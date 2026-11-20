(function(){
  var S = document.getElementById('rwS');
  var yearEl = document.getElementById('rwYear');
  var btcEl = document.getElementById('rwBtc');
  var issuedEl = document.getElementById('rwIssued');
  var R = document.getElementById('rwR');
  var F = document.getElementById('rwF');
  var cap = document.getElementById('rwCap');
  var nextBtn = document.getElementById('rwNext');
  var anim = null, prevEra = 0, lastHalved = false;
  function eraOf(y){
    var e = 0;
    for (var yr = 2012; yr <= y && e < 33; yr += 4) e++;
    return e;
  }
  function rewardOf(e){ return e >= 33 ? 0 : 50 / Math.pow(2, e); }
  function issuedPct(y){
    var e = eraOf(y), issued = 0;
    for (var i = 0; i < e; i++) issued += 210000 * rewardOf(i);
    var eraStart = e === 0 ? 2009 : 2008 + e * 4;
    var eraSpan = e === 0 ? 3 : 4;
    issued += Math.min(eraSpan, Math.max(0, y - eraStart)) / eraSpan * 210000 * rewardOf(e);
    return Math.min(100, issued / 21000000 * 100);
  }
  function fmtBtc(r){
    if (r === 0) return '0 BTC';
    return (r >= 1 ? r.toString() : r.toFixed(8).replace(/0+$/, '').replace(/\.$/, '')) + ' BTC';
  }
  function capFor(y, era, justHalved){
    if (justHalved) return L('半減期！ 報酬が半分になった。予定どおりの出来事で、ネットワークは何事もなく動き続ける。', 'Halving! The reward just halved. Right on schedule — and the network keeps running as if nothing happened.');
    if (y >= 2140) return L('新規発行は終了。マイナーの収入は手数料だけになる。それでも「タダ働き」ではない。', 'New issuance is over. Miner income is fees only now. Even so, it is not "working for free".');
    if (y < 2016) return L('収入はほぼ全部が「新しいコインの報酬」。手数料はまだほぼゼロ。', 'Income is almost entirely the "new coin reward". Fees are still nearly zero.');
    if (y < 2032) return L('半減期を経ても、まだ報酬が主役。手数料は細い柱。', 'Even after halvings, the reward is still the star. Fees are a thin pillar.');
    if (y < 2100) return L('半減を繰り返し、報酬は細くなっていく。使う人が増えるほど、手数料の合計は増えやすい。', 'Halving after halving, the reward keeps thinning. The more people use it, the more total fees tend to grow.');
    return L('新規発行は終わりに近い。収入の中心は、手数料へ移っていく。', 'New issuance is nearing its end. The center of income shifts to fees.');
  }
  function upd(justHalved){
    lastHalved = !!justHalved;
    var y = +S.value;
    var e = eraOf(y);
    var fee = y >= 2140 ? 100 : Math.max(1, Math.min(97, (y - 2009) / 131 * 92 + 4 + 3 * Math.sin(y * 1.7)));
    var rpct = Math.round(100 - fee);
    yearEl.textContent = L(y + '年', '' + y);
    btcEl.textContent = fmtBtc(rewardOf(e));
    var ip = issuedPct(y);
    issuedEl.textContent = L((ip >= 99.95 && y < 2140 ? '99.9%以上' : ip.toFixed(1)) + '%', (ip >= 99.95 && y < 2140 ? 'over 99.9%' : ip.toFixed(1) + '%'));
    R.style.width = rpct + '%';
    F.style.width = (100 - rpct) + '%';
    R.textContent = rpct > 12 ? L('報酬 ' + rpct + '%', 'Reward ' + rpct + '%') : '';
    F.textContent = (100 - rpct) > 12 ? L('手数料 ' + (100 - rpct) + '%', 'Fees ' + (100 - rpct) + '%') : '';
    cap.textContent = capFor(y, e, justHalved);
    var next = 2012 + e * 4;
    nextBtn.disabled = y >= 2140;
    nextBtn.textContent = L(y >= 2140 ? '2140年に到着' : '次の半減期（' + next + '年）へ進む', y >= 2140 ? 'Arrived at 2140' : 'Jump to the next halving (' + next + ')');
    prevEra = e;
  }
  S.addEventListener('input', function(){
    var e = eraOf(+S.value);
    upd(e > prevEra);
  });
  nextBtn.addEventListener('click', function(){
    if (anim) return;
    var target = Math.min(2140, 2012 + eraOf(+S.value) * 4);
    if (+S.value >= target) target = Math.min(2140, target + 4);
    anim = setInterval(function(){
      var y = +S.value + 1;
      S.value = y;
      upd(y === target && eraOf(y) > prevEra - 1 && (y - 2012) % 4 === 0);
      if (y >= target) { clearInterval(anim); anim = null; upd(eraOf(y) >= 1 && (y - 2012) % 4 === 0); }
    }, 60);
  });
  document.addEventListener('langchange', function(){ upd(lastHalved); });
  upd(false);
})();
