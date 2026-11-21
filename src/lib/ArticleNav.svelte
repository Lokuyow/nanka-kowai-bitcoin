<script>
  import { BASE_PATH, articlePath } from './site.js';

  let { previous, next, number, total } = $props();
</script>

<footer class="tabbar">
  {#if previous}
    <a class="tb" href={articlePath(previous)} data-i18n>← 前</a>
  {:else}
    <span class="tb off" data-i18n>← 前</span>
  {/if}
  <a class="tb idx" href={BASE_PATH}><span data-i18n>一覧</span><small class="pos">{number} / {total}</small></a>
  {#if next}
    <a class="tb" href={articlePath(next)} data-i18n>次 →</a>
  {:else}
    <span class="tb off" data-i18n>次 →</span>
  {/if}
</footer>
