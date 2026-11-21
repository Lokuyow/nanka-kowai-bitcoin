export const BASE_PATH = '/nanka-kowai-bitcoin/';
export const SITE_TITLE = "なんか よくわからんけど こわい ビットコイン";
export const SITE_URL = 'https://lokuyow.github.io' + BASE_PATH;

export const HOME = {
  title: SITE_TITLE,
  description: "ニュースで見たイメージと、ほんとの姿。なんとなくの「こわい」を誤解ひとつずつほどいていく。",
  shareEn: { title: "I don't really get it, but it's scary: Bitcoin", text: "The image from the news, and what it really looks like. Untangling the vague 'scary' around Bitcoin, one misunderstanding at a time." }
};

export const LAYERS = [
  {
    number: 1,
    title: "名前はしってる",
    description: "価格やニュースの見出しから浮かぶ疑問",
    articles: [
      {
        slug: "scam",
        heading: "結局ビットコインって<br>詐欺なんじゃないの？",
        cardAnswer: "ビットコインを使った詐欺の手口を見分ける",
        description: "詐欺でよく使われる文句を、5問のクイズで見分ける。",
        shareEn: { title: "So Bitcoin is basically a scam, right?", text: "A five-question quiz on common warning signs in scams that use Bitcoin." }
      },
      {
        slug: "ceo",
        heading: "ビットコインって<br>どこの会社がやってるの？",
        cardAnswer: "世界中の参加者が動かしている",
        description: "ビットコインのネットワークは、世界中の参加者が動かしている。",
        shareEn: { title: "So which company runs Bitcoin?", text: "Participants around the world keep the Bitcoin network running." }
      },
      {
        slug: "price",
        heading: "ビットコインの値段って<br>誰かが決めてるんでしょ？",
        cardAnswer: "取引が成立した値段が価格になる",
        description: "売り手と買い手が合意した値段が、その取引の価格になる。",
        shareEn: { title: "Someone sets Bitcoin's price, right?", text: "A trade happens at a price a buyer and seller agree on." },
        liveData: true
      },
      {
        slug: "fee",
        heading: "ビットコインの送金手数料って<br>高いよね？",
        cardAnswer: "出金手数料と送金手数料は別々",
        description: "取引所の出金料金と、取引を記録するネットワークの手数料は別々に決まる。",
        shareEn: { title: "Bitcoin transfer fees are expensive, right?", text: "Exchange withdrawal fees and transaction network fees are set separately." },
        liveData: true
      },
      {
        slug: "satoshi",
        heading: "1ビットコインって何百万円も<br>するんでしょ？ 買えないよ",
        cardAnswer: "1 BTCより少ない量でも買える",
        description: "1 BTCを丸ごと買う必要はない。金額を決めて、その分だけ買える。",
        shareEn: { title: "A bitcoin costs tens of thousands of dollars, right? No way I can buy that", text: "You can buy a fraction of a bitcoin by choosing how much to spend." },
        liveData: true
      },
      {
        slug: "value",
        heading: "裏付けがないビットコインは<br>価値ゼロでしょ？",
        cardAnswer: "欲しい人がいれば市場で価格がつく",
        description: "金や円との交換保証がなくても、買い手と売り手がいれば価格がつく。",
        shareEn: { title: "With no backing, Bitcoin is worth zero, right?", text: "Buyers and sellers can give bitcoin a market price without a promise to redeem it for gold or yen." }
      }
    ]
  },
  {
    number: 2,
    title: "ニュースで見たよ",
    description: "ニュースを見て気になること",
    articles: [
      {
        slug: "hack",
        heading: "ビットコインって<br>ハッキングされて盗まれるんでしょ？",
        cardAnswer: "取引所が預かる資産は盗まれることがある",
        description: "取引所の資産管理と、台帳に送金を記録する仕組みは別々。",
        shareEn: { title: "Bitcoin can be hacked and stolen, right?", text: "Exchange custody and recording transfers on the ledger are separate." }
      },
      {
        slug: "crime",
        heading: "ビットコインは現金より<br>匿名で使えるの？",
        cardAnswer: "支払いをたどりにくいのは手渡しの現金",
        description: "手渡しの現金には公開の支払い記録が残らない。ビットコインは送金先と金額が公開台帳に残る。",
        shareEn: { title: "Is Bitcoin more anonymous than cash?", text: "Handing over cash leaves no public payment record. Bitcoin records the destination and amount on a public ledger." }
      },
      {
        slug: "energy",
        heading: "ビットコインって<br>電気の無駄遣いでしょ？",
        cardAnswer: "マイニングの計算が記録を守る",
        description: "電力を使って積み上げたマイニングの計算が、過去の取引を書き換えにくくする。",
        shareEn: { title: "Bitcoin is a waste of electricity, right?", text: "The work miners put in makes past transactions harder to rewrite." }
      },
      {
        slug: "ai",
        heading: "電力と計算力をAIに使われて<br>ビットコインは掘れなくなるんでしょ？",
        cardAnswer: "電力は競合しうる。難易度はあとで調整",
        description: "AIと採掘は同じ地域で電力を取り合うことがある。ビットコインは計算力の変化に合わせて難易度を調整する。",
        shareEn: { title: "If AI uses up the electricity and computing power, Bitcoin can't be mined anymore, right?", text: "AI and mining can compete for power in the same area. Bitcoin adjusts its mining difficulty as computing power changes." }
      },
      {
        slug: "ban",
        heading: "国が禁止したら、<br>ビットコインは終わりでしょ？",
        cardAnswer: "国内は規制できる。国外では続けられる",
        description: "国内の活動が規制されても、国外の参加者はネットワークを動かし続けられる。",
        shareEn: { title: "If a country bans it, Bitcoin is finished, right?", text: "A ban can restrict activity at home while participants abroad keep the network running." }
      },
      {
        slug: "tulip",
        heading: "チューリップバブルと同じで、<br>弾けるんでしょ？",
        cardAnswer: "ビットコインは暴落と回復を繰り返してきた",
        description: "球根の投機は1637年に崩れた。ビットコインは暴落と回復を繰り返してきた。",
        shareEn: { title: "It's like the tulip bubble — it'll pop, right?", text: "Tulip speculation collapsed in 1637. Bitcoin has seen repeated crashes and recoveries." }
      }
    ]
  },
  {
    number: 3,
    title: "ちょっと詳しいよ",
    description: "仕組みを知るうちに出てくる疑問",
    articles: [
      {
        slug: "quantum",
        heading: "量子コンピューターができたら、<br>ビットコインは終わりでしょ？",
        cardAnswer: "署名への脅威。移行方法を議論中",
        description: "十分に強い量子コンピューターは今の署名を破りうる。実現時期は分からず、移行方法が議論されている。",
        shareEn: { title: "Once quantum computers arrive, Bitcoin is done for, right?", text: "A powerful enough quantum computer could break current signatures. The timing is uncertain, and ways to migrate are being discussed." }
      },
      {
        slug: "51",
        heading: "51%攻撃されたら、<br>ビットコインは終わりなんでしょ？",
        cardAnswer: "妨害はできる。発行ルールは変えられない",
        description: "計算力の過半数があれば取引を妨害しやすくなるが、他人の資産を動かしたり、発行ルールを変えたりはできない。",
        shareEn: { title: "A 51% attack would finish Bitcoin, right?", text: "Majority mining power makes it easier to disrupt transactions. It cannot spend other people's funds or change the issuance rules." }
      },
      {
        slug: "reward",
        heading: "マイニング報酬がなくなったら<br>ビットコインは終わりでしょ？",
        cardAnswer: "新規発行が終わっても手数料は残る",
        description: "マイナーの収入は、ビットコインの新規発行分と手数料。新規発行が終わると手数料だけになる。",
        shareEn: { title: "If mining rewards run out, Bitcoin is finished, right?", text: "Miners earn newly issued bitcoin and transaction fees. After issuance ends, only fees remain." }
      },
      {
        slug: "limit",
        heading: "発行上限って<br>その気になれば変えられるんでしょ？",
        cardAnswer: "ノードが発行ルールをそれぞれ確かめる",
        description: "一人がソフトを書き換えても、ほかのノードが使うルールは変わらない。",
        shareEn: { title: "The supply cap can be changed whenever someone wants, right?", text: "Changing one copy of the software does not change the rules other nodes use." }
      },
      {
        slug: "infinite",
        heading: "小さく割れるなら、<br>上限なんてないじゃん？",
        cardAnswer: "切り分けても量は同じ",
        description: "1 BTCは1億 satoshiと同じ量。単位を細かくしても発行上限は変わらない。",
        shareEn: { title: "If it can be split into tiny pieces, there's no real cap, right?", text: "One bitcoin is the same amount as 100 million satoshis. Changing units does not change the issuance limit." }
      }
    ]
  },
  {
    number: 4,
    title: "そもそもお金って何？",
    description: "ビットコインをきっかけにお金について考える",
    articles: [
      {
        slug: "money",
        openQuestion: true,
        heading: "お金ってそもそも何？",
        cardAnswer: "支払う、値段を比べる、あとで使う",
        description: "お金には、支払う、値段を比べる、あとで使うという役割がある。",
        shareEn: { title: "What even is money, anyway?", text: "Money helps us pay, compare prices, and save for later." }
      },
      {
        slug: "freedom",
        openQuestion: true,
        heading: "管理する人がいないお金は<br>自由？ それとも危ない？",
        cardAnswer: "自分で送れる。鍵の管理も自分で",
        description: "自分で鍵を持てば銀行を通さず送れる。鍵を失ったときに再発行してくれる窓口はない。",
        shareEn: { title: "Money with no one in charge: freedom or danger?", text: "Holding your own keys lets you send without a bank. There is no service that can reissue lost keys." }
      },
      {
        slug: "fair",
        openQuestion: true,
        heading: "早く持った人が得をするのは、<br>ずるくない？",
        cardAnswer: "早く買う利点と、そのときのリスク",
        description: "先に知って買えた利点と、先に引き受けた値下がりのリスクをどう見る？",
        shareEn: { title: "Isn't it cheating when early holders profit?", text: "How do you weigh the advantage of buying early against the risk early buyers faced?" }
      },
      {
        slug: "death",
        openQuestion: true,
        heading: "自分が死んだら、<br>ビットコインはどうなる？",
        cardAnswer: "鍵や復元情報を引き継げるか",
        description: "自分で鍵を管理する場合、相続人が資産を動かすには鍵か復元情報が必要になる。",
        shareEn: { title: "If I die, what happens to my Bitcoin?", text: "If you hold your own keys, your heirs need them or enough information to recover them." }
      },
      {
        slug: "future",
        openQuestion: true,
        heading: "ビットコインが当たり前になったら、<br>社会はどうなる？",
        cardAnswer: "支払い方と値段の付け方を考える",
        description: "ビットコインが広く使える社会なら、あなたは支払いや貯金に何を選ぶ？",
        shareEn: { title: "If Bitcoin became ordinary, what would happen to society?", text: "If Bitcoin were widely accepted, what would you choose for payments and savings?" }
      },
      {
        slug: "nation",
        openQuestion: true,
        heading: "国が作らないお金って<br>ありなの？",
        cardAnswer: "江戸時代には商人が発行したお金もあった",
        description: "江戸時代には、幕府の貨幣と並んで藩札や商人の私札も使われた。",
        shareEn: { title: "Can money exist that no country makes?", text: "In Edo-period Japan, locally issued domain and merchant notes circulated alongside the shogunate's money." }
      }
    ]
  }
];

export const ARTICLES = LAYERS.flatMap(({ number: layer, articles }) =>
  articles.map((article) => ({
    ...article,
    layer,
    title: article.heading.replaceAll('<br>', '')
  }))
).map((article, index) => ({ ...article, number: index + 1 }));

export function articlePath(slug) {
  return BASE_PATH + slug + '/';
}
