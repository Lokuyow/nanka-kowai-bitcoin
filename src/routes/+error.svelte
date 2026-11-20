<script>
  import { page } from '$app/state';
  import NotFound from '../lib/NotFound.svelte';
</script>

{#if page.status === 404}
  <NotFound />
{:else}
  <h1>{page.status}</h1>
  <p>{page.error?.message}</p>
{/if}
