(() => {
  const selector = 'input[type="range"]';

  function updateRangeFill(range) {
    const min = Number(range.min || 0);
    const max = Number(range.max || 100);
    const percent = max > min ? (range.valueAsNumber - min) / (max - min) * 100 : 0;
    range.style.setProperty('--range-progress', percent + '%');
  }

  function updateAll() {
    document.querySelectorAll(selector).forEach(updateRangeFill);
  }

  // Scripts that change a slider's value directly do not fire an input event.
  window.updateRangeFill = updateRangeFill;
  document.addEventListener('input', ({ target }) => {
    if (target instanceof HTMLInputElement && target.type === 'range') updateRangeFill(target);
  });
  document.addEventListener('DOMContentLoaded', updateAll);
  window.addEventListener('pageshow', updateAll);
})();
