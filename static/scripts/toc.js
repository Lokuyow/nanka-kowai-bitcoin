// 左の目次が画面より長いとき、開いている話が見える位置まで目次をスクロールしておく。
(() => {
  const toc = document.querySelector('.toc');
  const current = toc?.querySelector('[aria-current="page"]');
  if (!toc || !current || toc.scrollHeight <= toc.clientHeight) return;
  toc.scrollTop = current.offsetTop - toc.clientHeight / 2 + current.offsetHeight / 2;
})();
