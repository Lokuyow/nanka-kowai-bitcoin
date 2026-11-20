(() => {
  const share = document.querySelector('.share');
  const { title, text, titleEn, textEn, url } = share.dataset;
  const shareButton = share.querySelector('.share-main');
  const alternatives = share.querySelector('.share-alt');
  const x = share.querySelector('.share-x');

  function shareData() {
    return window.LANG === 'en'
      ? { title: titleEn, text: textEn, url }
      : { title, text, url };
  }

  function syncX() {
    x.href = 'https://twitter.com/intent/tweet?text=' +
      encodeURIComponent(shareData().title) + '&url=' + encodeURIComponent(url);
  }

  async function copy(value, note) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement('textarea');
      input.value = value;
      document.body.append(input);
      input.select();
      try {
        document.execCommand('copy');
      } catch {
        // Clipboard access can be unavailable in some browsers.
      } finally {
        input.remove();
      }
    }
    note.hidden = false;
    setTimeout(() => { note.hidden = true; }, 2500);
  }

  syncX();
  document.addEventListener('langchange', syncX);

  if (navigator.share) {
    shareButton.addEventListener('click', () => navigator.share(shareData()).catch(() => {}));
  } else {
    alternatives.hidden = false;
    shareButton.addEventListener('click', () => { alternatives.hidden = !alternatives.hidden; });
  }

  const linkNote = share.querySelector('.share-note:not(.text-note)');
  const textNote = share.querySelector('.text-note');
  share.querySelector('.share-copy').addEventListener('click', () => copy(url, linkNote));
  share.querySelector('.share-copytext').addEventListener('click', () => {
    const data = shareData();
    copy([data.title, data.text, data.url].join('\n'), textNote);
  });
})();
