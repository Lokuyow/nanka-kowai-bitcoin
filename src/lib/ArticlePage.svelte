<script>
  import ArticleNav from './ArticleNav.svelte';
  import ArticleToc from './ArticleToc.svelte';
  import Bridge from './Bridge.svelte';
  import LayerLabel from './LayerLabel.svelte';
  import PageHead from './PageHead.svelte';
  import Share from './Share.svelte';
  import SiteHeader from './SiteHeader.svelte';
  import { ARTICLES, BASE_PATH, LAYERS, articlePath, siteUrl } from './site.js';

  let { data, lang = 'ja' } = $props();
  let article = $derived(data.article);
  let path = $derived(article.slug + '/');
</script>

<PageHead title={article.title} description={article.description} shareEn={article.shareEn} {path} {lang} shareType="article" />

<svelte:head>
  <link rel="stylesheet" href={BASE_PATH + 'styles/content.css'} />
  <link rel="stylesheet" href={BASE_PATH + 'styles/chapter.css'} />
  <link rel="stylesheet" href={BASE_PATH + 'styles/articles/' + article.slug + '.css'} />
  {#if article.liveData}
    <script defer src={BASE_PATH + 'livedata.js'}></script>
  {/if}
  <script defer src={BASE_PATH + 'scripts/articles/' + article.slug + '.js'}></script>
  <script defer src={BASE_PATH + 'scripts/share.js'}></script>
  <script defer src={BASE_PATH + 'scripts/navigation-feedback.js'}></script>
  <script defer src={BASE_PATH + 'scripts/toc.js'}></script>
</svelte:head>

<div class="wrap">
  <SiteHeader />
  <main id="main-content" tabindex="-1">
    <article class="chapter">
      <a class="eyebrow" href={BASE_PATH + '#layer-' + article.layer}>
        <svg class="nav-symbol" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        <LayerLabel layer={LAYERS[article.layer - 1]} />
      </a>
      <!-- 見出しと本文の HTML はリポジトリ内の原稿から読み込む。 -->
      <h1 data-i18n-html>{@html article.heading}</h1>
      {@html data.body}
    </article>
    <Share {...article} label={article.openQuestion ? 'この問いをシェアする' : 'この答えをシェアする'} url={siteUrl(path)} urlEn={siteUrl(path, 'en')} {lang} />
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
    <Bridge articleSlug={article.slug} />
  </footer>
</div>
<ArticleToc current={article.slug} />
<ArticleNav previous={data.previous} next={data.next} {article} total={ARTICLES.length} />
