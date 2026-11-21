if ('serviceWorker' in navigator) {
  const workerUrl = new URL('../sw.js', document.currentScript.src);
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(workerUrl, { updateViaCache: 'none' }).catch(() => {});
  });
}
