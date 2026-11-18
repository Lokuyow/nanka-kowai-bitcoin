# なんか よくわからんけど こわい ビットコイン

ニュースで見たイメージと、ほんとの姿。
なんとなくの「こわい」を、誤解ひとつずつほどいていくサイトです。

https://lokuyow.github.io/nanka-kowai-bitcoin/

ビットコインを外側から説明するサイトで、「さわってわかるビットコイン」（内側から触って学ぶ）の姉妹編です。
https://lokuyow.github.io/sawatte-wakaru-bitcoin/

## テスト

`npm test` で自動テスト（61件：全ページの健全性・整合性・図解スモーク・テーマ・言語・PWA）が走ります。初回は `npm ci` のあと `npx playwright install chromium` が必要です。GitHub Actions でも main への push と PR のたびに実行されます。

## PWA

Service Worker（sw.js）のキャッシュを更新するときは、sw.js 内の `SW_VERSION` を上げてください（キャッシュ名が変わり、旧キャッシュは自動で削除されて全端末に入れ替わります）。

## ライセンス

CC0 1.0 Universal（パブリックドメイン）。全文は LICENSE ファイルを参照してください。
