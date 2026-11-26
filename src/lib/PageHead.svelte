<script>
  import { SITE_TITLE, siteUrl } from './site.js';
  import dictionary from '../../static/i18n-en.js';

  // path を渡したページだけ共有用のメタデータを出す。英語版（/en/）は OGP も英語にする。
  let { title, description, path, shareEn, lang = 'ja', shareType } = $props();
  let jaTitle = $derived(title === SITE_TITLE ? SITE_TITLE : title + '：' + SITE_TITLE);
  let en = $derived(lang === 'en');
  // <title> と description は、言語切り替えで辞書と突き合わせるので辞書の訳を使う。
  let documentTitle = $derived(en ? dictionary[jaTitle] : jaTitle);
  let isArticle = $derived(shareType === 'article');
  // 記事ページで共有される文は疑問文（タイトル）だけにする。答えの文は共有まわりに出さない。
  let metaDescription = $derived(isArticle ? (en ? dictionary[title] : title) : (en ? dictionary[description] : description));
  let url = $derived(path === undefined ? undefined : siteUrl(path, lang));
  let ogTitle = $derived(en ? shareEn.title : title);
  let ogDescription = $derived(en ? shareEn.text : description);
</script>

<svelte:head>
  <title>{documentTitle}</title>
  <meta name="description" content={metaDescription} />
  {#if url}
    <link rel="canonical" href={url} />
    <link rel="alternate" hreflang="ja" href={siteUrl(path)} />
    <link rel="alternate" hreflang="en" href={siteUrl(path, 'en')} />
    <link rel="alternate" hreflang="x-default" href={siteUrl(path)} />
    <meta property="og:type" content={shareType} />
    <meta property="og:site_name" content={en ? dictionary[SITE_TITLE] : SITE_TITLE} />
    <meta property="og:title" content={ogTitle} />
    {#if !isArticle}
      <meta property="og:description" content={ogDescription} />
    {/if}
    <meta property="og:url" content={url} />
    <meta property="og:locale" content={en ? 'en_US' : 'ja_JP'} />
    <meta property="og:locale:alternate" content={en ? 'ja_JP' : 'en_US'} />
    <meta property="og:image" content={url + 'ogp.png'} />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={ogTitle} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={ogTitle} />
    {#if !isArticle}
      <meta name="twitter:description" content={ogDescription} />
    {/if}
    <meta name="twitter:image" content={url + 'ogp.png'} />
    <meta name="twitter:image:alt" content={ogTitle} />
  {/if}
</svelte:head>
