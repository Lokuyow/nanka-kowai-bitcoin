import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { expect, test, vi } from 'vitest';

const source = await readFile(new URL('../static/livedata.js', import.meta.url), 'utf8');

const primaryRates = 'https://mempool.space/api/v1/fees/recommended';
const primaryPrices = 'https://mempool.space/api/v1/prices';
const backupRates = 'https://blockstream.info/api/fee-estimates';
const backupPrices =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=jpy,usd';

function setup(responses) {
  const fetch = vi.fn(async (url) => ({
    ok: responses.has(url),
    status: responses.has(url) ? 200 : 503,
    json: async () => responses.get(url),
  }));
  const window = { fetch, AbortController };
  runInNewContext(source, { window, fetch, AbortController, setTimeout, clearTimeout });
  return { ...window.LiveData, fetch };
}

test('手数料と価格を主系から取得し、同じページ内の呼び出しで結果を共有する', async () => {
  const { load, fetch } = setup(new Map([
    [primaryRates, { fastestFee: 12, halfHourFee: 8, hourFee: 4 }],
    [primaryPrices, { JPY: 12_000_000, USD: 80_000 }],
  ]));

  const pending = load();
  expect(load()).toBe(pending);
  await expect(pending).resolves.toEqual({
    tiers: { fastest: 12, halfHour: 8, hour: 4 },
    rateSource: 'mempool.space',
    jpy: 12_000_000,
    usd: 80_000,
    priceSource: 'mempool.space',
  });
  expect(load()).toBe(pending);
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([primaryRates, primaryPrices]);
});

test('主系の手数料が無効なときは手数料だけ副系に切り替える', async () => {
  const { load, fetch } = setup(new Map([
    [primaryRates, { fastestFee: '12', halfHourFee: 0, hourFee: -1 }],
    [primaryPrices, { JPY: 12_000_000, USD: 80_000 }],
    [backupRates, { 1: 14, 3: 9, 6: 5 }],
  ]));

  await expect(load()).resolves.toEqual({
    tiers: { fastest: 14, halfHour: 9, hour: 5 },
    rateSource: 'blockstream.info',
    jpy: 12_000_000,
    usd: 80_000,
    priceSource: 'mempool.space',
  });
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([primaryRates, primaryPrices, backupRates]);
});

test('手数料が両系統で取得できなくても副系から取得した価格を返す', async () => {
  const { load } = setup(new Map([
    [backupPrices, { bitcoin: { jpy: 12_000_000, usd: 80_000 } }],
  ]));

  await expect(load()).resolves.toEqual({
    tiers: null,
    rateSource: null,
    jpy: 12_000_000,
    usd: 80_000,
    priceSource: 'CoinGecko',
  });
});

test('手数料と価格が両系統で取得できなければ null を返す', async () => {
  const { load } = setup(new Map());
  await expect(load()).resolves.toBeNull();
});

test('価格だけの取得では手数料に接続せず、後から手数料を取得するときも価格を再利用する', async () => {
  const { load, loadPrices, fetch } = setup(new Map([
    [primaryRates, { fastestFee: 12, halfHourFee: 8, hourFee: 4 }],
    [primaryPrices, { JPY: 12_000_000, USD: 80_000 }],
  ]));

  const price = loadPrices();
  expect(loadPrices()).toBe(price);
  await expect(price).resolves.toEqual({ jpy: 12_000_000, usd: 80_000, source: 'mempool.space' });
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([primaryPrices]);

  await expect(load()).resolves.toMatchObject({ jpy: 12_000_000, rateSource: 'mempool.space' });
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([primaryPrices, primaryRates]);
});
