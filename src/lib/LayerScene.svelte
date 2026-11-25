<script>
  // トップページの各層の見出しに添える小さな挿絵。記事の挿絵と同じおばけと線の描き方にそろえる。
  let { number } = $props();
  const BODY = 'M22 78C21 55 24 30 38 20 47 13 60 14 66 24 71 33 70 46 73 56 76 66 81 72 86 76 88 78 87 80 84 81 79 83 74 83 70 82 66 81 64 84 63 87 62 90 58 90 54 89 48 87 42 86 37 88 32 90 26 89 23 85 22 83 22 81 22 78Z';
  const MOUTH = 'M43.5 46.5Q48.5 47.8 53 47.2 53.2 53 48.3 53.6 43.8 53.3 43.5 46.5Z';
  const HAND = 'M80 34c6-4 11 0 10 6-1 5-7 7-11 3-3-3-2-7 1-9Z';
</script>

{#snippet ghost(x, y, s, hand = false)}
  <g class="float">
    <g transform="translate({x} {y}) scale({s})">
      <path class="gb" d={BODY} />
      <ellipse class="ge" cx="40" cy="37" rx="4" ry="5" transform="rotate(-10 40 37)" />
      <ellipse class="ge" cx="55" cy="39" rx="3.8" ry="5" transform="rotate(8 55 39)" />
      <path class="ge" d={MOUTH} />
      {#if hand}<path class="gb" d={HAND} />{/if}
    </g>
  </g>
{/snippet}

<svg class="scene layer-scene" viewBox="0 0 160 92" aria-hidden="true">
  <ellipse class="sh" cx="40" cy="87" rx="20" ry="3" />
  {#if number === 1}
    <!-- 名前は知ってる：大きなコインを、おばけがのぞきこむ -->
    <ellipse class="sh" cx="112" cy="87" rx="26" ry="3" />
    <circle class="ac" cx="112" cy="50" r="30" />
    <circle class="hl" cx="112" cy="50" r="21" />
    <!-- ₿：縦線1本と、上下2つのふくらみ、上下に飛び出す2本ずつの短い線 -->
    <path class="al" stroke-linecap="round" stroke-linejoin="round" d="M106 38v25M104 38h9a6 6 0 0 1 0 12h-9M104 50h10a6.5 6.5 0 0 1 0 13h-10M108.5 34v4M113.5 34v4M108.5 63v4M113.5 63v4" />
    {@render ghost(6, 30, 0.6)}
    <text class="qm tw" x="62" y="30">?</text>
    <path class="af tw d2" d="M150 14l1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3-3.3-1.2 3.3-1.2z" />
  {:else if number === 2}
    <!-- ニュースで見たよ：見出しが流れる画面に、おばけがびっくりする -->
    <ellipse class="sh" cx="112" cy="87" rx="30" ry="3" />
    <path class="nl" d="M100 6l10 10M124 6l-10 10" />
    <rect class="nf" x="76" y="16" width="72" height="54" rx="7" />
    <rect class="ac" x="84" y="24" width="56" height="12" rx="3" />
    <path class="nl" d="M84 46h44M84 55h34M84 64h24" />
    <path class="af" d="M138 44l-7 11h6l-4 10 10-13h-6l4-8z" />
    <path class="nl" d="M104 70l-6 14M120 70l6 14" />
    {@render ghost(4, 30, 0.6, true)}
    <text class="qm tw" x="58" y="28">!</text>
  {:else if number === 3}
    <!-- ちょっと詳しいよ：つながったブロックを、おばけが虫めがねで調べる -->
    <ellipse class="sh" cx="114" cy="87" rx="36" ry="3" />
    <rect class="ac" x="78" y="54" width="22" height="22" rx="4" />
    <rect class="ac" x="108" y="54" width="22" height="22" rx="4" />
    <rect class="hl" x="138" y="54" width="18" height="22" rx="4" />
    <path class="al" d="M100 65h8M130 65h8" />
    <path class="nl" d="M84 62h10M84 68h7M114 62h10M114 68h7" />
    {@render ghost(4, 30, 0.6, true)}
    <g class="float d2">
      <circle class="hl" cx="78" cy="28" r="12" />
      <path class="al k" d="M69 37l-9 9" />
      <path class="nl" d="M73 24a7 7 0 0 1 6-3" />
    </g>
  {:else}
    <!-- そもそもお金って何？：貝がら、硬貨、紙幣が並ぶ前で、おばけが首をかしげる -->
    <ellipse class="sh" cx="112" cy="87" rx="38" ry="3" />
    <path class="ac" d="M78 84c-4-12 2-24 12-26 10 2 16 14 12 26z" />
    <path class="nl" d="M90 60v22M84 64l3 18M96 64l-3 18" />
    <circle class="ac" cx="120" cy="72" r="12" />
    <rect class="hl" x="114" y="68" width="12" height="8" rx="1" />
    <rect class="nf" x="104" y="20" width="48" height="28" rx="4" transform="rotate(-8 128 34)" />
    <circle class="ac" cx="128" cy="34" r="7" transform="rotate(-8 128 34)" />
    <path class="nl" d="M110 26h6M140 40h6" transform="rotate(-8 128 34)" />
    <circle class="ac" cx="146" cy="78" r="8" />
    {@render ghost(4, 30, 0.6)}
    <text class="qm tw" x="60" y="30">?</text>
  {/if}
</svg>
