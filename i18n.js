/* i18n: 日本語 / English その場切り替え（さわってわかるビットコインと同じ方式）
   - 静的テキスト: data-i18n（テキストのみの要素）/ data-i18n-html（HTML を含む要素）/ data-i18n-label（aria-label・alt）
     辞書キーは原文文字列（空白を正規化したもの）。英語が無いキーは日本語のまま残る。
   - 動的テキスト: L('日本語', 'English') を JS から使う。
   - 日本語への復帰は、読み込み時に保存した原文スナップショットで担保する（辞書に依存しない）。
   - 言語の初期値は head 内の先行スクリプトが html[data-lang] に決める（保存値 > ブラウザ言語）。
   - 切り替えると document に 'langchange' イベントが飛ぶ。各ページのスクリプトは動的表示を描き直すのに使う。 */
(function () {
  'use strict';
  var root = document.documentElement;
  window.LANG = root.getAttribute('data-lang') === 'en' ? 'en' : 'ja';
  window.L = function (ja, en) {
    return (window.LANG === 'en' && en !== undefined && en !== null) ? en : ja;
  };

  var EN = {
    /* ===== 共通（ヘッダー・ナビ・共有・層名） ===== */
    'なんか よくわからんけど<br>こわい ビットコイン': "I don't really get it,<br>but it's scary: Bitcoin",
    '<span>第1層</span>名前だけは知ってる': "<span>Layer 1</span>I've only heard the name",
    '<span>第2層</span>ニュースで見たよ': '<span>Layer 2</span>I saw it on the news',
    '<span>第3層</span>ちょっと詳しいよ': '<span>Layer 3</span>I know a thing or two',
    '<span>第4層</span>そもそもお金って何？': '<span>Layer 4</span>Wait — what even is money?',
    'なぜそう見えるか': 'Why it looks that way',
    '一言まとめ': 'In short',
    'この答えをシェアする': 'Share this answer',
    'このサイトをシェアする': 'Share this site',
    'Xでポストする': 'Post on X',
    'リンクをコピー': 'Copy link',
    'リンクをコピーしました': 'Link copied',
    '一覧へ': 'All stories',
    '全23話': '23 stories',
    '内側の仕組みを知りたくなったら →': 'Want to see how it works on the inside? →',
    'さわってわかるビットコイン': 'Sawatte Wakaru Bitcoin — Touch & Learn',

    /* ===== トップページ ===== */
    'トップ：なんか よくわからんけど こわい ビットコイン': "Home | I don't really get it, but it's scary: Bitcoin",
    'ニュースで見たイメージと、ほんとの姿。なんとなくの「こわい」を誤解ひとつずつほどいていく。': "The image from the news, and what it really looks like. Untangling the vague 'scary' around Bitcoin, one misunderstanding at a time.",
    'なんか': "I don't really get it,",
    'よくわからんけど': 'but somehow',
    'こわい': "it's scary:",
    'ビットコイン': 'Bitcoin',
    'ニュースで見たイメージと、ほんとの姿。': 'The image from the news — and what it really looks like.',
    'なぜこわく見えるのか': 'Why does it look so scary?',
    '見出しだけで接していると、目に入るのは事件と暴落の話ばかり。「わからない」ものは「こわい」ものに見える。ここではその誤解をひとつずつ図でほどいていく。': "When headlines are all you see, all you hear about are crimes and crashes. Things we don't understand tend to look scary. Here, we untangle those misunderstandings one by one, with pictures.",
    '価格とニュースの見出ししか見ていない段階の思い込み': 'Ideas formed from nothing but prices and news headlines',
    '事件報道でイメージが固まった思い込み': 'Ideas set in stone by crime reporting',
    '仕組みを半分知っている人の思い込み': 'Ideas from half-knowing how it works',
    '答えのない問い。考え始めると、お金そのものの話になる': 'Questions with no single answer. Follow them, and you end up asking what money itself is',
    '読み終わったら': 'The takeaway',
    '「こわい」の正体はたいてい「わからなさ」だった': 'Most of the "scary" was really just "unknown"',
    /* トップのカード（第1〜2層分は各ページの h1・答えと一致） */
    '結局ビットコインって詐欺なんじゃないの？': 'So Bitcoin is basically a scam, right?',
    '悪いのはビットコインを使った手口': "What's bad is the trick played using Bitcoin",
    'ビットコインってどこの会社がやってるの？': 'So which company runs Bitcoin?',
    '会社も社長も存在しない': 'There is no company, and no CEO',
    'ビットコインの値段って誰かが決めてるんでしょ？': "Someone sets Bitcoin's price, right?",
    '買いたい人と売りたい人のぶつかり合い': 'It emerges where buyers and sellers meet',
    'ビットコインの送金手数料って高いよね？': "Bitcoin's transfer fees are expensive, right?",
    '高いのは取引所の料金設定': "What's expensive is the exchange's own pricing",
    '1ビットコインって何百万円もするんでしょ？ 買えないよ': "One bitcoin costs millions of yen — I can't afford that",
    'ピザと同じで、一切れから買える': 'Like pizza, you can buy it by the slice',
    'ビットコインってハッキングされて盗まれたんでしょ？': 'Bitcoin got hacked and stolen, right?',
    '壊れたのは取引所の金庫の方': "What got broken into was the exchange's vault",
    'ビットコインって匿名で犯罪に使われるんでしょ？': 'Bitcoin is anonymous and used for crime, right?',
    '匿名ではなく仮名。全部公開で残る': 'Not anonymous — pseudonymous. Everything stays public',
    'ビットコインって電気の無駄遣いでしょ？': 'Bitcoin wastes electricity, right?',
    '電力は不正を防ぐ「壁」のコスト': 'Electricity is the cost of the wall that stops cheating',
    '国が禁止したら、ビットコインは終わりでしょ？': 'If a government bans it, Bitcoin is finished, right?',
    '一国では止められない': "One country can't stop it",
    /* トップのカード（第3〜4層: 次工程でページ側にも展開） */
    '量子コンピューターができたら、ビットコインは終わりでしょ？': 'Once quantum computers arrive, Bitcoin is done for, right?',
    '脅威はずっと先。備える時間がある': "The threat is far off — there's time to prepare",
    '51%攻撃されたら、ビットコインは終わりなんでしょ？': 'A 51% attack would finish Bitcoin, right?',
    'できることは限られ、やる意味もない': "There's little an attacker can do — and no point doing it",
    'AIに全部持っていかれたら、ビットコインは掘れなくなるんじゃないの？': "If AI takes all the computing power, Bitcoin can't be mined, right?",
    '道具が違う。難易度の自己調整もある': 'Different tools — and difficulty adjusts itself',
    '報酬がなくなったら、ビットコインは終わるんでしょ？': 'When the mining reward runs out, Bitcoin ends, right?',
    '収入は報酬と手数料の2本立て': 'Miners earn from two sources: rewards and fees',
    '発行上限ってその気になれば変えられるんでしょ？': 'The supply cap can just be changed, right?',
    '変えても誰もついてこない': 'Change it, and nobody would follow',
    '小さく割れるなら、上限なんてないじゃん？': "If it can be split forever, there's no real limit, right?",
    '割っても総量は同じ': "Splitting doesn't change the total",
    'チューリップバブルと同じで、弾けるんでしょ？': "It's like the tulip bubble — it'll pop, right?",
    '何度も戻ってきた17年': '17 years of coming back, again and again',
    '裏付けがないビットコインは価値ゼロでしょ？': 'With nothing backing it, Bitcoin is worth zero, right?',
    '円も金も裏付けはない': 'The yen and gold have no backing either',
    'お金ってそもそも何？': 'Wait — what even is money?',
    'なぜ紙や数字で物が買えるのか': 'Why can paper and numbers buy things?',
    '管理する人がいないお金は自由？ それともこわい？': 'Money with no one in charge: freedom, or scary?',
    '止められない自由と、助けのない自己責任': 'Freedom no one can stop — and no one to rescue you',
    '早く持った人が得をするのは、ずるくない？': "Isn't it unfair that early holders win?",
    '先に持った人の得は、不公平か': "Is the early bird's gain really unfair?",
    '自分が死んだら、ビットコインはどうなる？': 'What happens to my bitcoin when I die?',
    '鍵を残せるかどうかで変わる': 'It depends on whether you leave the key behind',
    'ビットコインが当たり前になったら、社会はどう変わる？': 'What changes if Bitcoin becomes normal?',
    '送金も貯金も、意味が変わる': 'Sending money and saving would mean something new',
    '国が作らないお金ってありなの？': 'Can money exist without a government making it?',
    '昔は国以外もお金を作っていた': 'Long ago, non-governments made money too',

    /* ===== scam ===== */
    '結局ビットコインって詐欺なんじゃないの？：なんか よくわからんけど こわい ビットコイン': "So Bitcoin is basically a scam, right? | I don't really get it, but it's scary: Bitcoin",
    '結局ビットコインって<br>詐欺なんじゃないの？': 'So Bitcoin is basically<br>a scam, right?',
    '悪いのはビットコインを使った手口で、<br>ビットコインそのものじゃない': "What's bad is the trick played using Bitcoin —<br>not Bitcoin itself",
    '悪いのはビットコインを使った手口で、ビットコインそのものじゃない': "What's bad is the trick played using Bitcoin, not Bitcoin itself",
    '「ビットコイン詐欺」の見出しや、儲け話の勧誘を目にする。値動きも激しくて仕組みもわからないから、「わからないもの＝怪しいもの」に見える。': 'You see headlines about "Bitcoin scams" and pitches promising easy money. The price swings wildly and how it works is a mystery — so "unknown" starts to look like "shady".',
    '「ビットコイン詐欺で○億円の被害」': '"Millions lost to a Bitcoin scam"',
    'こんな見出し、見たことない？': 'Seen a headline like this?',
    '実際は：主語を入れ替えてみる': 'The truth: swap the subject',
    '見出しの主語がちょっとズレている。': 'The subject of the headline is slightly off.',
    'を使った': 'used in a',
    '詐欺': 'scam',
    '主語は <b>ビットコイン</b>？ それとも…？': 'Is the subject <b>Bitcoin</b>? Or…?',
    '主語を入れ替える': 'Swap the subject',
    '実際は：手口の構図は振込詐欺と同じ': 'The truth: the setup is the same as a bank-transfer scam',
    'お金が「円」か「ビットコイン」かだけ。悪い人のやることは変わらない。': 'The only difference is whether the money is yen or bitcoin. The crook\'s playbook never changes.',
    '悪い人': 'The crook',
    '被害者': 'The victim',
    '円': '¥',
    '振込詐欺': 'Bank-transfer scam',
    '電話でだます': 'Lies over the phone',
    'ビットコイン詐欺': 'Bitcoin scam',
    '勧誘でだます': 'Lies in a sales pitch',
    '変わらないのは <b>悪い人</b>。変わるのはお金の種類だけ。': 'What never changes is <b>the crook</b>. Only the kind of money changes.',
    '実際は：この言葉が出たら要注意': 'The truth: phrases that should set off alarms',
    '勧誘の文句がランダムに出てくる。「詐欺の手口」か「大丈夫そう」か、見分けてみよう。全5問。': 'Sales pitches appear at random. Is it a scam pitch or a safe one? Try to spot the difference — 5 rounds.',
    '詐欺の手口': 'Scam pitch',
    '大丈夫そう': 'Sounds safe',
    '次の文句へ': 'Next pitch',
    'ビットコイン以前に、詐欺の手口そのものを見分ける目が効く。': 'Before Bitcoin even enters the picture, an eye for scam pitches themselves is what protects you.',
    '次の誤解：会社とCEOがいる →': 'Next: A company and a CEO →',

    /* ===== ceo ===== */
    'ビットコインってどこの会社がやってるの？：なんか よくわからんけど こわい ビットコイン': "So which company runs Bitcoin? | I don't really get it, but it's scary: Bitcoin",
    'ビットコインって<br>どこの会社がやってるの？': 'So which company<br>runs Bitcoin?',
    '会社も社長もいない。<br>運営している「誰か」が存在しない': 'There is no company, and no CEO.<br>No "someone" is running it',
    '会社も社長もいない。運営している「誰か」が存在しない': 'There is no company, and no CEO. No "someone" is running it',
    'ふつうのサービスには必ず運営会社がある。アプリを作った会社、困ったときの窓口、責任者。だからビットコインにも「やってる会社」と「社長」がいるはず、と思ってしまう。': 'Every normal service has a company behind it — the company that made the app, a support desk, someone in charge. So we assume Bitcoin must have a "company running it" and a "CEO" too.',
    'ニュース番組のテロップ「“ビットコイン” 元CEOを逮捕」': 'A TV news banner: "Former CEO of \'Bitcoin\' arrested"',
    '実際に2015年に放送されたテロップ。このとき逮捕されたのは取引所マウントゴックスの社長マルク・カルプレスで、ビットコインの「社長」ではない。': 'This banner actually aired in 2015. The man arrested was Marc Karpelès, president of the Mt. Gox exchange — not a "CEO of Bitcoin".',
    '見出しクイズ': 'Headline quiz',
    '2015年の逮捕を伝える見出し。正確なのはどれ？ タップして選んでみよう。': 'Headlines reported the 2015 arrest. Which one is accurate? Tap to choose.',
    '「ビットコインの元CEOを逮捕」': '"Former CEO of Bitcoin arrested"',
    '「取引所マウントゴックスの社長を逮捕」': '"President of the Mt. Gox exchange arrested"',
    '「ビットコインの社長、ついに逮捕」': '"Bitcoin president finally arrested"',
    'もう一度（順番が変わる）': 'Try again (order shuffled)',
    '実際は：会社情報をさがしてみる': 'The truth: look up the company info',
    '「ビットコイン株式会社」の会社概要を、いくら調べても出てこない。': 'Search all you want — a company profile for "Bitcoin Inc." never turns up.',
    '社名': 'Company name',
    '代表者（CEO）': 'Representative (CEO)',
    '本社': 'Head office',
    'お問い合わせ窓口': 'Support desk',
    'ルールを変えられる人': 'Who can change the rules',
    '<s>ビットコイン株式会社？</s> → ありません': "<s>Bitcoin Inc.?</s> → Doesn't exist",
    '<s>？？？</s> → いません': '<s>???</s> → There is none',
    '<s>？？？</s> → ありません': "<s>???</s> → Doesn't exist",
    '<s>サポートセンター？</s> → ありません': "<s>A support center?</s> → Doesn't exist",
    '<s>運営チーム？</s> → いません': '<s>An operations team?</s> → There is none',
    'どこをどう探しても、出てこない。運営する会社そのものがないから。': "Look anywhere you like — it isn't there, because there is no operating company at all.",
    '実際は：中心のないネットワーク': 'The truth: a network with no center',
    '動かしているのは世界中の参加者みんな。真ん中に立つ「誰か」はいない。': 'The ones running it are the participants all over the world. Nobody stands in the middle.',
    'ふつうのサービス': 'A normal service',
    '社長': 'CEO',
    '会社': 'Company',
    '利用者': 'Users',
    'トップの判断で止まる・変わる': "Stops or changes at the top's say-so",
    '全員が対等。止める人もいない': 'Everyone is equal. No one can stop it',
    '※ 取引所やウォレットのアプリには会社がある。でもそれは「ビットコインを使う道具」の会社で、ビットコイン自体の運営ではない。': 'Note: exchanges and wallet apps do have companies. But those companies make tools that use Bitcoin — they do not operate Bitcoin itself.',
    '実際は：「できること」にも限界がある': 'The truth: even the people involved have limits',
    '関わる人それぞれに、できることはある。でも、ビットコイン自体を支配する力は、誰にもない。': 'Each person involved can do some things. But nobody has the power to control Bitcoin itself.',
    'できる': 'Can do',
    'できない': "Can't do",
    '開発者: 新しいコードを「提案」する（使うかどうかは各自が選ぶ）': 'Developers: propose new code (whether to use it is up to each person)',
    '政府: 取引所などを規制する': 'Governments: regulate exchanges and the like',
    '大口の保有者: コインを持つ・売買する': 'Big holders: hold and trade coins',
    '発行上限などのルールを無理やり変える': 'Force changes to rules like the supply cap',
    'ネットワークを止める': 'Stop the network',
    'コインを持っているだけで支配する': 'Control it just by holding coins',
    '世界中の何万ものノードが、それぞれ自分でルールをチェックしている。だから、誰か一人の思いどおりにはならない。': "Tens of thousands of nodes around the world each check the rules for themselves. That's why no single person gets their way.",
    'ビットコインに、会社も社長も、電話窓口もない': 'Bitcoin has no company, no CEO, and no phone desk',
    '← 前の誤解：詐欺？': '← Previous: A scam?',
    '次の誤解：価格は誰かが決めている →': 'Next: Someone sets the price →',

    /* ===== price ===== */
    'ビットコインの値段って誰かが決めてるんでしょ？：なんか よくわからんけど こわい ビットコイン': "Someone sets Bitcoin's price, right? | I don't really get it, but it's scary: Bitcoin",
    'ビットコインの値段って<br>誰かが決めてるんでしょ？': 'Does someone<br>set Bitcoin\'s price?',
    '決める人はいない。<br>買いたい人と売りたい人の希望がぶつかった場所が価格': 'Nobody sets it.<br>The price forms where buyers and sellers meet',
    '決める人はいない。買いたい人と売りたい人の希望がぶつかった場所が価格': 'Nobody sets it. The price forms where the wishes of buyers and sellers collide',
    'お店の商品には値札があって、決めた人がいる。チャートに「いまの価格」が表示されると、ビットコインにも値段を決めている誰かがいそうに見える。': 'Shop products have price tags, put there by someone. When a chart shows "the current price", it starts to look as if someone must be setting Bitcoin\'s price too.',
    '実際は：希望価格のぶつかり合い': 'The truth: a clash of asking prices',
    '左は「この値段なら買いたい」、右は「この値段なら売りたい」。ぶつかった真ん中がその瞬間の価格になる。あなたもボタンを押して、売り買いに参加してみよう。': 'On the left, "I\'d buy at this price". On the right, "I\'d sell at this price". Where they collide in the middle becomes the price at that moment. Press the buttons and join the trading yourself.',
    '買いたい人': 'Buyers',
    '売りたい人': 'Sellers',
    '1,498万円': '¥14.98M',
    '1,499万円': '¥14.99M',
    '1,500万円': '¥15.00M',
    '1,501万円': '¥15.01M',
    '1,502万円': '¥15.02M',
    '1,503万円': '¥15.03M',
    '1,504万円': '¥15.04M',
    '1,505万円': '¥15.05M',
    'いまの価格': 'Current price',
    '円 / BTC（イメージ）': 'JPY / BTC (illustrative)',
    '買ってみる': 'Try buying',
    '売ってみる': 'Try selling',
    '価格を決めている人は、どこにもいない。だからこそ、世界中の取引で24時間動き続ける。': "There is nobody, anywhere, setting the price. That's exactly why it keeps moving, 24 hours a day, in trading around the world.",
    '価格は誰かが決めるものじゃなく、買いたい人と売りたい人のぶつかり合いで生まれる': "Price isn't set by anyone — it's born from the clash between people who want to buy and people who want to sell",
    '← 前の誤解：会社とCEOがいる': '← Previous: A company and a CEO',
    '次の誤解：手数料 →': 'Next: Fees →',

    /* ===== fee ===== */
    'ビットコインの送金手数料って高いよね？：なんか よくわからんけど こわい ビットコイン': "Bitcoin transfer fees are expensive, right? | I don't really get it, but it's scary: Bitcoin",
    'ビットコインの送金手数料って<br>高いよね？': 'Bitcoin transfer fees<br>are expensive, right?',
    '高いのは取引所の料金設定。<br>本物の送金手数料は別物で、混雑しだいで変わる': "What's expensive is the exchange's pricing.<br>The real transfer fee is a different thing, and it changes with congestion",
    '高いのは取引所の料金設定。本物の送金手数料は別物で、混雑しだいで変わる': "What's expensive is the exchange's pricing. The real transfer fee is a different thing, and it changes with congestion",
    '取引所で出金すると、明細に「手数料 ○○円」と出る。払う場面がそこしかないから、その全部がビットコインの手数料だと思ってしまう。': 'When you withdraw from an exchange, the statement shows "Fee: ¥○○". Since that\'s the only place you ever pay, it\'s easy to think all of it is Bitcoin\'s fee.',
    '実際は：レシートを比べてみる': 'The truth: compare the receipts',
    'あなたが払っているのは左。本物の送金手数料は右。別々のもの。': "What you're paying is on the left. The real transfer fee is on the right. Two different things.",
    '取引所のレシート': 'The exchange receipt',
    '出金する額': 'Amount withdrawn',
    '出金手数料': 'Withdrawal fee',
    '手数料の決め方': 'How the fee is set',
    '固定（いつも同じ）': 'Fixed (always the same)',
    '← これは<b>取引所の料金設定</b><br>お店が決めた値段': "← This is <b>the exchange's pricing</b><br>a price the shop decided",
    '本物の送金レシート': 'The real transfer receipt',
    '送る額': 'Amount sent',
    '送金手数料': 'Transfer fee',
    '混雑しだい': 'Depends on congestion',
    '変動（空いていれば安い）': 'Varies (cheap when quiet)',
    '← これは<b>ネットワークの手数料</b><br>たいてい、左よりずっと安い': "← This is <b>the network fee</b><br>usually far cheaper than the left",
    '実際は：送ってみると違いが見える': 'The truth: send it and see the difference',
    '取引所の出金手数料は、金額にかかわらず固定。本物の送金手数料は混雑しだいで変わる。送る額を変えて、両方のやり方で送ってみよう。': 'An exchange withdrawal fee is fixed, whatever the amount. The real transfer fee changes with congestion. Change the amount and try sending both ways.',
    '送る額:': 'Amount to send:',
    '送る額': 'Amount to send',
    '取引所から出金する': 'Withdraw from an exchange',
    '自分で送金する': 'Send it myself',
    '待てる（安く送る）': 'I can wait (send it cheap)',
    '急ぐ（高くても速く）': 'In a hurry (fast, even if pricier)',
    '送ってみる': 'Try sending',
    '送った額': 'Amount sent',
    '手数料': 'Fee',
    '相手に届く額': 'Amount received',
    '金額と手数料はイメージです。取引所の出金手数料は 0.0005 BTC（1BTC=1,500万円なら7,500円）として計算しています。': 'Amounts and fees are illustrative. The exchange withdrawal fee is calculated as 0.0005 BTC (¥7,500 if 1 BTC = ¥15,000,000).',
    '実際は：取引所は「まとめ送り」している': 'The truth: exchanges batch their sends',
    '取引所はたくさんの人の出金を1回の送金にまとめている。だから本物の手数料は利用者みんなで割り勘になる。': "An exchange bundles many people's withdrawals into a single transfer. So the real fee gets split among all the users.",
    '1回の送金<br><span style="font-weight:400;font-size:12px">手数料は1回分だけ</span>': 'One transfer<br><span style="font-weight:400;font-size:12px">only one fee</span>',
    'それでも出金手数料が高いのはネットワークのせいではなく取引所の料金設定。': "If the withdrawal fee is still high, that's not the network's fault — it's the exchange's pricing.",
    '高いのは取引所の料金設定。ビットコイン自体の手数料は別物で、混雑しだいで変わる': "What's expensive is the exchange's pricing. Bitcoin's own fee is a different thing, and it changes with congestion",
    '← 前の誤解：価格は誰かが決めている': '← Previous: Someone sets the price',
    '次の誤解：丸ごと買わないと買えない →': "Next: Can't buy without a whole coin →",

    /* ===== satoshi ===== */
    '1ビットコインって何百万円もするんでしょ？ 買えないよ：なんか よくわからんけど こわい ビットコイン': "A bitcoin costs millions of yen, right? I can't buy that | I don't really get it, but it's scary: Bitcoin",
    '1ビットコインって何百万円も<br>するんでしょ？ 買えないよ': "A single bitcoin costs<br>millions of yen, right? No way I can buy that",
    '丸ごと買わなくていい。<br>0.00000001（1 satoshi）から、100円分でも買える': "You don't have to buy a whole one.<br>You can buy from 0.00000001 (1 satoshi) — even ¥100 worth",
    '丸ごと買わなくていい。0.00000001（1 satoshi）から、100円分でも買える': "You don't have to buy a whole one. You can buy from 0.00000001 (1 satoshi) — even ¥100 worth",
    'ニュースはいつも「1ビットコイン＝○○万円」と単価だけを言う。だから「買うなら最低でもその金額が必要」に聞こえる。': 'The news always quotes just the unit price: "1 bitcoin = ¥○○". So it sounds like you need at least that much to buy any.',
    '実際は：ピザと同じで、一切れから買える': 'The truth: like pizza, you can buy a single slice',
    '1ホール買わなくても、ピザは一切れで買える。ビットコインも同じで、細かく割って買える。': "You don't buy a whole pizza — you buy a slice. Bitcoin is the same: you can buy it in small pieces.",
    'ホール': 'Whole',
    '半分': 'Half',
    '4切れ': '4 slices',
    '100万分の1': 'One millionth',
    '1 satoshi': '1 satoshi',
    'いちばん小さい単位は 1 satoshi（0.00000001 BTC）。1 BTC は 1億 satoshi に割れる。': 'The smallest unit is 1 satoshi (0.00000001 BTC). 1 BTC splits into 100 million satoshi.',
    '実際は：100円分でも買える': 'The truth: you can buy even ¥100 worth',
    '多くの取引所では数百円分から購入できる（最低額は取引所による）。': 'At many exchanges you can buy from just a few hundred yen (the minimum depends on the exchange).',
    '買う金額:': 'Amount to buy:',
    '買う金額': 'Amount to buy',
    '買える量:': 'You get:',
    '1BTC = 1,500万円として計算（イメージ）。量は少なくても、れっきとしたビットコイン。値動きの割合は丸ごと買った場合と同じ。': 'Calculated at 1 BTC = ¥15,000,000 (illustrative). A small amount is still real bitcoin, and its percentage moves match buying a whole coin.',
    'ビットコインはピザと同じ。1ホール買わなくても、一切れから買える': "Bitcoin is like pizza. You don't have to buy the whole pie — you can start with one slice",
    '← 前の誤解：手数料': '← Previous: Fees',
    '次の誤解：ハッキング →': 'Next: Hacking →',

    /* ===== hack ===== */
    'ビットコインってハッキングされて盗まれたんでしょ？：なんか よくわからんけど こわい ビットコイン': "Bitcoin got hacked and stolen, right? | I don't really get it, but it's scary: Bitcoin",
    'ビットコインって<br>ハッキングされて盗まれたんでしょ？': 'Bitcoin got hacked<br>and stolen, right?',
    '盗まれたのは取引所の金庫の中身。<br>ビットコインの台帳そのものは2009年から壊れていない': "What was stolen was the contents of exchanges' vaults.<br>Bitcoin's ledger itself has never been broken since 2009",
    '盗まれたのは取引所の金庫の中身。ビットコインの台帳そのものは2009年から壊れていない': "What was stolen was the contents of exchanges' vaults. Bitcoin's ledger itself has never been broken since 2009",
    'ニュースは「ビットコイン○億円が流出」と書く。すると、ビットコインの仕組み自体が破られて盗まれたように聞こえる。': 'The news writes "¥○○ of bitcoin leaked out". That makes it sound as if Bitcoin\'s system itself was broken into and robbed.',
    '「': '"',
    'ビットコインがハッキング': 'Bitcoin was hacked',
    'された」': '"',
    '正しくは「取引所の金庫が破られた」': 'Correctly: "the exchange\'s vault was broken into"',
    '銀行に強盗が入っても、「円がハッキングされた」とは言わない。': 'When robbers hit a bank, nobody says "the yen was hacked".',
    '実際は：壊れたのは「金庫」、お金は無事': 'The truth: what broke was the "vault" — the money is fine',
    '事件のたびに破られたのは取引所（会社）が管理していた金庫と鍵。お金そのものの台帳は別の場所で動き続けている。': 'In every incident, what got broken into was the vault and keys managed by an exchange (a company). The ledger of the money itself keeps running elsewhere.',
    '取引所の金庫': 'The exchange vault',
    '事件で破られたのはいつもこちら。<br>管理していたのは「会社」。': 'This is what gets broken into in every incident.<br>And it was run by a "company".',
    '記録': 'Record',
    '新着': 'New',
    'ビットコインの台帳': "Bitcoin's ledger",
    '2009年から止まらずに記録が増え続け、<br>台帳そのものが壊れたことは一度もない。': 'Records have kept being added, non-stop, since 2009.<br>The ledger itself has never once been broken.',
    '実際は：台帳を書き換えてみる': 'The truth: try rewriting the ledger',
    'じゃあ、あなたが台帳の数字を書き換えたらどうなるか。自分の残高をこっそり増やして、ネットワークに送ってみよう。': 'So what happens if you rewrite the numbers in the ledger? Quietly bump up your own balance and send it to the network.',
    'あなたの写し': 'Your copy',
    '世界の写し A': 'World copy A',
    '世界の写し B': 'World copy B',
    'あなたの残高': 'Your balance',
    'ほかの人の残高': "Others' balances",
    '自分の残高を +10 BTC 書き換える': 'Rewrite my balance: +10 BTC',
    'この台帳をネットワークに送る': 'Send this ledger to the network',
    '不一致で却下': 'Rejected: mismatch',
    '却下された回数:': 'Times rejected:',
    '回。何度送っても、結果は同じ。': ' — and no matter how many times you send it, the result is the same.',
    '壊れたのはいつも取引所の金庫。ビットコインの台帳は一度も壊れていない': "What broke was always the exchange's vault. Bitcoin's ledger has never been broken, not once",
    '← 前の誤解：丸ごと買わないと買えない': "← Previous: Can't buy without a whole coin",
    '次の誤解：犯罪・匿名 →': 'Next: Crime & anonymity →',

    /* ===== crime ===== */
    'ビットコインって匿名で犯罪に使われるんでしょ？：なんか よくわからんけど こわい ビットコイン': "Bitcoin is anonymous and used for crime, right? | I don't really get it, but it's scary: Bitcoin",
    'ビットコインって匿名で<br>犯罪に使われるんでしょ？': 'Bitcoin is anonymous and<br>used for crime, right?',
    '匿名ではなく「仮名」。<br>取引は全部、公開の台帳に残るから、現金より足がつきやすい': 'Not anonymous — "pseudonymous".<br>Every transaction stays on a public ledger, so it\'s easier to trace than cash',
    '匿名ではなく「仮名」。取引は全部、公開の台帳に残るから、現金より足がつきやすい': 'Not anonymous — "pseudonymous". Every transaction stays on a public ledger, so it\'s easier to trace than cash',
    '「匿名通貨」という言葉や、事件で使われた話だけが広まる。本名が出てこない＝誰にも追えない、と思ってしまう。': 'Words like "anonymous currency" and stories of crimes are all that spread. No real names appear, so we assume nobody can trace it.',
    '実際は：台帳は全部公開されている': 'The truth: the ledger is completely public',
    'ビットコインの取引は世界中の誰でも見られる台帳に、消せない形で残り続ける。': "Bitcoin transactions stay forever, in a form that can't be erased, on a ledger anyone in the world can look at.",
    '取引所': 'Exchange',
    '名前は出ない「仮名」制。でも、お金の流れは全部つながって見えている。': 'A "pseudonym" system — no names appear. But the flow of money is all connected, in plain sight.',
    '実際は：足跡が消えるのは、現金の方': 'The truth: the trail that vanishes belongs to cash',
    '手渡しの現金は誰から誰へ渡ったか記録が残らない。比べると、ビットコインの方がよっぽど足がつく。': 'Hand-to-hand cash leaves no record of who passed it to whom. Next to that, Bitcoin leaves a much clearer trail.',
    '現金': 'Cash',
    '記録なし・消えていく': 'No record — the trail fades',
    '全部残る・消せない': 'Everything stays — unerasable',
    'だから実際、犯罪に使われたビットコインは、追跡されて犯人が捕まるケースも多い。犯罪利用の割合自体も全体から見れば小さい。': 'In practice, bitcoin used in crime is often traced and the criminals caught. And the share of criminal use is small to begin with.',
    'ビットコインは匿名どころか、全部の取引が公開で残る。現金の方がよっぽど足がつかない': 'Far from anonymous — every Bitcoin transaction stays public. Cash is what really leaves no trail',
    '← 前の誤解：ハッキング': '← Previous: Hacking',
    '次の誤解：電気・環境 →': 'Next: Electricity & the environment →',

    /* ===== energy ===== */
    'ビットコインって電気の無駄遣いでしょ？：なんか よくわからんけど こわい ビットコイン': "Bitcoin is a waste of electricity, right? | I don't really get it, but it's scary: Bitcoin",
    'ビットコインって<br>電気の無駄遣いでしょ？': 'Bitcoin is just<br>a waste of electricity, right?',
    '電力は「守るためのコスト」。<br>たくさん必要だからこそ、攻撃が割に合わない': 'Electricity is the "cost of protection".<br>Because so much is needed, attacks don\'t pay off',
    '電力は「守るためのコスト」。たくさん必要だからこそ、攻撃が割に合わない': 'Electricity is the "cost of protection". Because so much is needed, attacks don\'t pay off',
    '「小さな国ひとつ分の電力を使っている」という数字だけが一人歩きする。何のために使っているのかは、あまり語られない。': 'The figure "it uses as much electricity as a small country" walks around on its own. What the electricity is for rarely gets mentioned.',
    '実際は：電力は「壁」の高さ': 'The truth: electricity is the height of the "wall"',
    'ビットコインの記録を書き換えるには、世界中の計算に真正面から勝たないといけない。その「勝てなさ」を作っているのが電力。壁が高いから、壊すのが割に合わない。': "To rewrite Bitcoin's records you have to beat the whole world's computing head-on. Electricity is what makes that unbeatable. The wall is high, so breaking through isn't worth it.",
    '電力の壁': 'The wall of electricity',
    '攻撃': 'Attack',
    '跳ね返される': 'Bounced off',
    '電気は「無駄に燃やしている」のではなく不正を割に合わなくするためのコストとして使われている。': "The electricity isn't being \"burned for nothing\" — it's spent as the cost that makes cheating not worth it.",
    '実際は：「どんな電力か」も一様じゃない': 'The truth: the kind of electricity varies, too',
    '使われている電力の中身も、全部が同じではない。割合は調査によって幅があるので、断定はしない。ただ「全部ムダ」でも「全部クリーン」でもない、というのが実情に近い。': "The electricity being used isn't all the same, either. Estimates vary by study, so no firm claims here. But \"all waste\" and \"all clean\" are both off — the truth is in between.",
    '<i style="background:#4a7a5c"></i>再生可能エネルギー': '<i style="background:#4a7a5c"></i>Renewable energy',
    '<i style="background:#f7931a"></i>余っていた電力の活用など': '<i style="background:#f7931a"></i>Using surplus power, etc.',
    '<i style="background:#999"></i>化石燃料を含むその他': '<i style="background:#999"></i>Other, incl. fossil fuels',
    '※ 割合はイメージ。マイニングは「電気が余っている場所・時間」に集まりやすい性質がある。一例として、ケンブリッジ大学の調査（2025年）では、再エネ・原子力など持続可能な電源が約52%という推定もある。': 'Note: the proportions are illustrative. Mining tends to gather where and when electricity is surplus. One example: a University of Cambridge study (2025) estimated that sustainable sources — renewables, nuclear and the like — make up about 52%.',
    '実際は：マイニング競争に参加してみる': 'The truth: join the mining race',
    'マイニングは、世界中の参加者との競争。先に計算を当てた人だけが記録を書けて、報酬をもらえる。あなたの計算力を決めて、参加してみよう。': 'Mining is a race against participants worldwide. Only the first to solve the puzzle gets to write the record and earn the reward. Set your hash power and join in.',
    'あなたの計算力（全体に占める割合）:': 'Your hash power (share of the whole):',
    'あなたの計算力の割合': 'Your share of hash power',
    '掘る（次のブロックに挑戦）': 'Mine (try for the next block)',
    '挑戦': 'Attempts',
    '当てた': 'Won',
    '使った電気': 'Electricity used',
    '回': '',
    '数字はイメージ。当たる確率は計算力の割合どおり。参加者が増えると難易度が上がって、同じ計算力では当たりにくくなる調整も入る。': 'Numbers are illustrative. Your chance of winning matches your share of hash power. And as more participants join, the difficulty rises so the same hash power wins less often — that adjustment is built in.',
    '電気は無駄に燃やしているんじゃなく不正を割に合わなくするための「壁」に使われている': "The electricity isn't burned for nothing — it's spent on the \"wall\" that makes cheating not worth it",
    '← 前の誤解：犯罪・匿名': '← Previous: Crime & anonymity',
    '次の誤解：政府が禁止 →': 'Next: A government ban →',

    /* ===== ban ===== */
    '国が禁止したら、ビットコインは終わりでしょ？：なんか よくわからんけど こわい ビットコイン': "If a country bans it, Bitcoin is finished, right? | I don't really get it, but it's scary: Bitcoin",
    '国が禁止したら、<br>ビットコインは終わりでしょ？': 'If a country bans it,<br>Bitcoin is finished, right?',
    '世界中で動く仕組みだから、一国では止められない。<br>実際に禁止した国でも消えていない': "Because it runs all over the world, one country can't stop it.<br>It didn't vanish even from the country that banned it",
    '世界中で動く仕組みだから、一国では止められない。実際に禁止した国でも消えていない': "Because it runs all over the world, one country can't stop it. It didn't vanish even from the country that banned it",
    'ふつうのサービスは国ごとに止められる。自分の国で使えなくなれば「終わり」に感じるのは自然なこと。': 'Normal services can be stopped country by country. If it becomes unusable in your country, feeling like "it\'s over" is only natural.',
    '実際は：世界中で動く仕組みは一国では止まらない': "The truth: a system running worldwide can't be stopped by one country",
    'ビットコインは特定の国のサーバーで動いているわけではない。世界中に散らばった参加者全員で動いている。': "Bitcoin doesn't run on servers in one particular country. It runs on all its participants, scattered across the world.",
    '世界中に広がる参加者の図': 'Diagram of participants spread across the world',
    'ネットワーク:': 'Network:',
    '稼働中（止まらない）': 'Running (unstoppable)',
    '・ 禁止した国': '· Countries that banned it',
    '一国が止めても、残りの世界で動き続ける。止められた場所の活動は、外へ移るだけ。': 'Even if one country stops it, it keeps running in the rest of the world. Activity in the stopped place simply moves out.',
    '実際は：禁止した国でも消えていない': "The truth: it didn't vanish from the country that banned it",
    '実際に大規模な禁止をした国でも、ビットコインは消えなかった。': "Even in the country that actually imposed a sweeping ban, Bitcoin didn't disappear.",
    '<b>2021年、中国がマイニングを全面禁止。</b><br> 採掘はアメリカなど国外へ移り、ネットワークは止まらず、その後も成長を続けた。「国が禁止したら終わり」には、ならなかった。': "<b>In 2021, China banned mining outright.</b><br> Mining moved abroad, to the US and elsewhere; the network never stopped and kept growing afterward. \"A government ban means the end\" — it didn't happen.",
    '一国が禁止しても、世界で動く仕組みは止まらない。活動が外へ移るだけ': "Even if one country bans it, a system running worldwide doesn't stop. The activity just moves outside",
    '← 前の誤解：電気・環境': '← Previous: Electricity & the environment',
    '次の誤解：量子コンピューター →': 'Next: Quantum computers →'
  };
  window.I18N_EN = EN;

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  var items = [];
  var titleItem = null;
  var descItem = null;
  var collected = false;

  function collect() {
    if (collected) return;
    collected = true;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      items.push({ el: el, kind: 'text', key: norm(el.textContent), orig: el.textContent });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-html]'), function (el) {
      items.push({ el: el, kind: 'html', key: norm(el.innerHTML), orig: el.innerHTML });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-label]'), function (el) {
      var attr = el.hasAttribute('aria-label') ? 'aria-label' : (el.hasAttribute('alt') ? 'alt' : null);
      if (!attr) return;
      items.push({ el: el, kind: 'attr', attr: attr, key: norm(el.getAttribute(attr) || ''), orig: el.getAttribute(attr) });
    });
    titleItem = { key: norm(document.title), orig: document.title };
    var md = document.querySelector('meta[name="description"]');
    if (md) descItem = { el: md, key: norm(md.getAttribute('content') || ''), orig: md.getAttribute('content') };
  }

  function syncToggle() {
    var btn = document.querySelector('.lang-toggle');
    if (!btn) return;
    btn.setAttribute('aria-label', window.LANG === 'en' ? 'Switch to Japanese' : '英語に切り替える');
    btn.setAttribute('aria-pressed', window.LANG === 'en' ? 'true' : 'false');
  }

  function apply(l) {
    collect();
    window.LANG = l;
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'en' ? 'en' : 'ja');
    items.forEach(function (it) {
      if (l === 'en') {
        var en = EN[it.key];
        if (en === undefined) {
          if (window.console && console.warn) console.warn('[i18n] missing translation: ' + it.key);
          return;
        }
        if (it.kind === 'text') it.el.textContent = en;
        else if (it.kind === 'html') it.el.innerHTML = en;
        else it.el.setAttribute(it.attr, en);
      } else {
        if (it.kind === 'text') it.el.textContent = it.orig;
        else if (it.kind === 'html') it.el.innerHTML = it.orig;
        else it.el.setAttribute(it.attr, it.orig);
      }
    });
    if (titleItem) document.title = l === 'en' ? (EN[titleItem.key] !== undefined ? EN[titleItem.key] : titleItem.orig) : titleItem.orig;
    if (descItem) descItem.el.setAttribute('content', l === 'en' ? (EN[descItem.key] !== undefined ? EN[descItem.key] : descItem.orig) : descItem.orig);
    syncToggle();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: l } }));
  }

  function bind() {
    var btn = document.querySelector('.lang-toggle');
    if (btn && !btn._i18nBound) {
      btn._i18nBound = true;
      btn.addEventListener('click', function () {
        var next = window.LANG === 'en' ? 'ja' : 'en';
        try { localStorage.setItem('lang', next); } catch (e) {}
        apply(next);
      });
    }
    syncToggle();
  }

  function init() {
    collect();
    bind();
    if (window.LANG === 'en') apply('en');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.setLang = apply;
})();
