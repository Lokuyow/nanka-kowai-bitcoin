// 表示前に端末設定と保存済みの設定を反映する。
(function () {
  'use strict';

  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const darkMode = window.matchMedia?.('(prefers-color-scheme: dark)');
  const themes = ['system', 'light', 'dark'];
  const themeLabels = {
    system: ['テーマ：端末に合わせる（次はライト）', 'Theme: match device (tap for light)'],
    light: ['テーマ：ライト（次はダーク）', 'Theme: light (tap for dark)'],
    dark: ['テーマ：ダーク（次は端末に合わせる）', 'Theme: dark (tap for system)'],
  };

  function themePreference() {
    try {
      const saved = localStorage.getItem('theme');
      if (themes.includes(saved)) return saved;
    } catch {}
    return 'system';
  }

  function applyTheme(preference) {
    const theme = preference === 'system' ? (darkMode?.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = theme;
    root.dataset.themePref = preference;
    themeColor?.setAttribute('content', theme === 'dark' ? '#171614' : '#fffaf3');
    return theme;
  }

  function initialLanguage() {
    try {
      const saved = localStorage.getItem('lang');
      if (saved === 'ja' || saved === 'en') return saved;
      if ((navigator.language || '').toLowerCase().startsWith('en')) return 'en';
    } catch {}
    return 'ja';
  }

  applyTheme(themePreference());
  root.dataset.lang = initialLanguage();
  root.lang = root.dataset.lang;

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    if (!button) return;

    function updateTheme() {
      const preference = themePreference();
      const theme = applyTheme(preference);
      const [ja, en] = themeLabels[preference];
      button.setAttribute('aria-label', window.L ? window.L(ja, en) : ja);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    }

    button.addEventListener('click', () => {
      const next = themes[(themes.indexOf(themePreference()) + 1) % themes.length];
      try {
        localStorage.setItem('theme', next);
      } catch {}
      updateTheme();
    });
    darkMode?.addEventListener?.('change', () => {
      if (themePreference() === 'system') updateTheme();
    });
    document.addEventListener('langchange', updateTheme);
    updateTheme();
  });
})();
