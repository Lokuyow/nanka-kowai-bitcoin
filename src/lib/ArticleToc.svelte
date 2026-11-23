<script>
  import ArticleIcon from './ArticleIcon.svelte';
  import LayerLabel from './LayerLabel.svelte';
  import { ARTICLES, LAYERS, articlePath } from './site.js';

  let { current } = $props();
</script>

<!-- 画面の横幅が広いときだけ左に出す目次。狭い画面では下のタブバーと一覧ページで移動する。 -->
<nav class="toc" aria-label="目次" data-i18n-label>
  {#each LAYERS as layer (layer.number)}
    <section class="toc-layer">
      <p class="toc-head"><LayerLabel {layer} /></p>
      <ol>
        {#each ARTICLES.filter((article) => article.layer === layer.number) as article (article.slug)}
          <li>
            <a href={articlePath(article.slug)} aria-current={article.slug === current ? 'page' : undefined}>
              <ArticleIcon slug={article.slug} />
              <span data-i18n>{article.title}</span>
            </a>
          </li>
        {/each}
      </ol>
    </section>
  {/each}
</nav>
