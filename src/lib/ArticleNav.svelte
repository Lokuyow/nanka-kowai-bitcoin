<script>
  import { BASE_PATH, articlePath } from './site.js';
  import ArticleIcon from './ArticleIcon.svelte';

  let { article, previous, next, total } = $props();
</script>

{#snippet symbol(path)}
  <svg class="nav-symbol" viewBox="0 0 24 24" aria-hidden="true">
    <path d={path} />
  </svg>
{/snippet}

{#snippet destination(target)}
  <span class="layer-number" aria-hidden="true">{target.layer}</span>
  <ArticleIcon slug={target.slug} />
{/snippet}

<nav class="tabbar" aria-label="記事の移動" data-i18n-label>
  {#if previous}
    <a class="tb" href={articlePath(previous.slug)} aria-label="前の話" data-i18n-label>
      {@render symbol('M15 6l-6 6 6 6')}
      {@render destination(previous)}
    </a>
  {:else}
    <span class="tb off" aria-hidden="true">{@render symbol('M15 6l-6 6 6 6')}</span>
  {/if}
  <a class="tb idx" href={BASE_PATH + '#story-' + article.slug} aria-label="一覧" aria-describedby="article-position" data-i18n-label>
    {@render symbol('M8 6h11M8 12h11M8 18h11M4 6h.01M4 12h.01M4 18h.01')}
    <span class="pos" id="article-position">{article.number} / {total}</span>
  </a>
  {#if next}
    <a class="tb" href={articlePath(next.slug)} aria-label="次の話" data-i18n-label>
      {@render destination(next)}
      {@render symbol('M9 6l6 6-6 6')}
    </a>
  {:else}
    <span class="tb off" aria-hidden="true">{@render symbol('M9 6l6 6-6 6')}</span>
  {/if}
</nav>

<style>
  .layer-number {
    margin-inline-end: 0;
  }
</style>
