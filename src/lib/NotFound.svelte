<script>
  import { ARTICLES, BASE_PATH } from './site.js';
  import PageHead from './PageHead.svelte';
  import SiteHeader from './SiteHeader.svelte';

  const title = 'ページが見つかりません';
  const explanationEn = 'The address may have changed, or it may have been typed wrong. All ' +
    ARTICLES.length + ' stories can be read from the top page.';
</script>

<PageHead {title} description="お探しのページは見つかりませんでした。" />

<svelte:head>
  <link rel="stylesheet" href={BASE_PATH + 'styles/404.css'} />
</svelte:head>

<div class="wrap">
  <SiteHeader />
  <img class="lost" src={BASE_PATH + 'ghost-lost.svg'} alt="" width="140" height="140" aria-hidden="true" />
  <h1 data-i18n>{title}</h1>
  <p class="lede" data-i18n data-i18n-en={explanationEn}>アドレスが変わったか、入力が間違っているかもしれません。全{ARTICLES.length}話はトップページから読めます。</p>
  <a class="btn" href={BASE_PATH} data-i18n>トップへもどる</a>
</div>
