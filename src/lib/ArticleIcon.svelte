<script>
  let { slug } = $props();

  const paths = {
    scam: 'M10.3 4.4 3 18a1.4 1.4 0 0 0 1.2 2h15.6a1.4 1.4 0 0 0 1.2-2L13.7 4.4a1.9 1.9 0 0 0-3.4 0ZM12 9v4m0 3.5h.01',
    ceo: 'M3 21h18M6 21V4h10v17m0-12h3v12M9 8h.01M13 8h.01M9 12h.01M13 12h.01M9 21v-5h4v5',
    price: 'M4 4v16h16M7 15l4-5 4 3 5-7m-4 0h4v4',
    fee: 'M3 8h17m-4-4 4 4-4 4M21 16H4m4-4-4 4 4 4',
    satoshi: 'M3 11l13-5 5 5v8H3ZM3 11h18M3 15h18M13 7V6a2 2 0 1 1 4 0',
    hack: 'M6 11h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm2 0V8a4 4 0 0 1 7.6-1.7M12 15v2m6-9 2-2',
    crime: 'M3 11s3-5 9-5 9 5 9 5-3 5-9 5-9-5-9-5Zm11.5 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM5 20h14',
    energy: 'm13 2-9 12h7l-1 8 10-12h-7l1-8Z',
    ban: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM6 6l12 12',
    quantum: 'M12 12h.01M15.5 12c0 5-1.6 9-3.5 9s-3.5-4-3.5-9S10.1 3 12 3s3.5 4 3.5 9Zm4.3-4.5c1 1.7-1.7 5.1-6.1 7.6s-8.5 3.1-9.5 1.4 1.7-5.1 6.1-7.6 8.5-3.1 9.5-1.4Zm0 9c-1 1.7-5.2 1.1-9.5-1.4S3.2 9.2 4.2 7.5s5.2-1.1 9.5 1.4 7.1 5.9 6.1 7.6Z',
    '51': 'M12 3v9h9a9 9 0 1 1-9-9Zm4 0a7 7 0 0 1 5 5h-5Z',
    ai: 'M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 4h6v6H9Zm0-7v3m6-3v3m-6 14v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3',
    reward: 'M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.3-.9L12 3Z',
    limit: 'M4 5h16M6 20v-4m6 4v-8m6 8V9',
    infinite: 'M20 18H4M20 6H4M5 12h3m2.5 0h3m2.5 0h3',
    tulip: 'M12 21v-7m0 4c-1.5-2-3.4-3-6-3m6 5c1.5-2 3.4-3 6-3m-6-3c-3.3 0-6-2.7-6-6V5l4 2 2-4 2 4 4-2v3c0 3.3-2.7 6-6 6Z',
    value: 'm3 9 4-5h10l4 5-9 11L3 9Zm0 0h18M10 4 8 9l4 11 4-11-2-5',
    money: 'M3 6h18v12H3ZM8 6a5 5 0 0 1-5 5m13-5a5 5 0 0 0 5 5M8 18a5 5 0 0 0-5-5m13 5a5 5 0 0 1 5-5m-7-1a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
    freedom: 'M3 13c4 1 6-3 9-4 3-1 4 0 5 1l4-1-3 3c-1 4-4 6-9 6H5l3-3c-3 0-4-1-5-2Zm10-5c-1-2-3-3-6-3l3 5',
    fair: 'M12 3v18m-5 0h10M4 7h16M6 7l-4 8h8L6 7Zm12 0-4 8h8l-4-8Z',
    death: 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-4 4v9m0-3h4m-4-3h3',
    future: 'M3 19a9 9 0 0 1 18 0M2 19h20M12 3v3M4 6l2 2m14-2-2 2',
    nation: 'M3 9h18L12 4 3 9Zm1 11h16M6 12v5m6-5v5m6-5v5'
  };
</script>

<svg class="unit-icon" width="22" height="22" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"
  aria-hidden="true" focusable="false">
  <path d={paths[slug]} />
</svg>
