import { ARTICLES } from '../src/lib/site.js';
export { BASE_PATH, SITE_TITLE } from '../src/lib/site.js';

// smoke: その話の図解への最小の操作ステップと、変化を観測する要素。
//   steps の要素:
//     { click: 'selector' }        その要素をクリック
//     { clickFirst: 'selector' }   最初にマッチした要素をクリック（JS生成ボタン用）
//     { range: 'selector', to }    range入力を動かす。to は数値か 'toggle'（今と反対側の端）
//     { hold: 'selector', ms }     ms ミリ秒押しっぱなしにする
//   watch: 操作の前後で innerHTML を比べる要素のセレクタ
const smokeTests = {
  scam: { steps: [{ click: '#swapBtn' }], watch: '#swapCaption' },
  ceo: { steps: [{ clickFirst: '#hlBtns button' }], watch: '#hlFeed' },
  price: { steps: [{ click: '#buyBtn' }], watch: '#dealMsg' },
  fee: {
    steps: [{ range: '#amtRange', to: 'toggle' }, { click: '#sendBtn' }],
    watch: '#rMsg',
  },
  satoshi: { steps: [{ range: '#yenRange', to: 'toggle' }], watch: '#satNum' },
  hack: { steps: [{ click: '#hkEdit' }], watch: '#hkMineVal' },
  crime: { steps: [{ click: '#traceBtn' }], watch: '#traceCard' },
  energy: { steps: [{ click: '#mineBtn' }], watch: '#mineTry' },
  ban: { steps: [{ clickFirst: '#banBtns button' }], watch: '#banLog' },
  quantum: { steps: [{ hold: '#bfBtn', ms: 800 }], watch: '#bfCount' },
  '51': { steps: [{ range: '#hpRange', to: 65 }], watch: '#hpPct' },
  ai: { steps: [{ range: '#powRange', to: 'toggle' }], watch: '#powPct' },
  reward: { steps: [{ click: '#rwNext' }], watch: '#rwYear' },
  limit: {
    steps: [{ clickFirst: '#capBtns button' }, { click: '#capGo' }],
    watch: '#capTally',
  },
  infinite: { steps: [{ range: '#dvS', to: 125 }], watch: '#dvN' },
  tulip: { steps: [{ click: '#gmNext' }], watch: '#gmYear' },
  value: { steps: [{ range: '#slWant', to: 'toggle' }], watch: '#meterNum' },
  money: { steps: [{ click: '[data-trader="baker"]' }], watch: '#pMsg' },
  freedom: {
    steps: [{ clickFirst: '#sysPick button' }, { click: '#btnDay' }],
    watch: '#evList',
  },
  fair: { steps: [{ clickFirst: '#yearPick button' }], watch: '#simVal' },
  death: {
    steps: [{ clickFirst: '#wayPick button' }, { click: '#btnTime' }],
    watch: '#storyList',
  },
  future: { steps: [{ range: '#yearRange', to: 'toggle' }], watch: '#cupsYen' },
  nation: { steps: [{ click: '#eraNext' }], watch: '#eraPanels' },
};

export const UNITS = ARTICLES.map(({ slug }) => ({ slug, smoke: smokeTests[slug] }));

// ブラウザで開く全ページ（トップ＋404＋全23話）
export const PAGES = [
  { name: 'トップ', path: '' },
  { name: '404', path: '404.html' },
  ...UNITS.map((u) => ({ name: u.slug, path: `${u.slug}/` })),
];
