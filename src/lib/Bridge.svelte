<script module>
  const url = 'https://lokuyow.github.io/sawatte-wakaru-bitcoin/';
  // 姉妹サイトが公開 URL で受け付ける ?s= の値。各話の内容にいちばん近い章へ飛ばす。
  const lessons = {
    intro: { ja: 'はじめに', en: 'What Bitcoin is' },
    sign: { ja: '署名', en: 'Keys and signatures' },
    keys: { ja: '鍵の強さ', en: 'How strong keys are' },
    ledger: { ja: 'みんなの台帳', en: 'The shared ledger' },
    chunks: { ja: 'コインのかたまり', en: 'Coins come in chunks' },
    mine: { ja: 'マイニング', en: 'Mining and difficulty' },
    nodes: { ja: 'ブロックが届く', en: 'How blocks reach other nodes' },
    fee: { ja: '手数料オークション', en: 'The fee auction' },
    halving: { ja: '報酬半減', en: 'Halving and the 21 million cap' },
    quiz: { ja: 'ニセ取引を見破れ', en: 'Spot the fake transaction' },
    '51': { ja: '51%攻撃', en: '51% attack' }
  };
  const lessonByArticle = {
    scam: 'quiz',
    ceo: 'nodes',
    satoshi: 'chunks',
    fee: 'fee',
    hack: 'ledger',
    crime: 'ledger',
    energy: 'mine',
    ai: 'mine',
    ban: 'nodes',
    reward: 'halving',
    limit: 'halving',
    infinite: 'chunks',
    '51': '51',
    quantum: 'keys',
    money: 'intro',
    freedom: 'sign',
    death: 'sign',
    nation: 'halving'
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
