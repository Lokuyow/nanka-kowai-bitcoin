# なんか よくわからんけど こわい ビットコイン

ニュースで見たイメージと、ほんとの姿。
なんとなくの「こわい」を、誤解ひとつずつほどいていくサイトです。

https://lokuyow.github.io/nanka-kowai-bitcoin/

ビットコインを外側から説明するサイトで、「さわってわかるビットコイン」（内側から触って学ぶ）の姉妹編です。
https://lokuyow.github.io/sawatte-wakaru-bitcoin/

## 開発とテスト

Node.js 22.17 以降が必要です。初回は `npm ci` と `npx playwright install chromium` を実行してください。

- `npm run dev` で開発サーバーを起動します。サイトは `/nanka-kowai-bitcoin/` 配下にあります。
- `npm run build` で SvelteKit が静的サイトを `build/` に出力します。
- `npm test` で生成したサイトのリンク・図解・テーマ・言語・シェア・PWA を検証します。

記事の並びとメタデータは `src/lib/site.js`、本文は `src/lib/articles/` にあります。図解の JS と記事固有の CSS は、それぞれ `static/scripts/articles/` と `static/styles/articles/` にあります。

## 公開

GitHub Actions は PR と `main` への push でテストを実行し、`main` で成功したビルドを GitHub Pages に公開します。初回公開前に、リポジトリの **Settings → Pages → Source** を **GitHub Actions** に設定してください。

## PWA

ビルド時に、公開ファイルから Service Worker（`build/sw.js`）のキャッシュバージョンと事前取得リストを生成します。公開内容が変わると、新しいキャッシュの準備後に旧キャッシュが入れ替わります。PWA の動作確認には `npm run build` のあとに `npm run preview` を使ってください。

## ライセンス

CC0 1.0 Universal（パブリックドメイン）。全文は LICENSE ファイルを参照してください。
