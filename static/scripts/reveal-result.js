(() => {
  // ボタンを押すと図解の下側に結果が足されるとき、押したボタンを見失わない範囲で
  // 足された結果が画面に収まるようにスクロールする。
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const MARGIN = 12;
  const WATCH_MS = 1200;
  let observer;
  let stopTimer;
  let scrollTimer;

  function visibleRange() {
    const header = document.querySelector('.site-header');
    const tabbar = document.querySelector('.tabbar');
    const top = header ? header.getBoundingClientRect().bottom : 0;
    const bottom = tabbar ? tabbar.getBoundingClientRect().top : window.innerHeight;
    return { top: top + MARGIN, bottom: bottom - MARGIN };
  }

  function reveal(card, anchor) {
    const range = visibleRange();
    // 押したボタンの位置は、描き換えで要素が消えても記録した値から求める。
    const anchorTop = anchor.top - (window.scrollY - anchor.scrollY);
    const delta = Math.min(card.getBoundingClientRect().bottom - range.bottom, anchorTop - range.top);
    if (delta < 4) return;
    window.scrollBy({ top: delta, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }

  function stop() {
    observer?.disconnect();
    clearTimeout(stopTimer);
    clearTimeout(scrollTimer);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('main button');
    if (!button || button.closest('.share') || !window.ResizeObserver) return;
    const card = button.closest('.card') || button.closest('section');
    if (!card) return;

    stop();
    const anchor = { top: button.getBoundingClientRect().top, scrollY: window.scrollY };
    let height = card.getBoundingClientRect().height;
    observer = new ResizeObserver(() => {
      const next = card.getBoundingClientRect().height;
      if (next <= height + 4) {
        height = next;
        return;
      }
      height = next;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => reveal(card, anchor), 120);
    });
    observer.observe(card);
    stopTimer = setTimeout(stop, WATCH_MS);
  }, true);
})();
