(function(){
  var ISSUERS = {
    chief: {reflect: '助けたいときに動ける作り手は心強い。でも、その力は値段の安定と引き換えだった。', reflectEn: 'An issuer who can act when help is needed is reassuring. But that power came at the cost of price stability.', years: [
      {text: '豊作の年。村長は橋を直すため、お金を多めに作って配った。橋は直ったが、物の値段が少しずつ上がり始めた。', textEn: 'A year of good harvest. The chief made extra money and handed it out to fix the bridge. The bridge got fixed, but prices began to creep up.', tag: 'mix'},
      [{text: '村長が代替わりした。新村長は「古いお金は使えない」と言い出し、村は大騒ぎになった。', textEn: 'The chief was replaced. The new chief declared the old money unusable, and the village fell into an uproar.', tag: 'bad'},
       {text: '村長が代替わりしたが、お金の決まりはそのまま引き継がれた。村は落ち着いていた。', textEn: 'The chief was replaced, but the rules of the money carried over as they were. The village stayed calm.', tag: 'good'}],
      {text: '困った家庭が出たとき、村長はお金を配って助けることができた。', textEn: 'When a family fell on hard times, the chief could hand out money and help them.', tag: 'good'}
    ]},
    merchant: {reflect: '民間の作り手は便利で、競争も生まれる。でも、信用が崩れたときの受け止め先がない。', reflectEn: 'A private issuer is convenient, and competition arises. But when trust collapses, there is no one to catch it.', years: [
      {text: '両替商のお金は使いやすく、村の店はどこでも受け取るようになった。', textEn: 'The moneychanger\'s money was easy to use, and every shop in the village came to accept it.', tag: 'good'},
      [{text: '両替商が夜逃げした。持っていたお金はただの紙になった。', textEn: 'The moneychanger fled in the night. The money people held became mere paper.', tag: 'bad'},
       {text: '両替商が店をたたむことになったが、次の両替商が引き継いで、お金はそのまま使えた。', textEn: 'The moneychanger closed shop, but the next moneychanger took over, and the money could be used as-is.', tag: 'good'}],
      {text: '別の両替商も店を出し、競い合って手数料が下がった。', textEn: 'Another moneychanger opened shop too, and competing fees came down.', tag: 'good'}
    ]},
    none: {reflect: '誰の気分でも変わらない安心感はある。でも、困ったときに調整できる人もいない。', reflectEn: 'There is comfort in money that no one\'s mood can change. But there is also no one who can adjust it in hard times.', years: [
      {text: '最初は不便だったが、量の決まったお金を皆が使うようになった。発行のルールは同じでも、品物の値段はそのときの売り買いで変わった。', textEn: 'It was inconvenient at first, but everyone came to use the money with a fixed amount. Issuance followed the same rule, while prices still changed with buying and selling.', tag: 'mix'},
      [{text: '隣の村でも同じお金が使えた。村と村の境を越えて回り始めた。', textEn: 'The same money could be used in the next village. It began to circulate across village borders.', tag: 'good'},
       {text: '隣の村では受け取ってもらえず、交換のたびに両替が要った。', textEn: 'The next village would not accept it, so every trade needed an exchange.', tag: 'bad'}],
      {text: '不作の年が来た。お金を新たに配ることはできず、村は備蓄や寄付でどう支えるかを話し合った。', textEn: 'A year of poor harvest came. The village could not issue extra money, so people discussed using reserves or donations to help.', tag: 'bad'}
    ]}
  };
  var TAGLABEL = {good: 'よかった', bad: '困った', mix: '両方'};
  var plan = null, idx = 0, good = 0, bad = 0;
  var yearList = document.getElementById('yearList');
  var vTally = document.getElementById('vTally');
  var vGood = document.getElementById('vGood');
  var vBad = document.getElementById('vBad');
  var vReflect = document.getElementById('vReflect');
  var btnYear = document.getElementById('btnYear');
  var btnRetryIssuer = document.getElementById('btnRetryIssuer');
  var issuerBtns = document.querySelectorAll('#issuerPick button');
  function resolve(years){
    return years.map(function(y){
      return Array.isArray(y) ? y[Math.floor(Math.random() * y.length)] : y;
    });
  }
  var TAGLABEL_EN = {good: 'Good', bad: 'Trouble', mix: 'Both'};
  function makeCard(y, i, animate){
    var div = document.createElement('div');
    div.className = 'evcard' + (animate ? ' rise' : '') + ' ' + y.tag;
    div.innerHTML = '<p class="et">' + L((i + 1) + '年目', 'Year ' + (i + 1)) +
      '<span class="tag ' + y.tag + '">' + L(TAGLABEL[y.tag], TAGLABEL_EN[y.tag]) + '</span></p>' +
      '<p class="eo">' + L(y.text, y.textEn) + '</p>';
    return div;
  }
  // まだ来ていない年は空の枠を置いて場所を取っておき、年が進んでもボタンの位置が動かないようにする。
  function makeSlot(i){
    var div = document.createElement('div');
    div.className = 'evcard slot';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = '<p class="et">' + L((i + 1) + '年目', 'Year ' + (i + 1)) + '</p><p class="eo">&nbsp;</p>';
    return div;
  }
  function reveal(){
    var y = plan.years[idx];
    if (y.tag === 'good' || y.tag === 'mix') good++;
    if (y.tag === 'bad' || y.tag === 'mix') bad++;
    yearList.replaceChild(makeCard(y, idx, true), yearList.children[idx]);
    vGood.textContent = good;
    vBad.textContent = bad;
    idx++;
    if (idx >= plan.years.length) {
      vReflect.textContent = L(plan.reflect, plan.reflectEn);
      btnYear.hidden = true;
      btnRetryIssuer.hidden = false;
    }
  }
  function renderYears(){
    if (!plan) return;
    yearList.innerHTML = '';
    for (var i = 0; i < plan.years.length; i++) yearList.appendChild(i < idx ? makeCard(plan.years[i], i, false) : makeSlot(i));
    if (idx >= plan.years.length) vReflect.textContent = L(plan.reflect, plan.reflectEn);
  }
  document.addEventListener('langchange', renderYears);
  function start(key){
    var src = ISSUERS[key];
    plan = {reflect: src.reflect, reflectEn: src.reflectEn, years: resolve(src.years)};
    idx = 0; good = 0; bad = 0;
    renderYears();
    vReflect.textContent = '';
    vTally.hidden = false;
    vGood.textContent = 0;
    vBad.textContent = 0;
    issuerBtns.forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-issuer') === key); });
    btnYear.hidden = false;
    btnRetryIssuer.hidden = true;
    reveal();
  }
  issuerBtns.forEach(function(b){
    b.addEventListener('click', function(){ start(b.getAttribute('data-issuer')); });
  });
  btnYear.addEventListener('click', function(){
    if (plan && idx < plan.years.length) reveal();
  });
  btnRetryIssuer.addEventListener('click', function(){
    plan = null;
    yearList.innerHTML = '';
    vReflect.textContent = '';
    vTally.hidden = true;
    issuerBtns.forEach(function(b){ b.classList.remove('on'); });
    btnYear.hidden = true;
    btnRetryIssuer.hidden = true;
  });
})();
