/* トップの各層は最初の3話だけ見せ、残りは「もっと見る」（details）にしまっている。
   記事の「全話一覧に戻る」などで、しまってある話（#story-xxx）を指して開いたときは、
   その層を開いてから、その話の位置へ移す。 */
(() => {
  function reveal() {
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    if (!id) return;
    const target = document.getElementById(id);
    const more = target && target.closest('details.story-more');
    if (!more || more.open) return;
    more.open = true;
    target.scrollIntoView({ block: 'center' });
  }
  reveal();
  window.addEventListener('hashchange', reveal);
})();
