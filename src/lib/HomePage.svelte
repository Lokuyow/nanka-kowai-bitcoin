<script>
  import { ARTICLES, BASE_PATH, HOME, LAYERS, articlePath, siteUrl } from './site.js';
  import ArticleIcon from './ArticleIcon.svelte';
  import Bridge from './Bridge.svelte';
  import ChevronRight from './ChevronRight.svelte';
  import LayerLabel from './LayerLabel.svelte';
  import PageHead from './PageHead.svelte';
  import Share from './Share.svelte';
  import SiteHeader from './SiteHeader.svelte';

  let { lang = 'ja' } = $props();
</script>

<PageHead title={HOME.title} description={HOME.description} shareEn={HOME.shareEn} path="" {lang} shareType="website" />

<svelte:head>
  <link rel="stylesheet" href={BASE_PATH + 'styles/content.css'} />
  <link rel="stylesheet" href={BASE_PATH + 'styles/home.css'} />
  <script defer src={BASE_PATH + 'scripts/share.js'}></script>
  <script defer src={BASE_PATH + 'scripts/hero-questions.js'}></script>
  <script defer src={BASE_PATH + 'scripts/navigation-feedback.js'}></script>
</svelte:head>

<div class="wrap home">
  <SiteHeader />

  <main id="main-content" tabindex="-1">
    <div class="hero">
      <div class="peek">
        <!-- タイトルを書いた紙のうしろから顔を出し、ふちに手をかけるおばけ -->
        <!-- 首を左にかしげ、目線をタイトルの方へ向ける -->
        <svg class="peek-head" viewBox="0 0 120 84" aria-hidden="true">
          <g transform="rotate(-9 60 84)">
            <path d="M6 84C5 60 12 34 30 18 44 6 70 4 86 16 104 30 112 56 114 84Z" />
            <ellipse cx="38" cy="45" rx="6.2" ry="7.8" transform="rotate(-8 38 45)" />
            <ellipse cx="63" cy="46" rx="5.9" ry="7.8" transform="rotate(7 63 46)" />
          </g>
        </svg>
        <div class="hero-card">
          <svg class="peek-hands" viewBox="0 0 120 26" aria-hidden="true">
            <ellipse cx="17" cy="13" rx="13" ry="9.5" transform="rotate(-8 17 13)" />
            <ellipse cx="103" cy="13" rx="13" ry="9.5" transform="rotate(8 103 13)" />
          </svg>
          <h1 class="t"><span data-i18n>なんか</span><span data-i18n>よくわからんけど</span><span data-i18n>こわい</span><span data-i18n>ビットコイン</span></h1>
        </div>
      </div>
      <p class="subtitle" data-i18n>ネットやSNSで見たビットコインの話、どこまで本当？</p>
      <p class="lede" data-i18n>ビットコインの「こわい」をひとつずつ解きほぐす</p>
      <!-- 小さなおばけが、よく聞く「こわい」を吹き出しで順番に話す。吹き出しはその話へのリンク -->
      <div class="hero-talk">
        <svg class="hero-talk-ghost" viewBox="18 10 74 82" aria-hidden="true">
          <path class="body" d="M22 78C21 55 24 30 38 20 47 13 60 14 66 24 71 33 70 46 73 56 76 66 81 72 86 76 88 78 87 80 84 81 79 83 74 83 70 82 66 81 64 84 63 87 62 90 58 90 54 89 48 87 42 86 37 88 32 90 26 89 23 85 22 83 22 81 22 78Z" />
          <ellipse class="eye" cx="40" cy="37" rx="4" ry="5" transform="rotate(-10 40 37)" />
          <ellipse class="eye" cx="55" cy="39" rx="3.8" ry="5" transform="rotate(8 55 39)" />
        </svg>
        <a class="hero-q" id="heroQ" href={articlePath('scam')}>
          <span class="hero-q-label" data-i18n>よく聞く「こわい」</span>
          <span class="hero-q-text" id="heroQText">結局ビットコインって詐欺なんじゃないの？</span>
          <ChevronRight class="hero-q-arr" />
        </a>
      </div>
      <a class="action-primary" href={articlePath(ARTICLES[0].slug)}>
        <span data-i18n>最初から見る</span><ChevronRight />
      </a>
    </div>

    <div class="story-index" id="stories">
      {#each LAYERS as layer (layer.number)}
        <section class="story-layer" id={'layer-' + layer.number} aria-labelledby={'layer-title-' + layer.number}>
          <h2 class="layerhead" id={'layer-title-' + layer.number}><LayerLabel {layer} /></h2>
          <p class="layerdesc" data-i18n>{layer.description}</p>
          <ul class="story-list">
            {#each ARTICLES.filter((article) => article.layer === layer.number) as article (article.slug)}
              <li id={'story-' + article.slug}>
                <a class="unit" href={articlePath(article.slug)}>
                  <span class="unit-marker">
                    <ArticleIcon slug={article.slug} />
                  </span>
                  <span class="unit-text">
                    <span class="unit-eyebrow"><span>{String(article.number).padStart(2, '0')}</span><span aria-hidden="true">·</span><span data-i18n>{article.navTitle}</span></span>
                    <span class="q" data-i18n>{article.title}</span>
                  </span>
                  <ChevronRight class="arr" />
                </a>
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    </div>

    <div class="summary home-end"><small data-i18n>読み終わったら</small>
      <span data-i18n>「こわい」の正体はたいてい「わからなさ」だった</span>
      <!-- 壁に映った大きな影の正体は、ライトの前にいる小さなおばけだった、という挿絵 -->
      <svg class="scene end-scene" viewBox="0 0 260 112" aria-hidden="true">
        <defs>
          <!-- 光の端を枠で切らず、ランプから離れるほど透明にしてふわっと消す -->
          <radialGradient id="beamFade" gradientUnits="userSpaceOnUse" cx="60" cy="78" r="200">
            <stop offset="0" style="stop-color:var(--color-secondary)" />
            <stop offset="1" style="stop-color:var(--color-secondary);stop-opacity:0" />
          </radialGradient>
        </defs>
        <path class="beam" d="M60 78L262 -6V112H60L60 106Z" />
        <ellipse class="sh" cx="38" cy="104" rx="26" ry="3.5" />
        <ellipse class="sh" cx="116" cy="104" rx="22" ry="3.5" />
        <g class="float">
          <path class="shade" transform="translate(152 -10) scale(1.28)" d="M22 78C21 55 24 30 38 20 47 13 60 14 66 24 71 33 70 46 73 56 76 66 81 72 86 76 88 78 87 80 84 81 79 83 74 83 70 82 66 81 64 84 63 87 62 90 58 90 54 89 48 87 42 86 37 88 32 90 26 89 23 85 22 83 22 81 22 78Z" />
          <path class="shade" transform="translate(152 -10) scale(1.28)" d="M80 34c6-4 11 0 10 6-1 5-7 7-11 3-3-3-2-7 1-9Z" />
        </g>
        <rect class="nf" x="14" y="84" width="34" height="16" rx="4" />
        <path class="nl" d="M22 92h12" />
        <path class="ac" d="M48 82L60 76V108L48 102Z" />
        <g class="float">
          <g transform="translate(88 48) scale(.62)">
            <path class="gb" d="M22 78C21 55 24 30 38 20 47 13 60 14 66 24 71 33 70 46 73 56 76 66 81 72 86 76 88 78 87 80 84 81 79 83 74 83 70 82 66 81 64 84 63 87 62 90 58 90 54 89 48 87 42 86 37 88 32 90 26 89 23 85 22 83 22 81 22 78Z" />
            <ellipse class="ge" cx="40" cy="37" rx="4" ry="5" transform="rotate(-10 40 37)" />
            <ellipse class="ge" cx="55" cy="39" rx="3.8" ry="5" transform="rotate(8 55 39)" />
            <path class="ge" d="M43.5 46.5Q48.5 47.8 53 47.2 53.2 53 48.3 53.6 43.8 53.3 43.5 46.5Z" />
            <path class="gb" d="M80 34c6-4 11 0 10 6-1 5-7 7-11 3-3-3-2-7 1-9Z" />
          </g>
        </g>
        <path class="af tw" d="M146 34l1.4 3.8 3.8 1.4-3.8 1.4-1.4 3.8-1.4-3.8-3.8-1.4 3.8-1.4z" />
        <path class="af tw d2" d="M78 40l1 2.8 2.8 1-2.8 1-1 2.8-1-2.8-2.8-1 2.8-1z" />
      </svg></div>
  </main>
  <footer class="home-end">
    <Share {...HOME} label="このサイトをシェアする" url={siteUrl()} urlEn={siteUrl('', 'en')} {lang} />
    <Bridge preview />
    <div class="tipw"><div class="tip"><p data-i18n>いいなと思ったら応援しよう！</p><a class="tipb" href="https://satssupport.app/t/v5mSDzHPFkju" target="_blank" rel="noopener noreferrer" data-i18n>ビットコインで応援する</a></div></div>
    <p class="credit"><span class="count" data-i18n data-i18n-en={ARTICLES.length + ' stories'}>全{ARTICLES.length}話</span><i aria-hidden="true">·</i><span data-i18n>つくった人</span> <a href="https://lokuyow.github.io/" target="_blank" rel="noopener">ロクヨウ</a><i aria-hidden="true">·</i><a href="https://github.com/Lokuyow/nanka-kowai-bitcoin" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg><span data-i18n>ソースコード</span></a></p>
  </footer>
</div>
