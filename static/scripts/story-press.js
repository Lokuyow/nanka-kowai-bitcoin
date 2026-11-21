(() => {
  const stories = document.getElementById('stories');
  if (!stories) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  let animation;

  function clearFeedback() {
    cancelAnimationFrame(frame);
    animation?.cancel();
  }

  stories.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || reducedMotion.matches ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const card = event.target.closest('a.unit');
    if (!card?.animate) return;

    // Leave link activation to the browser. Paint feedback only if the old page is still visible.
    clearFeedback();
    frame = requestAnimationFrame(() => {
      animation = card.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(.98)', offset: .35 },
        { transform: 'scale(1)' }
      ], { duration: 180, easing: 'ease-out' });
    });
  }, { passive: true });

  window.addEventListener('pagehide', clearFeedback);
})();
