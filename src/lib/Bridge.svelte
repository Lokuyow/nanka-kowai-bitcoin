<script module>
  const url = 'https://lokuyow.github.io/sawatte-wakaru-bitcoin/';
  // 姉妹サイトが公開 URL で受け付ける ?s= の値。
  const lessons = {
    nodes: { ja: 'ブロックが届く', en: 'How blocks reach other nodes' },
    flow: { ja: '支払いの流れ', en: 'The payment flow' },
    quiz: { ja: 'ニセ取引を見破れ', en: 'Spot the fake transaction' },
    mining: { ja: 'マイニング競争', en: 'Mining race' },
    '51': { ja: '51%攻撃', en: '51% attack' }
  };
  const lessonByArticle = {
    ceo: 'nodes',
    fee: 'flow',
    hack: 'quiz',
    energy: 'mining',
    ai: 'mining',
    ban: 'nodes',
    quantum: 'flow',
    '51': '51',
    limit: 'nodes'
  };
</script>

<script>
  import { BASE_PATH } from './site.js';
  import ChevronRight from './ChevronRight.svelte';

  let { preview = false, articleSlug } = $props();
  let lessonId = $derived(lessonByArticle[articleSlug]);
  let lesson = $derived(lessons[lessonId]);
</script>

{#if preview}
  <a class="bridge-card" href={url}>
    <picture>
      <source srcset={BASE_PATH + 'media/sawatte-preview.avif'} type="image/avif" />
      <img src={BASE_PATH + 'media/sawatte-preview.webp'} width="320" height="168" alt="" loading="lazy" />
    </picture>
    <span class="bridge-copy">
      <span class="bridge-lede" data-i18n>内側の仕組みを知りたくなったら</span>
      <strong data-i18n>さわってわかるビットコイン</strong>
    </span>
    <ChevronRight class="bridge-chevron" />
  </a>
{:else}
  <p class="bridge">
    <span data-i18n>内側の仕組みを知りたくなったら</span>
    {#if lesson}
      <a href={url + '?s=' + lessonId} data-i18n data-i18n-en={'Touch & Learn Bitcoin: ' + lesson.en}>さわってわかるビットコイン「{lesson.ja}」</a>
    {:else}
      <a href={url} data-i18n>さわってわかるビットコイン</a>
    {/if}
  </p>
{/if}
