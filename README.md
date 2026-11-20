# なんか よくわからんけど こわい ビットコイン

ニュースで見たイメージと、ほんとの姿。
なんとなくの「こわい」を、誤解ひとつずつほどいていくサイトです。

https://lokuyow.github.io/nanka-kowai-bitcoin/

ビットコインを外側から説明するサイトで、「さわってわかるビットコイン」（内側から触って学ぶ）の姉妹編です。
https://lokuyow.github.io/sawatte-wakaru-bitcoin/

## リポジトリ構成

GitHub Pages がリポジトリ直下を公開します。サイトの公開にビルドは不要です。

| 場所 | 内容 |
| --- | --- |
| `index.html`、`404.html` | トップとエラーページ |
| `scam/`、`ceo/` など | 各話の本文と図解を収めた `index.html`、記事ごとの `ogp.png` |
| `assets/css/` | 各話の基本スタイル、テーマ・言語ボタン、共有欄の共通スタイル |
| `assets/js/` | 初期表示とテーマ切り替え、言語切り替えと翻訳辞書、共有と Service Worker 登録、ライブデータ取得 |
| `sw.js`、`manifest.webmanifest`、`icons/` | オフライン表示とインストールに使う PWA ファイル |
| `tests/` | Playwright によるブラウザテストと静的な整合性チェック |

共有用の日本語文言と URL は各ページの OGP タイトル・説明文と canonical URL を使います。英語の共有文言は共有欄の `data-share-title-en` と `data-share-text-en` で編集できます。

## テスト

`npm test` で全ページの健全性、リンクやナビゲーションの整合性、図解の操作、テーマ、言語、PWA を検証できます。初回は `npm ci` のあと `npx playwright install chromium` が必要です。GitHub Actions でも main への push と PR のたびに実行されます。

## PWA

オフライン表示に使う共通ファイルを追加・移動するときは、`sw.js` の `PRECACHE` を更新してください。キャッシュを入れ替えるときは `SW_VERSION` を上げます。

## ライセンス

CC0 1.0 Universal（パブリックドメイン）。全文は LICENSE ファイルを参照してください。
