<script>
  import { ARTICLES, BASE_PATH, HOME, LAYERS, SITE_URL, articlePath, layerHeading } from '../lib/site.js';
  import Bridge from '../lib/Bridge.svelte';
  import PageHead from '../lib/PageHead.svelte';
  import Share from '../lib/Share.svelte';
  import SiteHeader from '../lib/SiteHeader.svelte';
</script>

<PageHead title={HOME.title} description={HOME.description} url={SITE_URL} shareType="website" />

<svelte:head>
  <link rel="stylesheet" href={BASE_PATH + 'styles/content.css'} />
  <link rel="stylesheet" href={BASE_PATH + 'styles/home.css'} />
  <script defer src={BASE_PATH + 'scripts/share.js'}></script>
</svelte:head>

<div class="wrap">
  <SiteHeader>
    {#snippet label()}<span data-i18n data-i18n-en={ARTICLES.length + ' stories'}>全{ARTICLES.length}話</span>{/snippet}
  </SiteHeader>

  <div class="hero">
    <div class="peek">
      <!-- タイトルの枠のうしろから顔を出し、ふちに手をかけるおばけ -->
      <svg class="peek-head" viewBox="0 0 120 84" aria-hidden="true">
        <path d="M6 84C5 60 12 34 30 18 44 6 70 4 86 16 104 30 112 56 114 84Z" />
        <ellipse cx="47" cy="44" rx="6.2" ry="7.8" transform="rotate(-8 47 44)" />
        <ellipse cx="73" cy="46" rx="5.9" ry="7.8" transform="rotate(7 73 46)" />
      </svg>
      <div class="hero-card">
        <svg class="peek-hands" viewBox="0 0 120 26" aria-hidden="true">
          <ellipse cx="17" cy="13" rx="13" ry="9.5" transform="rotate(-8 17 13)" />
          <ellipse cx="103" cy="13" rx="13" ry="9.5" transform="rotate(8 103 13)" />
        </svg>
        <h1 class="t"><span data-i18n>なんか</span><span data-i18n>よくわからんけど</span><span data-i18n>こわい</span><span data-i18n>ビットコイン</span></h1>
      </div>
    </div>
    <p class="subtitle" data-i18n>ニュースで見たイメージと、ほんとの姿。</p>
  </div>

  <section>
    <h2 data-i18n>なぜこわく見えるのか</h2>
    <p class="lede" data-i18n>見出しだけを見ていると、目に入るのは事件と暴落の話ばかり。「わからない」ものは「こわい」ものに見える。ここではその誤解をひとつずつ図で解いていく。</p>
  </section>
  {#each LAYERS as layer}
    <p class="layerhead" data-i18n-html>{@html layerHeading(layer)}</p>
    <p class="layerdesc" data-i18n>{layer.description}</p>
    {#each ARTICLES.filter((article) => article.layer === layer.number) as article (article.slug)}
      <a class="unit" href={articlePath(article.slug)}><span class="n">{article.number}</span><span><span class="q" data-i18n>{article.title}</span><br /><span class="a" data-i18n>{article.cardAnswer}</span></span><span class="arr">→</span></a>
    {/each}
  {/each}

  <div class="summary"><small data-i18n>読み終わったら</small>
    <span data-i18n>「こわい」の正体はたいてい「わからなさ」だった</span></div>
  <Share {...HOME} label="このサイトをシェアする" url={SITE_URL} />
  <Bridge />
  <div class="tipw"><div class="tip"><p data-i18n>いいなと思ったら応援しよう！</p><a class="tipb" href="https://satssupport.app/t/v5mSDzHPFkju" target="_blank" rel="noopener noreferrer" data-i18n>ビットコインで応援する</a></div></div>
<p class="credit"><span data-i18n>つくった人</span> <a href="https://lokuyow.github.io/" target="_blank" rel="noopener">ロクヨウ</a><i aria-hidden="true">·</i><a href="https://github.com/Lokuyow/nanka-kowai-bitcoin" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg><span data-i18n>ソースコード</span></a></p>
</div>
