<script>
  import { BASE_PATH } from './site.js';
</script>

<header class="site-header">
  <a class="skip-link" href="#main-content" data-i18n>本文へ移動</a>
  <a class="brand" href={BASE_PATH}><img class="brand-icon" src={BASE_PATH + 'brand-mark.svg'} alt="" width="46" height="46" /><b data-i18n-html>なんか よくわからんけど<br>こわい ビットコイン</b></a>
  <span class="head-right">
    <button class="theme-toggle" type="button" aria-label="テーマ：端末に合わせる（次はライト）" aria-pressed="false"><svg class="ic-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><svg class="ic-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M19.8 4.2l-1.6 1.6M5.8 18.2l-1.6 1.6"/></svg><svg class="ic-sys" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none"/></svg></button>
    <button class="lang-toggle" type="button" aria-label="英語に切り替える" aria-pressed="false"><span class="lg-ja">日本語</span><span class="lg-en">EN</span></button>
  </span>
</header>
