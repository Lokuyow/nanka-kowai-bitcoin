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

  const dictionaryUrl = document.currentScript.dataset.dictionary;
  const button = document.querySelector('.lang-toggle');
  let dictionaryRequest;

  function loadDictionary() {
    dictionaryRequest ??= import(dictionaryUrl).then((module) => module.default).catch(() => {
      dictionaryRequest = undefined;
      return null;
    });
    return dictionaryRequest;
  }

  // 英語で開くときは、他のスクリプトの初期化と並行して辞書を取得する。
  const initialDictionary = window.LANG === 'en' ? loadDictionary() : null;

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  var items = [];
  var titleItem = null;
  var descItem = null;

  function collect() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      items.push({ el: el, kind: 'text', key: norm(el.textContent), orig: el.textContent, en: el.getAttribute('data-i18n-en') });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-html]'), function (el) {
      var html = el.innerHTML;
      // SvelteKit が挿入するコメントは、辞書に登録した原文に含めない。
      items.push({ el: el, kind: 'html', key: norm(html.replace(/<!--[\s\S]*?-->/g, '')), orig: html });
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

  // 英語版（/en/）は <title> などが最初から英語なので、日本語は辞書を逆に引いて戻す。
  let englishDictionary = null;
  const KANA = /[\u3040-\u30ff]/;
  function text(l, item) {
    if (l === 'en') return englishDictionary?.[item.key] ?? item.orig;
    if (!englishDictionary || KANA.test(item.orig)) return item.orig;
    return Object.keys(englishDictionary).find((key) => englishDictionary[key] === item.orig) ?? item.orig;
  }

  // アドレスバーの URL を表示中の言語のページに合わせ、そのままコピーしても同じ言語で開けるようにする。
  function syncUrl(l) {
    const alternate = document.querySelector('link[rel="alternate"][hreflang="' + l + '"]');
    if (!alternate) return;
    const { pathname } = new URL(alternate.href);
    if (pathname !== location.pathname) {
      history.replaceState(history.state, '', pathname + location.search + location.hash);
    }
  }

  function syncToggle() {
    button?.setAttribute('aria-label', window.LANG === 'en' ? 'Switch to Japanese' : '英語に切り替える');
    button?.setAttribute('aria-pressed', String(window.LANG === 'en'));
  }

  function apply(l, dictionary) {
    window.LANG = l;
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'en' ? 'en' : 'ja');
    items.forEach(function (it) {
      if (l === 'en') {
        var en = it.en ?? dictionary[it.key];
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
    if (dictionary) englishDictionary = dictionary;
    if (titleItem) document.title = text(l, titleItem);
    if (descItem) descItem.el.setAttribute('content', text(l, descItem));
    syncUrl(l);
    syncToggle();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: l } }));
  }

  function init() {
    collect();

    async function applyEnglish(request) {
      button?.setAttribute('aria-busy', 'true');
      const dictionary = await request;
      if (dictionary) apply('en', dictionary);
      else if (window.LANG === 'en') apply('ja');
      button?.removeAttribute('aria-busy');
      return Boolean(dictionary);
    }

    button?.addEventListener('click', async () => {
      if (button.hasAttribute('aria-busy')) return;
      const next = window.LANG === 'en' ? 'ja' : 'en';
      if (next === 'ja') apply('ja');
      else if (!await applyEnglish(loadDictionary())) return;
      try { localStorage.setItem('lang', next); } catch {}
    });
    syncToggle();
    if (initialDictionary) void applyEnglish(initialDictionary);
  }
  document.addEventListener('DOMContentLoaded', init, { once: true });
})();
