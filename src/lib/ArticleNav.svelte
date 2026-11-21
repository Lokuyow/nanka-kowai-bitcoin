<script>
  import { BASE_PATH, articlePath } from './site.js';

  let { article, previous, next, total } = $props();
</script>

<nav class="tabbar" aria-label="記事の移動" data-i18n-label>
  {#if previous}
    <a class="tb" href={articlePath(previous)} data-i18n>← 前</a>
  {:else}
    <span class="tb off" data-i18n>← 前</span>
  {/if}
  <a class="tb idx" href={BASE_PATH + '#story-' + article.slug}><span data-i18n>一覧</span><small class="pos">{article.number} / {total}</small></a>
  {#if next}
    <a class="tb next" href={articlePath(next.slug)} data-i18n>次 →</a>
  {:else}
    <span class="tb off" data-i18n>次 →</span>
  {/if}
</nav>
