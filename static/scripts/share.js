(() => {
  const share = document.querySelector('.share');
  const { title, titleEn, url, urlEn } = share.dataset;
  const shareButton = share.querySelector('.share-main');

  function shareData() {
    return window.LANG === 'en'
      ? { title: titleEn, url: urlEn }
      : { title, url };
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

  // 端末の共有機能（Web Share）があるときだけ共有ボタンを出す。
  // ないデスクトップでは、テキストをコピーするボタンだけを残す。
  if (navigator.share) {
    shareButton.addEventListener('click', () => navigator.share(shareData()).catch(() => {}));
  } else {
    shareButton.hidden = true;
  }

  const textNote = share.querySelector('.text-note');
  share.querySelector('.share-copytext').addEventListener('click', () => {
    const data = shareData();
    copy([data.title, data.url].join('\n'), textNote);
  });
})();
