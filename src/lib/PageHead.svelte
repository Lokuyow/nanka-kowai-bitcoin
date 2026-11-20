<script>
  import { SITE_TITLE } from './site.js';

  let { title, description, url, shareType } = $props();
  let documentTitle = $derived(title === SITE_TITLE ? SITE_TITLE : title + '：' + SITE_TITLE);
</script>

<svelte:head>
  <title>{documentTitle}</title>
  <meta name="description" content={description} />
  {#if url}
    <link rel="canonical" href={url} />
    <meta property="og:type" content={shareType} />
    <meta property="og:site_name" content={SITE_TITLE} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={url + 'ogp.png'} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
  {/if}
</svelte:head>
