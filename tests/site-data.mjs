// サイトのページ構成データ。テスト全体でここだけを参照する。
// 話を追加したら、UNITS に1行足すだけで全テストに行き渡る。

export const SITE_TITLE = 'なんか よくわからんけど こわい ビットコイン';

// GitHub Pages のプロジェクトパス（本番と同じパスでローカル配信して検証する）
export const BASE_PATH = '/nanka-kowai-bitcoin/';

// 全23話。配列の並びがそのまま話数（1〜23）と前後ナビの順序になる。
// smoke: その話の図解への最小の操作ステップと、変化を観測する要素。
//   steps の要素:
//     { click: 'selector' }        その要素をクリック
//     { clickFirst: 'selector' }   最初にマッチした要素をクリック（JS生成ボタン用）
//     { range: 'selector', to }    range入力を動かす。to は数値か 'toggle'（今と反対側の端）
//     { hold: 'selector', ms }     ms ミリ秒押しっぱなしにする
//   watch: 操作の前後で innerHTML を比べる要素のセレクタ
export const UNITS = [
  { slug: 'scam', smoke: { steps: [{ click: '#swapBtn' }], watch: '#swapCaption' } },
  { slug: 'ceo', smoke: { steps: [{ clickFirst: '#hlBtns button' }], watch: '#hlFeed' } },
  { slug: 'price', smoke: { steps: [{ click: '#buyBtn' }], watch: '#dealMsg' } },
  {
    slug: 'fee',
    smoke: {
      steps: [{ range: '#amtRange', to: 'toggle' }, { click: '#sendBtn' }],
      watch: '#rMsg',
    },
  },
  { slug: 'satoshi', smoke: { steps: [{ range: '#yenRange', to: 'toggle' }], watch: '#satNum' } },
  { slug: 'hack', smoke: { steps: [{ click: '#hkEdit' }], watch: '#hkMineVal' } },
  { slug: 'crime', smoke: { steps: [{ click: '#traceBtn' }], watch: '#traceCard' } },
  { slug: 'energy', smoke: { steps: [{ click: '#mineBtn' }], watch: '#mineTry' } },
  { slug: 'ban', smoke: { steps: [{ clickFirst: '#banBtns button' }], watch: '#banLog' } },
  { slug: 'quantum', smoke: { steps: [{ hold: '#bfBtn', ms: 800 }], watch: '#bfCount' } },
  { slug: '51', smoke: { steps: [{ range: '#hpRange', to: 65 }], watch: '#hpPct' } },
  { slug: 'ai', smoke: { steps: [{ range: '#powRange', to: 'toggle' }], watch: '#powPct' } },
  { slug: 'reward', smoke: { steps: [{ click: '#rwNext' }], watch: '#rwYear' } },
  {
    slug: 'limit',
    smoke: {
      steps: [{ clickFirst: '#capBtns button' }, { click: '#capGo' }],
      watch: '#capTally',
    },
  },
  { slug: 'infinite', smoke: { steps: [{ click: '#dvX10' }], watch: '#dvN' } },
  { slug: 'tulip', smoke: { steps: [{ click: '#gmNext' }], watch: '#gmYear' } },
  { slug: 'value', smoke: { steps: [{ range: '#slWant', to: 'toggle' }], watch: '#meterNum' } },
  { slug: 'money', smoke: { steps: [{ click: '#btnAsk' }], watch: '#pMsg' } },
  {
    slug: 'freedom',
    smoke: {
      steps: [{ clickFirst: '#sysPick button' }, { click: '#btnDay' }],
      watch: '#evList',
    },
  },
  { slug: 'fair', smoke: { steps: [{ clickFirst: '#yearPick button' }], watch: '#simVal' } },
  {
    slug: 'death',
    smoke: {
      steps: [{ clickFirst: '#wayPick button' }, { click: '#btnTime' }],
      watch: '#storyList',
    },
  },
  { slug: 'future', smoke: { steps: [{ clickFirst: '#sceneBtns button' }], watch: '#sceneArea' } },
  {
    slug: 'nation',
    smoke: {
      steps: [{ clickFirst: '#issuerPick button' }, { click: '#btnYear' }],
      watch: '#yearList',
    },
  },
];

// ブラウザで開く全ページ（トップ＋404＋全23話）
export const PAGES = [
  { name: 'トップ', path: '' },
  { name: '404', path: '404.html' },
  ...UNITS.map((u) => ({ name: u.slug, path: `${u.slug}/` })),
];
