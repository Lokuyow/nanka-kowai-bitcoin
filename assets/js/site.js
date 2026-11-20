(function () {
  'use strict';

  const share = document.querySelector('.share');
  if (share) bindShare(share);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/nanka-kowai-bitcoin/sw.js').catch(() => {});
    });
  }

  function bindShare(section) {
    const url = document.querySelector('link[rel="canonical"]').href;
    const title = document.querySelector('meta[property="og:title"]').content;
    const text = document.querySelector('meta[property="og:description"]').content;
    const main = section.querySelector('.share-main');
    const alternatives = section.querySelector('.share-alt');
    const link = section.querySelector('.share-x');
    const linkNote = section.querySelector('.share-note');
    const textNote = section.querySelector('.text-note');

    function shareData() {
      if (window.LANG === 'en') {
        return { title: section.dataset.shareTitleEn, text: section.dataset.shareTextEn, url };
      }
      return { title, text, url };
    }

    function syncLink() {
      link.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareData().title)
        + '&url=' + encodeURIComponent(url);
    }

    syncLink();
    document.addEventListener('langchange', syncLink);
    if (navigator.share) {
      main.addEventListener('click', () => {
        navigator.share(shareData()).catch(() => {});
      });
    } else {
      alternatives.hidden = false;
      main.addEventListener('click', () => { alternatives.hidden = !alternatives.hidden; });
    }

    section.querySelector('.share-copy').addEventListener('click', () => copy(url, linkNote));
    section.querySelector('.share-copytext').addEventListener('click', () => {
      const data = shareData();
      copy(`${data.title}\n${data.text}\n${data.url}`, textNote);
    });
  }

  async function copy(value, note) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement('textarea');
      field.value = value;
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand('copy');
      } catch {}
      field.remove();
    }
    note.hidden = false;
    setTimeout(() => { note.hidden = true; }, 2500);
  }
})();
