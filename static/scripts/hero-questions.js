(() => {
  const box = document.getElementById('heroQ');
  const text = document.getElementById('heroQText');
  if (!box || !text) return;

  // ヒーローの吹き出しに、代表的な問いを順番に出す。吹き出し自体がその話へのリンク。
  const questions = [
    { slug: 'scam', ja: '結局ビットコインって詐欺なんじゃないの？', en: "So Bitcoin is basically a scam, right?" },
    { slug: 'ceo', ja: 'ビットコインってどこの会社がやってるの？', en: "So which company runs Bitcoin?" },
    { slug: 'price', ja: 'ビットコインの値段って誰かが決めてるんでしょ？', en: "Someone sets Bitcoin's price, right?" }
  ];
  const base = box.getAttribute('href').replace(/[^/]+\/$/, '');
  let index = 0;

  function render() {
    const q = questions[index];
    text.textContent = document.documentElement.lang === 'en' ? q.en : q.ja;
    box.setAttribute('href', base + q.slug + '/');
  }

  render();
  // 言語が切り替わったら、次のローテーションを待たずに今の問いを描き直す
  new MutationObserver(() => render()).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  setInterval(() => {
    if (document.hidden) return;
    index = (index + 1) % questions.length;
    box.classList.add('swap');
    setTimeout(() => {
      render();
      box.classList.remove('swap');
    }, 320);
  }, 3800);
})();
