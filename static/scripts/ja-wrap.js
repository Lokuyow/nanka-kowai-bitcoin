/* 日本語の文を、語の途中ではなく文節の切れ目で改行する。
   ブラウザの単語区切り（Intl.Segmenter）で文を語に分け、助詞・送り仮名・句読点などは前の語につなげて文節にする。
   文節の切れ目にだけ <wbr> を入れ、CSS の word-break:keep-all でそれ以外の場所では改行しないようにする。
   Chrome の word-break:auto-phrase は「送金手数｜料」のように語の中で切ることがあり、Safari は対応していないため使わない。
   さらに、行数が増えないときは句読点の後ろで改行する（表示幅ごとに実際に組んで確かめる）。
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
    let phrase = '';
    const segments = [...segmenter.segment(text)];
    segments.forEach(({ segment, index }, n) => {
      const following = segments[n + 1]?.segment ?? '';
      if (index > 0 && !(
        /^\s/.test(segment) || /\s$/.test(previous) ||
        NO_LINE_START.test(segment) || OPEN_END.test(previous) || /・$/.test(previous) ||
        (HIRAGANA_START.test(segment) && !PHRASE_END.test(previous) &&
          !(PARTICLE.test(previous) && segment.length >= 2)) ||
        // 「話し｜合う」「動かし｜続ける」のような複合動詞（連用形＋動詞）は分けない。
        // 単語区切りは「話｜し｜合｜われ」と細かく分けるので、文節の末尾と次の語のつながりで見る。
        // 後ろの動詞は「漢字1文字＋送り仮名」の形に限る（「強い｜署名」のような形容詞＋名詞は分けてよい）。
        (/[㐀-鿿][いきしちひみりぎじびえけせねめれげべ]$/.test(phrase) &&
          /^[㐀-鿿][ぁ-ゟ]*$/.test(segment) &&
          (segment.length > 1 || HIRAGANA_START.test(following))) ||
        // 「足す」を のように、閉じ括弧の直後の助詞は行頭に来ないよう前につなげる。
        (PARTICLE.test(segment) && /[」』）)】]$/.test(previous)) ||
        (KATAKANA_END.test(previous) && KATAKANA_START.test(segment)) ||
        (KANJI_END.test(previous) && KANJI_START.test(segment)) ||
        (ALNUM_END.test(previous) && UNIT.test(segment)) ||
        (!CJK.test(segment) && !CJK.test(previous))
      )) {
        indexes.push(index);
        phrase = '';
      }
      phrase += segment;
      previous = segment;
    });
    return indexes;
  }

  function wrapTextNode(node) {
    // 「サトシ・ナカモト」のような中黒の後ろはブラウザが改行してしまうので、語をつなぐ記号（U+2060）を挟む。
    if (/[ァ-ヿ]・[ァ-ヿ]/.test(node.data)) {
      node.data = node.data.replace(/([ァ-ヿ]・)(?=[ァ-ヿ])/g, '$1⁠');
    }
    const text = node.data;
    if (done.get(node) === text || !CJK.test(text)) return;
    const parent = node.parentElement;
    if (!parent || parent.closest(SKIP)) return;
    const indexes = breakIndexes(text);
    // 句読点で終わるとき、または <br> の前（狭い画面で <br> を隠す題名がある）は、そこでも改行できるようにする。
    if (text.length > 1 && (PHRASE_END.test(text) || node.nextSibling?.nodeName === 'BR')) indexes.push(text.length);
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

  function textNodesIn(target) {
    if (target.nodeType === Node.TEXT_NODE) return [target];
    if (target.nodeType !== Node.ELEMENT_NODE || target.closest(SKIP)) return [];
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  /* ---- 行数が増えないときは句読点の後ろで改行する ---- */

  // 改行してよい句読点。閉じ括弧が続くときは、その閉じ括弧の後ろで切る。
  const PUNCTUATION = /[、。！？!?」』）)]/;
  const CLOSING = /[」』）)]/;
  const SENTENCE_END = /[。！？!?]/;
  // 句読点で切った行が、幅のこの割合より短くなるときは切らない（「その後、」だけの行を作らない）。
  const MIN_FILL = 0.35;
  const blocks = new Set();
  const widths = new WeakMap();

  function blockOf(node) {
    let el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    while (el && el !== document.body && getComputedStyle(el).display === 'inline') el = el.parentElement;
    return el;
  }

  // 段落の中の文字を、入れ子の別の段落を除いて順に並べる。
  function charsOf(block) {
    const chars = [];
    for (const node of textNodesIn(block)) {
      if (node.parentElement.closest(SKIP) || blockOf(node) !== block) continue;
      for (let i = 0; i < node.length; i++) chars.push({ node, index: i, ch: node.data[i] });
    }
    return chars;
  }

  function charRect(c) {
    const range = document.createRange();
    range.setStart(c.node, c.index);
    range.setEnd(c.node, c.index + 1);
    const rect = range.getClientRects()[0];
    return rect && rect.width > 0 ? rect : null;
  }

  function insertBreakAfter(c) {
    const br = document.createElement('br');
    br.className = 'jw-br';
    if (c.index + 1 >= c.node.length) c.node.after(br);
    else c.node.splitText(c.index + 1).before(br);
    return br;
  }

  function fits(block, height) {
    return Math.abs(block.getBoundingClientRect().height - height) < 1 && block.scrollWidth <= block.clientWidth + 1;
  }

  function breakAtPunctuation(block) {
    block.querySelectorAll('br.jw-br').forEach((br) => br.remove());
    const width = block.clientWidth;
    widths.set(block, width);
    if (!width || root.lang !== 'ja') return;
    const height = block.getBoundingClientRect().height;
    const lineHeight = parseFloat(getComputedStyle(block).lineHeight) || 0;
    if (lineHeight && height < lineHeight * 1.5) return; // 1行なら何もしない

    const left = block.getBoundingClientRect().left + parseFloat(getComputedStyle(block).paddingLeft);
    breakPunctuation(block, width, height, left);
    if (block.matches(BALANCE)) balance(block, width, height);
  }

  function breakPunctuation(block, width, height, left) {
    let chars = charsOf(block);
    // 句読点（閉じ括弧や句点が続くならその後ろ）の位置。段落の最後は除く。
    // 「（秘密鍵）。」の「）」と「。」の間のように、次の文字が行頭に来てはいけないときは切らない。
    const candidates = [];
    chars.forEach((c, i) => {
      if (!PUNCTUATION.test(c.ch) || NO_LINE_START.test(chars[i + 1]?.ch ?? '')) return;
      if (chars.slice(i + 1).some((d) => /\S/.test(d.ch))) candidates.push(i);
    });
    if (!candidates.length) return;

    let fixedUpTo = -1;
    while (true) {
      chars = charsOf(block);
      // 文字ごとの行の上端。切った位置の次の文字が同じ行にある候補だけが、行の途中の句読点。
      const pending = [];
      for (const i of candidates) {
        if (i <= fixedUpTo) continue;
        const rect = charRect(chars[i]);
        const next = chars.slice(i + 1).find((d) => /\S/.test(d.ch) && charRect(d));
        const nextRect = next && charRect(next);
        if (!rect || !nextRect || nextRect.top - rect.top > 2) continue;
        pending.push({ i, top: rect.top, right: rect.right });
      }
      if (!pending.length) break;
      const lineTop = pending[0].top;
      // 文の終わり（。！？、またその後ろの閉じ括弧）を読点より先に試し、それぞれ行の後ろのものから試す。
      const sentenceEnd = (i) => SENTENCE_END.test(chars[i].ch) ||
        (CLOSING.test(chars[i].ch) && SENTENCE_END.test(chars[i - 1]?.ch ?? ''));
      const onLine = pending.filter((p) => Math.abs(p.top - lineTop) < 2)
        .sort((a, b) => (sentenceEnd(b.i) - sentenceEnd(a.i)) || (b.i - a.i));
      let accepted = null;
      for (const p of onLine) {
        if (p.right - left < width * MIN_FILL) continue;
        const br = insertBreakAfter(chars[p.i]);
        if (fits(block, height)) { accepted = p; break; }
        br.remove();
        chars = charsOf(block);
      }
      fixedUpTo = accepted ? accepted.i : Math.max(...onLine.map((p) => p.i));
    }
  }

  /* ---- 見出しや答えのような短い文は、最後の行だけが短くならないように行の長さをそろえる ----
     （text-wrap:balance は <wbr> と keep-all の組み合わせでは効かないため、自前でそろえる） */

  const BALANCE = 'h1,h2,h3,.answer,.summary,.unit .q,.read-next strong,.subtitle,.diagram-caption,.qfeed';

  // 文字のすぐ後ろに強制改行（<br>）があるか。<wbr> と空白は飛ばして見る。
  function forcedBreakAfter(c) {
    if (c.index < c.node.length - 1 && /\S/.test(c.node.data.slice(c.index + 1))) return false;
    for (let n = c.node.nextSibling; n; n = n.nextSibling) {
      if (n.nodeName === 'BR') return true;
      if (n.nodeName === 'WBR' || (n.nodeType === Node.TEXT_NODE && !/\S/.test(n.data))) continue;
      return false;
    }
    return c.node.parentElement !== null && c.node.parentElement !== document.body && blockOf(c.node.parentElement) === blockOf(c.node) && c.node.parentElement.nextSibling?.nodeName === 'BR';
  }

  // 文字のすぐ後ろが文節の切れ目（<wbr> の前）か。
  function phraseEnd(c) {
    return c.index === c.node.length - 1 && c.node.nextSibling?.nodeName === 'WBR';
  }

  function lines(block) {
    const result = [];
    for (const c of charsOf(block)) {
      if (!/\S/.test(c.ch)) continue;
      const rect = charRect(c);
      if (!rect) continue;
      const line = result.at(-1);
      if (line && Math.abs(rect.top - line.top) < 2) {
        line.chars.push(c);
        line.right = rect.right;
        line.rects.push(rect);
      } else {
        result.push({ top: rect.top, left: rect.left, right: rect.right, chars: [c], rects: [rect] });
      }
    }
    return result;
  }

  function balance(block, width, height) {
    for (let guard = 0; guard < 8; guard++) {
      const all = lines(block);
      let changed = false;
      for (let k = 0; k + 1 < all.length; k++) {
        const first = all[k];
        const second = all[k + 1];
        // 同じ文の中で折り返していて、次の行がそこで切れる（強制改行・段落の終わり・句読点）組だけを見る。
        // 「…使った／手口で、／ビットコイン…」のように、句読点で終わる短い行もそろえる。
        if (forcedBreakAfter(first.chars.at(-1))) continue;
        const isLast = k + 2 >= all.length || forcedBreakAfter(second.chars.at(-1)) ||
          PUNCTUATION.test(second.chars.at(-1).ch);
        if (!isLast) continue;
        const w1 = first.right - first.left;
        const w2 = second.right - second.left;
        if (w2 >= w1 * 0.5) continue;
        // 1行目の文節の切れ目のうち、2行の長さが一番近くなる位置を選ぶ。
        let best = null;
        first.chars.forEach((c, i) => {
          if (i === first.chars.length - 1 || !(phraseEnd(c) || PUNCTUATION.test(c.ch))) return;
          const a = first.rects[i].right - first.left;
          const b = (w1 - a) + w2;
          if (b > width) return;
          const score = Math.max(a, b);
          if (!best || score < best.score) best = { c, score };
        });
        if (!best || best.score >= w1) continue;
        const br = insertBreakAfter(best.c);
        if (fits(block, height)) { changed = true; break; }
        br.remove();
      }
      if (!changed) return;
    }
  }

  const resizeObserver = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      if (target.clientWidth !== widths.get(target)) schedule(target);
    }
  });

  const queued = new Set();
  let frame = 0;
  function schedule(block) {
    queued.add(block);
    if (!frame) frame = requestAnimationFrame(flush);
  }

  function flush() {
    frame = 0;
    observer.disconnect();
    for (const block of queued) if (block.isConnected) breakAtPunctuation(block);
    queued.clear();
    observer.takeRecords();
    watch();
  }

  function track(nodes) {
    for (const node of nodes) {
      if (!CJK.test(node.data) || node.parentElement?.closest(SKIP)) continue;
      const block = blockOf(node);
      if (!block || block === document.body) continue;
      if (!blocks.has(block)) {
        blocks.add(block);
        resizeObserver.observe(block);
      }
      schedule(block);
    }
  }

  /* ---- 実行 ---- */

  function process(target) {
    const nodes = textNodesIn(target);
    nodes.forEach(wrapTextNode);
    track(textNodesIn(target));
  }

  const observer = new MutationObserver((records) => {
    if (root.lang !== 'ja') return;
    observer.disconnect();
    for (const record of records) {
      if (record.type === 'characterData') process(record.target);
      else record.addedNodes.forEach(process);
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
    process(document.body);
    observer.takeRecords();
    watch();
    root.classList.add('ja-wrap');
    // 最初の表示と言語の切り替えでは、改行位置が後から動いて見えないよう、その場で組む。
    if (frame) {
      cancelAnimationFrame(frame);
      flush();
    }
  }

  // i18n.js が DOMContentLoaded で原文を読み取った後に動くよう、同じイベントの後ろに登録する。
  document.addEventListener('DOMContentLoaded', wrapAll, { once: true });
  document.addEventListener('langchange', wrapAll);
  // フォントの読み込みで文字幅が変わったら組み直す。
  document.fonts?.ready.then(() => blocks.forEach(schedule));
})();
