var card = document.getElementById('swapCard');
  var btn = document.getElementById('swapBtn');
  var cap = document.getElementById('swapCaption');
  function renderSwap(){
    var on = card.classList.contains('swapped');
    btn.textContent = on ? L('元に戻す', 'Put it back') : L('言葉を足す', 'Add the words');
    cap.innerHTML = on
      ? L('ビットコインそのものが詐欺なのではなく、<b>ビットコインを利用した</b>詐欺だった。', 'It wasn\'t Bitcoin itself that was a scam — it was <b>a scam that used Bitcoin</b>.')
      : L('<b>ビットコイン</b>自体が詐欺？ それとも……？', 'Is <b>Bitcoin</b> itself the scam? Or…?');
  }
  btn.addEventListener('click', function(){
    card.classList.toggle('swapped');
    renderSwap();
  });
  // ---- 見分けるクイズ ----
  var POOL_SCAM = [
    {t: '「元本保証で、月利10%の投資です」', e: '"A guaranteed-principal investment paying 10% a month."', why: '元本保証と高い利回りの組み合わせは、詐欺の定番。本物の投資に「保証」はない。', ew: 'Guaranteed principal plus high returns is the classic scam combo. Real investments never come with a "guarantee".'},
    {t: '「今だけ限定。送ったビットコインが2倍になって戻ります」', e: '"Limited time only: send bitcoin and get double back."', why: '送ると2倍になって戻る仕組みは、存在しない。送ったお金は戻ってこない。', ew: 'There is no mechanism that doubles what you send. Money sent is gone for good.'},
    {t: '「有名な実業家も勧めている投資です。今すぐ登録してください」', e: '"A famous entrepreneur recommends this investment. Sign up now."', why: '有名人の名前や写真を勝手に使うのは、詐欺広告の典型。', ew: "Using a celebrity's name and photo without permission is a hallmark of scam ads."},
    {t: '「絶対に損はしません。参加者はみんな儲かっています」', e: '"You can\'t possibly lose. Everyone who joined is making money."', why: '「絶対」「みんな儲かっている」は、冷静さを奪うための言葉。', ew: '"Absolutely" and "everyone profits" are words designed to stop you from thinking.'},
    {t: '「税金の還付があります。手続きのために送金してください」', e: '"You have a tax refund. Please send a processing payment first."', why: '還付の手続きで送金を求めることはない。公的機関をかたる詐欺。', ew: 'Refunds never require you to send money first. This is impersonation of a public office.'}
  ];
  var POOL_OK = [
    {t: '「価格は大きく変動します。元本保証はありません」', e: '"Prices move a lot. Your principal is not guaranteed."', why: 'リスクを正直に書いている。保証しないのが、本物の投資の案内。', ew: 'It states the risk honestly. Not guaranteeing anything is what a real investment offer looks like.'},
    {t: '「まずは仕組みを自分で調べて、無理のない少額から始めてください」', e: '"Start by researching how it works yourself, and begin with a small amount you can afford."', why: '急がせず、自分で調べることを勧めている。', ew: "It doesn't rush you, and it tells you to do your own research."},
    {t: '「セミナーで仕組みを解説します。投資の勧誘はしません」', e: '"Our seminar explains how it works. We will not pitch any investment."', why: '勧誘しないことを先に言っている。', ew: 'It says up front that there will be no sales pitch.'},
    {t: '「手数料とリスクの説明を、必ず書面で確認してください」', e: '"Please always check the fees and risks in writing."', why: '書面での確認を促すのは、正規の案内の作法。', ew: 'Asking you to confirm things in writing is how legitimate providers operate.'}
  ];
  var quiz = [], qi = 0, score = 0, answered = false, lastSaid = null, finished = false;
  var qMsg = document.getElementById('qMsg');
  var qFeed = document.getElementById('qFeed');
  var qScore = document.getElementById('qScore');
  var qStamp = document.getElementById('qStamp');
  var qCard = document.getElementById('quizCard');
  var qNext = document.getElementById('qNext');
  var qBtns = document.querySelector('.qbtns');
  var qScamBtn = document.getElementById('qScam');
  var qOkBtn = document.getElementById('qOk');
  function clearMarks(){
    qScamBtn.classList.remove('picked', 'correct');
    qOkBtn.classList.remove('picked', 'correct');
    qBtns.classList.remove('done');
  }
  function qt(q){ return window.LANG === 'en' ? q.e : q.t; }
  function qw(q){ return window.LANG === 'en' ? q.ew : q.why; }
  function scoreLine(wrong){ return L('正解 <b>' + score + '</b> ・ 不正解 <b>' + wrong + '</b>', 'Right <b>' + score + '</b> · Wrong <b>' + wrong + '</b>'); }
  function shuffle(a){ for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function newGame(){
    quiz = shuffle(POOL_SCAM.slice()).slice(0, 3).concat(shuffle(POOL_OK.slice()).slice(0, 2));
    shuffle(quiz);
    qi = 0; score = 0; finished = false;
    renderQ();
  }
  function renderQ(){
    answered = false; lastSaid = null;
    clearMarks();
    qCard.classList.remove('stamped');
    qBtns.hidden = false;
    qNext.hidden = true;
    qMsg.textContent = qt(quiz[qi]);
    qFeed.textContent = L('第' + (qi + 1) + '問 / 5問。この文句、どう思う？', 'Pitch ' + (qi + 1) + ' of 5. What do you think?');
    qScore.innerHTML = scoreLine(qi - score);
  }
  function renderFeedback(){
    var q = quiz[qi];
    var right = lastSaid === q.scam;
    var ansName = q.scam ? L('詐欺の手口', 'Scam pitch') : L('大丈夫そう', 'Sounds safe');
    qStamp.classList.toggle('ok', right);
    qStamp.classList.toggle('ng', !right);
    qCard.classList.add('stamped');
    clearMarks();
    (lastSaid ? qScamBtn : qOkBtn).classList.add('picked');
    (q.scam ? qScamBtn : qOkBtn).classList.add('correct');
    qBtns.classList.add('done');
    qFeed.innerHTML = (right
      ? L('<b>正解。</b>これは「', '<b>Correct.</b> This one is "') + ansName + L('」。', '". ')
      : L('<b>残念。</b>正解は「', '<b>Not quite.</b> The answer is "') + ansName + L('」。', '". ')) + qw(q);
    qScore.innerHTML = scoreLine(qi + 1 - score);
    qNext.textContent = qi + 1 >= quiz.length ? L('結果を見る', 'See the result') : L('次の文句へ', 'Next pitch');
    qNext.hidden = false;
  }
  function renderResult(){
    clearMarks();
    qCard.classList.remove('stamped');
    qBtns.hidden = true;
    qMsg.textContent = score === 5 ? L('全問正解！', 'Perfect score!') : L('5問中 ' + score + '問 正解', score + ' out of 5 correct');
    qFeed.textContent = score === 5 ? L('見分ける目、ばっちり。その目があれば「ビットコイン詐欺」の見出しにも惑わされない。', 'Sharp eyes. With eyes like that, a "Bitcoin scam" headline won\'t fool you.')
      : score >= 3 ? L('怪しい文句の見分けは、だいたい付いている。「保証」「絶対」「今だけ」が出たら一歩引くのが合言葉。', 'You mostly have the knack. When "guaranteed", "absolutely" or "now only" shows up, step back — that\'s the rule.')
      : L('「保証します」「絶対儲かる」「今だけ」は危険信号。引っかかる前に、一歩引いて確かめよう。', '"Guaranteed", "can\'t lose" and "now only" are danger signs. Before you bite, step back and check.');
    qScore.innerHTML = '';
    qNext.textContent = L('もう一度あそぶ', 'Play again');
    qNext.hidden = false;
  }
  function answer(saidScam){
    if (answered) return;
    answered = true; lastSaid = saidScam;
    if (saidScam === quiz[qi].scam) score++;
    renderFeedback();
  }
  document.getElementById('qScam').addEventListener('click', function(){ answer(true); });
  document.getElementById('qOk').addEventListener('click', function(){ answer(false); });
  qNext.addEventListener('click', function(){
    if (finished) { newGame(); return; }
    qi++;
    if (qi >= quiz.length) { finished = true; renderResult(); return; }
    renderQ();
  });
  document.addEventListener('langchange', function(){
    renderSwap();
    if (finished) renderResult();
    else if (answered) renderFeedback();
    else if (quiz.length) { // re-render current question without resetting the answered state
      qMsg.textContent = qt(quiz[qi]);
      qFeed.textContent = L('第' + (qi + 1) + '問 / 5問。この文句、どう思う？', 'Pitch ' + (qi + 1) + ' of 5. What do you think?');
      qScore.innerHTML = scoreLine(qi - score);
    }
  });
  POOL_SCAM.forEach(function(q){ q.scam = true; });
  POOL_OK.forEach(function(q){ q.scam = false; });
  newGame();
