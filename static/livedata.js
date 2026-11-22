/* 実データ取得の共通モジュール（/fee/ /price/ /satoshi/ などが共用）
 * - 各系統はページ内で1回だけ取得し、結果を共有する。
 * - 価格だけを使うページは loadPrices() で価格のみ取得する。
 * - 2系統を独立に取得し、それぞれ主系→副系の順に試す：
 *     手数料レート（sat/vB）: mempool.space fees/recommended → Blockstream fee-estimates
 *     BTC価格（JPY・USD）   : mempool.space prices          → CoinGecko simple/price
 * - 各取得は5秒タイムアウト。系統ごとに全部失敗したらその系統は null。
 *   両系統とも失敗したら load() は null を返し、各ページは従来の静的表示・
 *   目安計算にフォールバックする（ページは壊れない）。
 * - load() の戻り値: { tiers: {fastest, halfHour, hour} | null,
 *                      rateSource: 'mempool.space' | 'blockstream.info' | null,
 *                      jpy: number | null, usd: number | null,
 *                      priceSource: 'mempool.space' | 'CoinGecko' | null } | null
 */
window.LiveData = (function () {
  var VB = 140; /* 普通の送金1回の大きさの目安（vB） */
  let ratesRequest;
  let pricesRequest;
  let combinedRequest;

  async function fetchJson(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error('http ' + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }
  function num(v) { return (typeof v === 'number' && isFinite(v) && v > 0) ? v : null; }
  function pick(f, keys) {
    for (var i = 0; i < keys.length; i++) { var v = num(f[keys[i]]); if (v) return v; }
    return null;
  }
  function tiers3(fastest, half, hour) {
    if (!fastest && !half && !hour) return null;
    fastest = fastest || half || hour;
    half = half || hour || fastest;
    hour = hour || half || fastest;
    return { fastest: fastest, halfHour: half, hour: hour };
  }

  /* --- 手数料レート --- */
  function ratesFromMempool() {
    return fetchJson('https://mempool.space/api/v1/fees/recommended').then(function (f) {
      f = f || {};
      var tiers = tiers3(num(f.fastestFee), num(f.halfHourFee), num(f.hourFee));
      if (!tiers) throw new Error('bad data');
      return { tiers: tiers, source: 'mempool.space' };
    });
  }
  function ratesFromBackup() {
    return fetchJson('https://blockstream.info/api/fee-estimates').then(function (f) {
      f = f || {};
      /* Blockstream は確認目標（ブロック数）→ sat/vB。1≒次ブロック、3≒30分、6≒1時間 */
      var tiers = tiers3(pick(f, ['1', '2', '3']), pick(f, ['3', '2', '4', '6', '5', '1']), pick(f, ['6', '5', '4', '3', '2', '1']));
      if (!tiers) throw new Error('bad data');
      return { tiers: tiers, source: 'blockstream.info' };
    });
  }
  function loadRates() {
    ratesRequest ??= ratesFromMempool().catch(ratesFromBackup).catch(() => null);
    return ratesRequest;
  }

  /* --- BTC価格（JPY・USD） --- */
  function pricesFromMempool() {
    return fetchJson('https://mempool.space/api/v1/prices').then(function (p) {
      p = p || {};
      var jpy = num(p.JPY), usd = num(p.USD);
      if (!jpy && !usd) throw new Error('bad data');
      return { jpy: jpy, usd: usd, source: 'mempool.space' };
    });
  }
  function pricesFromBackup() {
    return fetchJson('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=jpy,usd').then(function (p) {
      p = (p && p.bitcoin) || {};
      var jpy = num(p.jpy), usd = num(p.usd);
      if (!jpy && !usd) throw new Error('bad data');
      return { jpy: jpy, usd: usd, source: 'CoinGecko' };
    });
  }
  function loadPrices() {
    pricesRequest ??= pricesFromMempool().catch(pricesFromBackup).catch(() => null);
    return pricesRequest;
  }

  function load() {
    combinedRequest ??= Promise.all([loadRates(), loadPrices()]).then(([rates, prices]) => {
      if (!rates && !prices) return null;
      return {
        tiers: rates?.tiers ?? null,
        rateSource: rates?.source ?? null,
        jpy: prices?.jpy ?? null,
        usd: prices?.usd ?? null,
        priceSource: prices?.source ?? null
      };
    });
    return combinedRequest;
  }

  return { load, loadPrices, VB };
})();
