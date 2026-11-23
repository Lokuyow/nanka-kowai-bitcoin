<script>
  import ArticlePage from '../../lib/ArticlePage.svelte';

  let { data } = $props();
</script>

<ArticlePage {data} lang="ja" />
