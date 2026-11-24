<script>
  let { label, title, description, shareEn, url, urlEn, lang = 'ja' } = $props();
</script>

<div class="share" data-title={title} data-text={description} data-title-en={shareEn.title} data-text-en={shareEn.text} data-url={url} data-url-en={urlEn}>
  <p class="share-title" data-i18n>{label}</p>
  <div class="share-btns"><button class="share-main share-iconbtn" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg><span data-i18n>シェア</span></button><button class="share-copytext share-iconbtn" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span data-i18n>コピー</span></button></div>
  <p class="share-note text-note" hidden data-i18n>テキストをコピーしました</p>
</div>
