/* i18n: 日本語 / English その場切り替え（さわってわかるビットコインと同じ方式）
   - 静的テキスト: data-i18n（テキストのみの要素）/ data-i18n-html（HTML を含む要素）/ data-i18n-label（aria-label・alt）
     辞書キーは原文文字列（空白を正規化したもの）。英語が無いキーは日本語のまま残る。
   - 動的テキスト: L('日本語', 'English') を JS から使う。
   - 日本語への復帰は、読み込み時に保存した原文スナップショットで担保する（辞書に依存しない）。
   - 言語の初期値は head 内の先行スクリプトが html[data-lang] に決める（保存値 > ブラウザ言語）。
   - 切り替えると document に 'langchange' イベントが飛ぶ。各ページのスクリプトは動的表示を描き直すのに使う。 */
(function () {
  'use strict';
  var root = document.documentElement;
  window.LANG = root.getAttribute('data-lang') === 'en' ? 'en' : 'ja';
  window.L = function (ja, en) {
    return (window.LANG === 'en' && en !== undefined && en !== null) ? en : ja;
  };

  var EN = {
    /* ===== 共通（ヘッダー・ナビ・共有・層名） ===== */
    'なんか よくわからんけど<br>こわい ビットコイン': "I don't really get it,<br>but it's scary: Bitcoin",
    '<span>第1層</span>名前だけは知ってる': "<span>Layer 1</span>I've only heard the name",
    '<span>第2層</span>ニュースで見たよ': '<span>Layer 2</span>I saw it on the news',
    '<span>第3層</span>ちょっと詳しいよ': '<span>Layer 3</span>I know a thing or two',
    '<span>第4層</span>そもそもお金って何？': '<span>Layer 4</span>Wait — what even is money?',
    'なぜそう見えるか': 'Why it looks that way',
    '一言まとめ': 'In short',
    'この答えをシェアする': 'Share this answer',
    'このサイトをシェアする': 'Share this site',
    'Xでポストする': 'Post on X',
    'リンクをコピー': 'Copy link',
    'リンクをコピーしました': 'Link copied',
    '一覧へ': 'All stories',
    '全23話': '23 stories',
    '内側の仕組みを知りたくなったら →': 'Want to see how it works on the inside? →',
    'さわってわかるビットコイン': 'Sawatte Wakaru Bitcoin — Touch & Learn',

    /* ===== トップページ ===== */
    'トップ：なんか よくわからんけど こわい ビットコイン': "Home | I don't really get it, but it's scary: Bitcoin",
    'ニュースで見たイメージと、ほんとの姿。なんとなくの「こわい」を誤解ひとつずつほどいていく。': "The image from the news, and what it really looks like. Untangling the vague 'scary' around Bitcoin, one misunderstanding at a time.",
    'なんか': "I don't really get it,",
    'よくわからんけど': 'but somehow',
    'こわい': "it's scary:",
    'ビットコイン': 'Bitcoin',
    'ニュースで見たイメージと、ほんとの姿。': 'The image from the news — and what it really looks like.',
    'なぜこわく見えるのか': 'Why does it look so scary?',
    '見出しだけで接していると、目に入るのは事件と暴落の話ばかり。「わからない」ものは「こわい」ものに見える。ここではその誤解をひとつずつ図でほどいていく。': "When headlines are all you see, all you hear about are crimes and crashes. Things we don't understand tend to look scary. Here, we untangle those misunderstandings one by one, with pictures.",
    '価格とニュースの見出ししか見ていない段階の思い込み': 'Ideas formed from nothing but prices and news headlines',
    '事件報道でイメージが固まった思い込み': 'Ideas set in stone by crime reporting',
    '仕組みを半分知っている人の思い込み': 'Ideas from half-knowing how it works',
    '答えのない問い。考え始めると、お金そのものの話になる': 'Questions with no single answer. Follow them, and you end up asking what money itself is',
    '読み終わったら': 'The takeaway',
    '「こわい」の正体はたいてい「わからなさ」だった': 'Most of the "scary" was really just "unknown"',
    /* トップのカード（第1〜2層分は各ページの h1・答えと一致） */
    '結局ビットコインって詐欺なんじゃないの？': 'So Bitcoin is basically a scam, right?',
    '悪いのはビットコインを使った手口': "What's bad is the trick played using Bitcoin",
    'ビットコインってどこの会社がやってるの？': 'So which company runs Bitcoin?',
    '会社も社長も存在しない': 'There is no company, and no CEO',
    'ビットコインの値段って誰かが決めてるんでしょ？': "Someone sets Bitcoin's price, right?",
    '買いたい人と売りたい人のぶつかり合い': 'It emerges where buyers and sellers meet',
    'ビットコインの送金手数料って高いよね？': "Bitcoin's transfer fees are expensive, right?",
    '高いのは取引所の料金設定': "What's expensive is the exchange's own pricing",
    '1ビットコインって何百万円もするんでしょ？ 買えないよ': "One bitcoin costs millions of yen — I can't afford that",
    'ピザと同じで、一切れから買える': 'Like pizza, you can buy it by the slice',
    'ビットコインってハッキングされて盗まれたんでしょ？': 'Bitcoin got hacked and stolen, right?',
    '壊れたのは取引所の金庫の方': "What got broken into was the exchange's vault",
    'ビットコインって匿名で犯罪に使われるんでしょ？': 'Bitcoin is anonymous and used for crime, right?',
    '匿名ではなく仮名。全部公開で残る': 'Not anonymous — pseudonymous. Everything stays public',
    'ビットコインって電気の無駄遣いでしょ？': 'Bitcoin wastes electricity, right?',
    '電力は不正を防ぐ「壁」のコスト': 'Electricity is the cost of the wall that stops cheating',
    '国が禁止したら、ビットコインは終わりでしょ？': 'If a government bans it, Bitcoin is finished, right?',
    '一国では止められない': "One country can't stop it",
    /* トップのカード（第3〜4層: 次工程でページ側にも展開） */
    '量子コンピューターができたら、ビットコインは終わりでしょ？': 'Once quantum computers arrive, Bitcoin is done for, right?',
    '脅威はずっと先。備える時間がある': "The threat is far off — there's time to prepare",
    '51%攻撃されたら、ビットコインは終わりなんでしょ？': 'A 51% attack would finish Bitcoin, right?',
    'できることは限られ、やる意味もない': "There's little an attacker can do — and no point doing it",
    'AIに全部持っていかれたら、ビットコインは掘れなくなるんじゃないの？': "If AI takes all the computing power, Bitcoin can't be mined, right?",
    '道具が違う。難易度の自己調整もある': 'Different tools — and difficulty adjusts itself',
    '報酬がなくなったら、ビットコインは終わるんでしょ？': 'When the mining reward runs out, Bitcoin ends, right?',
    '収入は報酬と手数料の2本立て': 'Miners earn from two sources: rewards and fees',
    '発行上限ってその気になれば変えられるんでしょ？': 'The supply cap can just be changed, right?',
    '変えても誰もついてこない': 'Change it, and nobody would follow',
    '小さく割れるなら、上限なんてないじゃん？': "If it can be split forever, there's no real limit, right?",
    '割っても総量は同じ': "Splitting doesn't change the total",
    'チューリップバブルと同じで、弾けるんでしょ？': "It's like the tulip bubble — it'll pop, right?",
    '何度も戻ってきた17年': '17 years of coming back, again and again',
    '裏付けがないビットコインは価値ゼロでしょ？': 'With nothing backing it, Bitcoin is worth zero, right?',
    '円も金も裏付けはない': 'The yen and gold have no backing either',
    'お金ってそもそも何？': 'Wait — what even is money?',
    'なぜ紙や数字で物が買えるのか': 'Why can paper and numbers buy things?',
    '管理する人がいないお金は自由？ それともこわい？': 'Money with no one in charge: freedom, or scary?',
    '止められない自由と、助けのない自己責任': 'Freedom no one can stop — and no one to rescue you',
    '早く持った人が得をするのは、ずるくない？': "Isn't it unfair that early holders win?",
    '先に持った人の得は、不公平か': "Is the early bird's gain really unfair?",
    '自分が死んだら、ビットコインはどうなる？': 'What happens to my bitcoin when I die?',
    '鍵を残せるかどうかで変わる': 'It depends on whether you leave the key behind',
    'ビットコインが当たり前になったら、社会はどう変わる？': 'What changes if Bitcoin becomes normal?',
    '送金も貯金も、意味が変わる': 'Sending money and saving would mean something new',
    '国が作らないお金ってありなの？': 'Can money exist without a government making it?',
    '昔は国以外もお金を作っていた': 'Long ago, non-governments made money too'
  };
  window.I18N_EN = EN;

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  var items = [];
  var titleItem = null;
  var descItem = null;
  var collected = false;

  function collect() {
    if (collected) return;
    collected = true;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      items.push({ el: el, kind: 'text', key: norm(el.textContent), orig: el.textContent });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-html]'), function (el) {
      items.push({ el: el, kind: 'html', key: norm(el.innerHTML), orig: el.innerHTML });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-label]'), function (el) {
      var attr = el.hasAttribute('aria-label') ? 'aria-label' : (el.hasAttribute('alt') ? 'alt' : null);
      if (!attr) return;
      items.push({ el: el, kind: 'attr', attr: attr, key: norm(el.getAttribute(attr) || ''), orig: el.getAttribute(attr) });
    });
    titleItem = { key: norm(document.title), orig: document.title };
    var md = document.querySelector('meta[name="description"]');
    if (md) descItem = { el: md, key: norm(md.getAttribute('content') || ''), orig: md.getAttribute('content') };
  }

  function syncToggle() {
    var btn = document.querySelector('.lang-toggle');
    if (!btn) return;
    btn.setAttribute('aria-label', window.LANG === 'en' ? 'Switch to Japanese' : '英語に切り替える');
    btn.setAttribute('aria-pressed', window.LANG === 'en' ? 'true' : 'false');
  }

  function apply(l) {
    collect();
    window.LANG = l;
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'en' ? 'en' : 'ja');
    items.forEach(function (it) {
      if (l === 'en') {
        var en = EN[it.key];
        if (en === undefined) {
          if (window.console && console.warn) console.warn('[i18n] missing translation: ' + it.key);
          return;
        }
        if (it.kind === 'text') it.el.textContent = en;
        else if (it.kind === 'html') it.el.innerHTML = en;
        else it.el.setAttribute(it.attr, en);
      } else {
        if (it.kind === 'text') it.el.textContent = it.orig;
        else if (it.kind === 'html') it.el.innerHTML = it.orig;
        else it.el.setAttribute(it.attr, it.orig);
      }
    });
    if (titleItem) document.title = l === 'en' ? (EN[titleItem.key] !== undefined ? EN[titleItem.key] : titleItem.orig) : titleItem.orig;
    if (descItem) descItem.el.setAttribute('content', l === 'en' ? (EN[descItem.key] !== undefined ? EN[descItem.key] : descItem.orig) : descItem.orig);
    syncToggle();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: l } }));
  }

  function bind() {
    var btn = document.querySelector('.lang-toggle');
    if (btn && !btn._i18nBound) {
      btn._i18nBound = true;
      btn.addEventListener('click', function () {
        var next = window.LANG === 'en' ? 'ja' : 'en';
        try { localStorage.setItem('lang', next); } catch (e) {}
        apply(next);
      });
    }
    syncToggle();
  }

  function init() {
    collect();
    bind();
    if (window.LANG === 'en') apply('en');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.setLang = apply;
})();
