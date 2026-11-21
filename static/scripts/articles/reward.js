(function(){
  var S = document.getElementById('rwS');
  var yearEl = document.getElementById('rwYear');
  var btcEl = document.getElementById('rwBtc');
  var issuedEl = document.getElementById('rwIssued');
  var R = document.getElementById('rwR');
  var F = document.getElementById('rwF');
  var rewardPctEl = document.getElementById('rwRPct');
  var feePctEl = document.getElementById('rwFPct');
  var cap = document.getElementById('rwCap');
  var nextBtn = document.getElementById('rwNext');
  var anim = null, prevEra = 0, lastHalved = false;
  function eraOf(y){
    var e = 0;
    for (var yr = 2012; yr <= y && e < 33; yr += 4) e++;
    return e;
  }
  function rewardOf(e){ return Math.floor(5000000000 / Math.pow(2, e)) / 100000000; }
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
  function capFor(y, justHalved){
    if (y >= 2140) return L('新規発行が終わると、報酬は手数料だけになる。', 'Once issuance ends, fees make up the entire reward.');
    if (justHalved) return L('半減期。1ブロックあたりの新規発行分が減った。', 'A halving reduces the new bitcoin issued per block.');
    return L('図の手数料は一定。年を進めると、新規発行分が減っていく。', 'Fees are fixed in this example. The newly issued amount decreases over time.');
  }
  function upd(justHalved){
    lastHalved = !!justHalved;
    var y = +S.value;
    var e = eraOf(y);
    var fee = 0.25 / (rewardOf(e) + 0.25) * 100;
    var rpct = 100 - fee;
    yearEl.textContent = L(y + '年', '' + y);
    btcEl.textContent = fmtBtc(rewardOf(e));
    var ip = issuedPct(y);
    issuedEl.textContent = L(ip >= 99.95 && y < 2140 ? '99.9%以上' : ip.toFixed(1) + '%', (ip >= 99.95 && y < 2140 ? 'over 99.9%' : ip.toFixed(1) + '%'));
    R.style.width = rpct + '%';
    F.style.width = fee + '%';
    rewardPctEl.textContent = rpct > 0 && rpct < 0.1 ? L('0.1%未満', '<0.1%') : rpct.toFixed(1) + '%';
    feePctEl.textContent = fee < 100 && fee > 99.9 ? L('99.9%超', '>99.9%') : fee.toFixed(1) + '%';
    cap.textContent = capFor(y, justHalved);
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
      window.updateRangeFill?.(S);
      upd(y === target && eraOf(y) > prevEra - 1 && (y - 2012) % 4 === 0);
      if (y >= target) { clearInterval(anim); anim = null; upd(eraOf(y) >= 1 && (y - 2012) % 4 === 0); }
    }, 60);
  });
  document.addEventListener('langchange', function(){ upd(lastHalved); });
  upd(false);
})();
