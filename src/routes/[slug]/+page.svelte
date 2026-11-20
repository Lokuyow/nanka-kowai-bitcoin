<script>
  import ArticleNav from '../../lib/ArticleNav.svelte';
  import Bridge from '../../lib/Bridge.svelte';
  import PageHead from '../../lib/PageHead.svelte';
  import Share from '../../lib/Share.svelte';
  import SiteHeader from '../../lib/SiteHeader.svelte';
  import { ARTICLES, BASE_PATH, LAYERS, SITE_URL, layerHeading } from '../../lib/site.js';

  let { data } = $props();
  let article = $derived(data.article);
  let url = $derived(SITE_URL + article.slug + '/');
</script>

<PageHead title={article.title} description={article.description} {url} shareType="article" />

<svelte:head>
  <link rel="stylesheet" href={BASE_PATH + 'styles/content.css'} />
  <link rel="stylesheet" href={BASE_PATH + 'styles/chapter.css'} />
  <link rel="stylesheet" href={BASE_PATH + 'styles/articles/' + article.slug + '.css'} />
  {#if article.liveData}
    <script defer src={BASE_PATH + 'livedata.js'}></script>
  {/if}
  <script defer src={BASE_PATH + 'scripts/articles/' + article.slug + '.js'}></script>
  <script defer src={BASE_PATH + 'scripts/share.js'}></script>
</svelte:head>

<div class="wrap">
  <SiteHeader>
    {#snippet label()}{article.number} / {ARTICLES.length}{/snippet}
  </SiteHeader>
  <p class="eyebrow" data-i18n-html>{@html layerHeading(LAYERS[article.layer - 1])}</p>
  <h1 data-i18n-html>{@html article.heading}</h1>
  {@html data.body}
  <Share {...article} label={article.openQuestion ? 'この問いをシェアする' : 'この答えをシェアする'} {url} />
  <Bridge />
</div>
<ArticleNav previous={data.previous} next={data.next} />
