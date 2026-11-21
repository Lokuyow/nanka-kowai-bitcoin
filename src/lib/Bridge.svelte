<script>
  import { BASE_PATH } from './site.js';

  let { preview = false } = $props();
  const url = 'https://lokuyow.github.io/sawatte-wakaru-bitcoin/';
</script>

{#if preview}
  <a class="bridge-card" href={url}>
    <img src={BASE_PATH + 'sawatte-og.webp'} width="1200" height="630" alt="" loading="lazy" />
    <span class="bridge-copy">
      <span class="bridge-lede" data-i18n>内側の仕組みを知りたくなったら</span>
      <strong data-i18n>さわってわかるビットコイン</strong>
    </span>
    <span class="bridge-arrow" aria-hidden="true">→</span>
  </a>
{:else}
  <p class="bridge">
    <span data-i18n>内側の仕組みを知りたくなったら</span>
    <a href={url} data-i18n>さわってわかるビットコイン</a>
  </p>
{/if}
