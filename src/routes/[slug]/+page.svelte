<script>
  import ArticleNav from '../../lib/ArticleNav.svelte';
  import Bridge from '../../lib/Bridge.svelte';
  import LayerLabel from '../../lib/LayerLabel.svelte';
  import PageHead from '../../lib/PageHead.svelte';
  import Share from '../../lib/Share.svelte';
  import SiteHeader from '../../lib/SiteHeader.svelte';
  import { ARTICLES, BASE_PATH, LAYERS, SITE_URL, articlePath } from '../../lib/site.js';

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
  <SiteHeader />
  <main id="main-content" tabindex="-1">
    <article class="chapter">
      <a class="eyebrow" href={BASE_PATH + '#layer-' + article.layer}>
        <span aria-hidden="true">←</span>
        <LayerLabel layer={LAYERS[article.layer - 1]} />
      </a>
      <!-- 見出しと本文の HTML はリポジトリ内の原稿から読み込む。 -->
      <h1 data-i18n-html>{@html article.heading}</h1>
      {@html data.body}
    </article>
    {#if data.next}
      <a class="read-next" href={articlePath(data.next.slug)}>
        <span>
          <small data-i18n>次の話</small>
          <strong data-i18n>{data.next.title}</strong>
        </span>
        <span aria-hidden="true">→</span>
      </a>
    {:else}
      <a class="read-next" href={BASE_PATH + '#stories'}>
        <strong data-i18n>全話一覧に戻る</strong>
        <span aria-hidden="true">↑</span>
      </a>
    {/if}
  </main>
  <footer>
    <Share {...article} label={article.openQuestion ? 'この問いをシェアする' : 'この答えをシェアする'} {url} />
    <Bridge />
  </footer>
</div>
<ArticleNav previous={data.previous} next={data.next} {article} total={ARTICLES.length} />
