(() => {
  const links = '#stories a.unit, .tabbar a.tb';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  let animation;

  function clearFeedback() {
    cancelAnimationFrame(frame);
    animation?.cancel();
  }

  function clearCardFocus() {
    const focused = document.activeElement;
    if (focused?.matches('#stories a.unit')) focused.blur();
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || reducedMotion.matches ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest(links);
    if (!link?.animate) return;

    // Leave link activation to the browser. Paint feedback only if the old page is still visible.
    clearFeedback();
    frame = requestAnimationFrame(() => {
      animation = link.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(.98)', offset: .35 },
        { transform: 'scale(1)' }
      ], { duration: 180, easing: 'ease-out' });
    });
  }, { passive: true });

  window.addEventListener('pagehide', () => {
    clearFeedback();
    clearCardFocus();
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) clearCardFocus();
  });
})();
