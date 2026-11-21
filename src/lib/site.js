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
        cardAnswer: "悪いのはビットコインを使った手口",
        description: "悪いのはビットコインを使った手口で、ビットコインそのものじゃない",
        shareEn: { title: "So Bitcoin is basically a scam, right?", text: "What's bad is the trick played using Bitcoin, not Bitcoin itself" }
      },
      {
        slug: "ceo",
        heading: "ビットコインって<br>どこの会社がやってるの？",
        cardAnswer: "会社も社長も存在しない",
        description: "会社も社長もいない。運営している「誰か」が存在しない",
        shareEn: { title: "So which company runs Bitcoin?", text: "There is no company, and no CEO. No \"someone\" is running it" }
      },
      {
        slug: "price",
        heading: "ビットコインの値段って<br>誰かが決めてるんでしょ？",
        cardAnswer: "買いたい人と売りたい人のぶつかり合い",
        description: "決める人はいない。買いたい人と売りたい人の希望がぶつかった場所が価格",
        shareEn: { title: "Someone sets Bitcoin's price, right?", text: "Nobody sets it. The price forms where the wishes of buyers and sellers collide" },
        liveData: true
      },
      {
        slug: "fee",
        heading: "ビットコインの送金手数料って<br>高いよね？",
        cardAnswer: "高いのは取引所の料金設定",
        description: "高いのは取引所の料金設定。本物の送金手数料は別のもので、混雑しだいで変わる",
        shareEn: { title: "Bitcoin transfer fees are expensive, right?", text: "What's expensive is the exchange's pricing. The real transfer fee is a different thing, and it changes with congestion" },
        liveData: true
      },
      {
        slug: "satoshi",
        heading: "1ビットコインって何百万円も<br>するんでしょ？ 買えないよ",
        cardAnswer: "ケーキと同じで、一切れから買える",
        description: "丸ごと買わなくていい。0.00000001（1 satoshi）から、100円分でも買える",
        shareEn: { title: "A bitcoin costs tens of thousands of dollars, right? No way I can buy that", text: "You don't have to buy a whole one. You can buy from 0.00000001 (1 satoshi) — even $1 worth" },
        liveData: true
      },
      {
        slug: "value",
        heading: "裏付けがないビットコインは<br>価値ゼロでしょ？",
        cardAnswer: "円も金も裏付けはない",
        description: "円にも金にも「裏付け」と呼べるものは実はない。価値は「欲しい・使えると思う人がいる」ことから生まれる",
        shareEn: { title: "With no backing, Bitcoin is worth zero, right?", text: "Neither the dollar nor gold really has anything you could call \"backing\". Value is born from there being people who want it and think it is usable" }
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
        cardAnswer: "壊れたのは取引所の金庫の方",
        description: "盗まれたのは取引所の金庫の中身。これらの事件でビットコインの台帳は書き換えられていない",
        shareEn: { title: "Bitcoin can be hacked and stolen, right?", text: "What was stolen was the contents of exchanges' vaults. These thefts did not alter the Bitcoin ledger" }
      },
      {
        slug: "crime",
        heading: "ビットコインって匿名で<br>犯罪に使われるんでしょ？",
        cardAnswer: "匿名ではなく仮名。全部公開で残る",
        description: "匿名ではなく「仮名」。取引は全部公開の台帳に残るから、現金より足がつきやすい",
        shareEn: { title: "Bitcoin is anonymous and used for crime, right?", text: "Not anonymous — \"pseudonymous\". Every transaction stays on a public ledger, so it is easier to trace than cash" }
      },
      {
        slug: "energy",
        heading: "ビットコインって<br>電気の無駄遣いでしょ？",
        cardAnswer: "電力は不正を防ぐ「壁」のコスト",
        description: "電力は「守るためのコスト」。たくさん必要だからこそ、攻撃が割に合わない",
        shareEn: { title: "Bitcoin is a waste of electricity, right?", text: "Electricity is the \"cost of protection\". Because so much is needed, attacks do not pay off" }
      },
      {
        slug: "ai",
        heading: "電力と計算力をAIに使われて<br>ビットコインは掘れなくなるんでしょ？",
        cardAnswer: "道具が違う。難易度の自己調整もある",
        description: "マイニングは専用機（ASIC）の仕事で、AIのGPUとは道具が違う。掘る人が減れば、難易度が下がる自己調整もある",
        shareEn: { title: "If AI uses up the electricity and computing power, Bitcoin can't be mined anymore, right?", text: "Mining is a job for dedicated machines (ASICs) — different tools from AI GPUs. And if miners leave, difficulty adjusts itself downward" }
      },
      {
        slug: "ban",
        heading: "国が禁止したら、<br>ビットコインは終わりでしょ？",
        cardAnswer: "一国では止められない",
        description: "世界中で動く仕組みだから、一国では止められない。実際に禁止した国でも消えていない",
        shareEn: { title: "If a country bans it, Bitcoin is finished, right?", text: "Because it runs all over the world, one country cannot stop it. It did not vanish even from the country that banned it" }
      },
      {
        slug: "tulip",
        heading: "チューリップバブルと同じで、<br>弾けるんでしょ？",
        cardAnswer: "何度も戻ってきた17年",
        description: "チューリップは一度弾けて終わった。ビットコインは大きく下げて「終わった」と言われるたびに戻ってきた",
        shareEn: { title: "It's like the tulip bubble — it'll pop, right?", text: "Tulips popped once and ended. Bitcoin has come back every time it fell hard and was declared finished" }
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
        cardAnswer: "脅威はずっと先。備える時間がある",
        description: "脅威になるのはずっと先。今の量子コンピューターでは歯が立たず、対策に移行する時間もある",
        shareEn: { title: "Once quantum computers arrive, Bitcoin is done for, right?", text: "The threat is far in the future. Today's quantum computers cannot touch it, and there is time to move to countermeasures" }
      },
      {
        slug: "51",
        heading: "51%攻撃されたら、<br>ビットコインは終わりなんでしょ？",
        cardAnswer: "できることは限られ、やる意味もない",
        description: "過半数を握っても、できることは限られている。しかもコストが膨大で、やる意味がほとんどない",
        shareEn: { title: "A 51% attack would finish Bitcoin, right?", text: "Even holding a majority, what you can do is limited. And the cost is enormous, so there is almost no point" }
      },
      {
        slug: "reward",
        heading: "マイニング報酬がなくなったら<br>ビットコインは終わりでしょ？",
        cardAnswer: "収入は報酬と手数料の2本立て",
        description: "マイナーの収入は「新しいコインの報酬」と「送金の手数料」の2本立て。報酬が細っても、手数料の柱が残る",
        shareEn: { title: "If mining rewards run out, Bitcoin is finished, right?", text: "Miner income stands on two pillars: the new coin reward and transaction fees. Even as the reward thins, the fee pillar remains" }
      },
      {
        slug: "limit",
        heading: "発行上限って<br>その気になれば変えられるんでしょ？",
        cardAnswer: "変えても誰もついてこない",
        description: "書き換えるのは誰でもできる。でも全員が受け入れなければ、それは「別のコイン」になるだけ",
        shareEn: { title: "The supply cap can be changed whenever someone wants, right?", text: "Anyone can rewrite it. But unless everyone accepts it, it just becomes \"a different coin\"" }
      },
      {
        slug: "infinite",
        heading: "小さく割れるなら、<br>上限なんてないじゃん？",
        cardAnswer: "割っても総量は同じ",
        description: "割るのは「発行」ではなく「切り分け」。総量は2,100万BTCのままで、1BTCを1億satoshiに切り分けただけ",
        shareEn: { title: "If it can be split into tiny pieces, there's no real cap, right?", text: "Splitting is not issuing — it is slicing. The total stays 21 million BTC; 1 BTC is just cut into 100 million satoshi" }
      }
    ]
  },
  {
    number: 4,
    title: "そもそもお金って何？",
    description: "ビットコインをきっかけに、お金について考える",
    articles: [
      {
        slug: "money",
        openQuestion: true,
        heading: "お金ってそもそも何？",
        cardAnswer: "なぜ紙や数字で物が買えるのか",
        description: "お金は「みんなが価値があると思っているもの」だとしたら、ビットコインはその新しい形かもしれないし、そうでないかもしれない。あなたはどう思う？",
        shareEn: { title: "What even is money, anyway?", text: "If money is \"something everyone thinks has value\", Bitcoin might be its new shape — or might not. What do you think?" }
      },
      {
        slug: "freedom",
        openQuestion: true,
        heading: "管理する人がいないお金は<br>自由？ それとも危ない？",
        cardAnswer: "止められない自由と、助けのない自己責任",
        description: "誰にも邪魔されないことは、誰にも助けてもらえないことと裏表だ。あなたはどちらを重く見る？",
        shareEn: { title: "Money with no one in charge: freedom or danger?", text: "Being disturbed by no one is the flip side of being helped by no one. Which weighs more for you?" }
      },
      {
        slug: "fair",
        openQuestion: true,
        heading: "早く持った人が得をするのは、<br>ずるくない？",
        cardAnswer: "先に持った人の得は、不公平か",
        description: "不公平に見えるのは結果だけを見たときで、同じ年月をリスクの側から見ると景色が変わる。あなたはどちらで見る？",
        shareEn: { title: "Isn't it cheating when early holders profit?", text: "It looks unfair when you see only the result; the same years look different from the side of risk. Which way do you see it?" }
      },
      {
        slug: "death",
        openQuestion: true,
        heading: "自分が死んだら、<br>ビットコインはどうなる？",
        cardAnswer: "鍵を残せるかどうかで変わる",
        description: "自分のものにできる強さは、引き継げなさと表裏一体だ。あなたなら、鍵を誰にどう残す？",
        shareEn: { title: "If I die, what happens to my Bitcoin?", text: "The strength of making it truly yours is two sides of a coin with being unable to pass it on. How would you leave your key, and to whom?" }
      },
      {
        slug: "future",
        openQuestion: true,
        heading: "ビットコインが当たり前になったら、<br>社会はどうなる？",
        cardAnswer: "送金も貯金も、意味が変わる",
        description: "お金の選択肢が増える社会は、便利な社会だろうか、それとも面倒な社会だろうか。あなたはどう思う？",
        shareEn: { title: "If Bitcoin became ordinary, what would happen to society?", text: "Would a society with more choices of money be a convenient society, or a troublesome one? What do you think?" }
      },
      {
        slug: "nation",
        openQuestion: true,
        heading: "国が作らないお金って<br>ありなの？",
        cardAnswer: "昔は国以外もお金を作っていた",
        description: "お金は国だけのものという感覚は近代になってできたものかもしれない。国の通貨と国の外のお金は、代わり同士なのか、並べて使うものなのか。あなたはどう思う？",
        shareEn: { title: "Can money exist that no country makes?", text: "The feeling that money belongs only to countries may itself be a modern invention. Are a national currency and money outside countries substitutes, or things to use side by side? What do you think?" }
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
