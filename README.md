# なんか よくわからんけど こわい ビットコイン

ニュースで見たイメージと、ほんとの姿。
なんとなくの「こわい」を、誤解ひとつずつほどいていくサイトです。

https://lokuyow.github.io/nanka-kowai-bitcoin/

ビットコインを外側から説明するサイトで、「さわってわかるビットコイン」（内側から触って学ぶ）の姉妹編です。
https://lokuyow.github.io/sawatte-wakaru-bitcoin/

## 開発とテスト

開発と CI では、`.node-version` に記載された Node.js と `package.json` の `packageManager` に記載された npm を使います。初回は `npm ci` と `npx playwright install chromium` を実行してください。

- `npm run dev` で開発サーバーを起動します。サイトは `/nanka-kowai-bitcoin/` 配下にあります。
- `npm run build` で SvelteKit が静的サイトを `build/` に出力します。
- `npm test` で生成したサイトのリンク・図解・テーマ・言語・シェア・PWA を検証します。

記事の並びとメタデータは `src/lib/site.js`、本文は `src/lib/articles/` にあります。図解の JS と記事固有の CSS は、それぞれ `static/scripts/articles/` と `static/styles/articles/` にあります。

### ページ内画像の追加

Python に Pillow 11.3 以降をインストールし、次のように元画像から AVIF を生成します。

```sh
python -m pip install "Pillow>=11.3"
python scripts/convert-image.py source.png static/media/example.avif --quality 80
```

`--width` は表示用のサムネイルなどを縮小するときに指定します。既存の JPEG や WebP を軽量な代替画像にする場合も、出力の拡張子を変えて同じスクリプトを使えます。ページでは `<picture>` 内に AVIF の `<source>` と代替画像の `<img>` を置きます。`static/media/` にはページで使う画像を置くと、PWA で事前キャッシュされます。

ニュース画像は元の「ビットコイン逮捕報道のニューススタジオ.png」から幅1200px、さわビの紹介画像は[公式OGPのPNG](https://lokuyow.github.io/sawatte-wakaru-bitcoin/og-image-v9.png?v=20261028c)から幅320pxで生成します。AVIF と代替画像はそれぞれ元の PNG を入力にします。

## 公開

GitHub Actions は PR と `main` への push でテストを実行し、`main` で成功したビルドを GitHub Pages に公開します。初回公開前に、リポジトリの **Settings → Pages → Source** を **GitHub Actions** に設定してください。

手動で再公開する場合は、認証済みの GitHub CLI（`gh`）を用意して `npm run deploy` を実行します。GitHub 上の `main` をテストしてから公開するため、ローカルの未コミット・未プッシュの変更は含まれません。実行状況は `gh run list --workflow test.yml` で確認できます。

## PWA

ビルド時に、ページと表示用の JS・CSS・画像などに内容のハッシュを付けたファイルを生成します。Service Worker（`build/sw.js`）が有効になると、サイト内のリンクから開くページは事前キャッシュから表示します。URL を直接開いたときやブラウザーが再読み込みを通知したときはネットワークで HTML を再検証し、通信できないときは事前キャッシュに切り替えます。Workbox は同じハッシュのファイルを再利用し、更新時に変更・追加されたファイルだけを取得します。PWA の動作確認には `npm run build` のあとに `npm run preview` を使ってください。

## ライセンス

このサイトのオリジナルの文章・コードなどは CC0 1.0 Universal で公開しています。全文は [LICENSE](LICENSE) を参照してください。

サイトタイトルに使う M PLUS 1 Code のサブセットは SIL Open Font License 1.1 で配布しています。著作権表示とライセンス全文は [OFL.txt](static/fonts/OFL.txt) を参照してください。
