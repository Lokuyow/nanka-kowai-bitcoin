<script>
  import { BASE_PATH } from '../lib/site.js';
  let { children } = $props();
</script>

<svelte:head>
  {#if import.meta.env.PROD}
    <script defer src={BASE_PATH + 'scripts/register-worker.js'}></script>
  {/if}
</svelte:head>

{@render children()}
