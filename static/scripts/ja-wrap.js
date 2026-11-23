/* 日本語の文を、語の途中ではなく文節の切れ目で改行する。
   ブラウザの単語区切り（Intl.Segmenter）で文を語に分け、助詞・送り仮名・句読点などは前の語につなげて文節にする。
   文節の切れ目にだけ <wbr> を入れ、CSS の word-break:keep-all でそれ以外の場所では改行しないようにする。
   Chrome の word-break:auto-phrase は「送金手数｜料」のように語の中で切ることがあり、Safari は対応していないため使わない。
   翻訳スクリプト（i18n.js）が原文を読み取った後に動かし、後から書き換わった文や日本語に戻したときも処理し直す。 */
(() => {
  if (!('Segmenter' in Intl)) return;
  const root = document.documentElement;
  const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
  const SKIP = 'script,style,svg,textarea,input,select,code,pre,[contenteditable]';
  const CJK = /[぀-ヿ㐀-鿿ｦ-ﾟ]/;
  const HIRAGANA_START = /^[ぁ-ゟ]/;
  // 行頭に来てはいけない文字は前につなげる。
  const NO_LINE_START = /^[ーっゃゅょぁぃぅぇぉゎッャュョァィゥェォヮ、。，．・：；？！?!,.)）」』】〕〉》｝\]}…‥〜～%％]/;
  // 開き括弧は後ろにつなげる。
  const OPEN_END = /[（(「『【〔〈《｛[{]$/;
  // 句読点や閉じ括弧の後は、ひらがなで始まっても文節を分けてよい。
  const PHRASE_END = /[、。！？!?」』）)】]$/;
  // 1文字の助詞の後ろに2文字以上のひらがなの語が続くときは、文節の切れ目とみなす（「詐欺を｜する人」）。
  // 「では」「には」のような助詞の重なりは分けない。
  const PARTICLE = /^[をにがはでともへのや]$/;
  // 単語区切りは「ビット｜コイン」「運営｜会社」のように複合語を分けることがあるので、
  // カタカナどうし・漢字どうしの間では切らない。
  const KATAKANA_END = /[ァ-ヿ]$/;
  const KATAKANA_START = /^[ァ-ヿ]/;
  const KANJI_END = /[㐀-鿿々]$/;
  const KANJI_START = /^[㐀-鿿々]/;
  const ALNUM_END = /[0-9０-９A-Za-zＡ-Ｚａ-ｚ]$/;
  const UNIT = /^[㐀-鿿々]{1,2}$/;
  const done = new WeakMap();

  function breakIndexes(text) {
    const indexes = [];
    let previous = '';
    for (const { segment, index } of segmenter.segment(text)) {
      if (index > 0 && !(
        /^\s/.test(segment) || /\s$/.test(previous) ||
        NO_LINE_START.test(segment) || OPEN_END.test(previous) || /・$/.test(previous) ||
        (HIRAGANA_START.test(segment) && !PHRASE_END.test(previous) &&
          !(PARTICLE.test(previous) && segment.length >= 2)) ||
        (KATAKANA_END.test(previous) && KATAKANA_START.test(segment)) ||
        (KANJI_END.test(previous) && KANJI_START.test(segment)) ||
        (ALNUM_END.test(previous) && UNIT.test(segment)) ||
        (!CJK.test(segment) && !CJK.test(previous))
      )) indexes.push(index);
      previous = segment;
    }
    // 句読点で終わる文字の後に別の要素が続くときも、そこで改行できるようにする。
    if (PHRASE_END.test(text) && text.length > 1) indexes.push(text.length);
    return indexes;
  }

  function wrapTextNode(node) {
    const text = node.data;
    if (done.get(node) === text || !CJK.test(text)) return;
    const parent = node.parentElement;
    if (!parent || parent.closest(SKIP)) return;
    const indexes = breakIndexes(text);
    if (indexes.at(-1) === text.length && node.nextSibling?.nodeName === 'WBR') indexes.pop();
    const pieces = [node];
    for (const index of indexes.reverse()) {
      const wbr = document.createElement('wbr');
      if (index === text.length) {
        node.after(wbr);
      } else {
        const rest = node.splitText(index);
        rest.before(wbr);
        pieces.push(rest);
      }
    }
    // 分けた後の各断片は処理済みとして記録し、もう一度分けないようにする。
    pieces.forEach((piece) => done.set(piece, piece.data));
  }

  function wrapWithin(target) {
    if (target.nodeType === Node.TEXT_NODE) return wrapTextNode(target);
    if (target.nodeType !== Node.ELEMENT_NODE || target.closest(SKIP)) return;
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(wrapTextNode);
  }

  const observer = new MutationObserver((records) => {
    if (root.lang !== 'ja') return;
    observer.disconnect();
    for (const record of records) {
      if (record.type === 'characterData') wrapWithin(record.target);
      else record.addedNodes.forEach(wrapWithin);
    }
    observer.takeRecords();
    watch();
  });

  function watch() {
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
  }

  function wrapAll() {
    if (root.lang !== 'ja') return;
    observer.disconnect();
    wrapWithin(document.body);
    observer.takeRecords();
    watch();
    root.classList.add('ja-wrap');
  }

  // i18n.js が DOMContentLoaded で原文を読み取った後に動くよう、同じイベントの後ろに登録する。
  document.addEventListener('DOMContentLoaded', wrapAll, { once: true });
  document.addEventListener('langchange', wrapAll);
})();
