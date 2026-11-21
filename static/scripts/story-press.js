(() => {
  const stories = document.getElementById('stories');
  if (!stories) return;

  let opening;
  let resetTimer;

  function reset() {
    clearTimeout(resetTimer);
    opening?.classList.remove('is-opening');
    opening = undefined;
  }

  stories.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const card = event.target.closest('a.unit');
    if (!card) return;

    reset();
    opening = card;
    opening.classList.add('is-opening');
    resetTimer = setTimeout(reset, 3000);
  });

  window.addEventListener('pageshow', reset);
})();
