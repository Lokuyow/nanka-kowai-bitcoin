(function(){
  var PRESETS = {
    stone: {want: 10, scarce: 20, belief: 5},
    gold: {want: 70, scarce: 65, belief: 80},
    btc: {want: 55, scarce: 85, belief: 60}
  };
  var EVENTS = [
    {text: '有名人が「これが好きだ」と紹介した。', textEn: 'A celebrity introduced it, saying "I love this".', d: {want: 20, belief: 30}},
    {text: '大量に見つかって、誰でも拾えるようになった。', textEn: 'A huge amount was found — now anyone can pick one up.', d: {scarce: -40}},
    {text: '使える場所が増えた。', textEn: 'More places accept it now.', d: {want: 25}},
    {text: '「あれはもう終わった」という空気が広がった。', textEn: 'A mood spread that "that thing is finished".', d: {belief: -35}},
    {text: '量に限りがあることが知られた。', textEn: 'People learned that the amount is limited.', d: {scarce: 25}}
  ];
  var item = 'stone';
  var slWant = document.getElementById('slWant');
  var slScarce = document.getElementById('slScarce');
  var slBelief = document.getElementById('slBelief');
  var meterFill = document.getElementById('meterFill');
  var meterNum = document.getElementById('meterNum');
  var labMsg = document.getElementById('labMsg');
  var evtMsg = document.getElementById('evtMsg');
  var itemBtns = document.querySelectorAll('[data-item]');
  var lastEvent = -1;
  var evtPair = ['', ''];
  function clamp(v){ return Math.max(0, Math.min(100, v)); }
  function rawScore(){
    return Math.round(Number(slWant.value) * 0.35 + Number(slScarce.value) * 0.30 + Number(slBelief.value) * 0.35);
  }
  function score(){
    var raw = rawScore();
    if (item === 'gold') return Math.max(raw, 16);
    if (item === 'btc' && Number(slBelief.value) === 0) return Math.min(raw, 8);
    return raw;
  }
  function message(s){
    if (item === 'gold' && rawScore() < 25) return L('信じる人が少なくても、材料や装飾としての使い道が下支えをして、価値はゼロにはならない。', 'Even with few believers, its uses as a material and for decoration support it — the value never hits zero.');
    if (item === 'btc' && Number(slBelief.value) === 0) return L('信じる人がいなくなると、ビットコインの価値は支えを失う。実物の使い道が裏側にないからだ。', 'When no one believes, Bitcoin loses the support for its value — there is no physical use behind it.');
    if (item === 'stone' && s >= 70) return L('石ころにまで値段がついた。昔の貝や石のお金で起こっていたことと、同じことが起きている。', 'Even a stone got a price. The same thing that happened with old shell and stone money is happening.');
    if (s < 25) return L('ほとんど値段がつかない。ただのものとして扱われている。', 'Almost no price. It is treated as just a thing.');
    if (s < 60) return L('一部の人の間では、値段がつくようになってきた。', 'Among some people, it has started to carry a price.');
    return L('欲しがる人と信じる人がそろって、立派な値段がついている。', 'With people who want it and people who believe in it, it carries a solid price.');
  }
  function render(){
    var s = score();
    meterFill.style.width = s + '%';
    meterNum.textContent = s;
    labMsg.textContent = message(s);
  }
  function setItem(name){
    item = name;
    var p = PRESETS[name];
    slWant.value = p.want; slScarce.value = p.scarce; slBelief.value = p.belief;
    evtMsg.textContent = ''; evtPair = ['', ''];
    itemBtns.forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-item') === name); });
    render();
  }
  [slWant, slScarce, slBelief].forEach(function(sl){
    sl.addEventListener('input', function(){ evtMsg.textContent = ''; evtPair = ['', '']; render(); });
  });
  itemBtns.forEach(function(b){
    b.addEventListener('click', function(){ setItem(b.getAttribute('data-item')); });
  });
  document.getElementById('btnEvent').addEventListener('click', function(){
    var i;
    do { i = Math.floor(Math.random() * EVENTS.length); } while (i === lastEvent);
    lastEvent = i;
    var d = EVENTS[i].d;
    if (d.want) slWant.value = clamp(Number(slWant.value) + d.want);
    if (d.scarce) slScarce.value = clamp(Number(slScarce.value) + d.scarce);
    if (d.belief) slBelief.value = clamp(Number(slBelief.value) + d.belief);
    evtPair = ['事件：' + EVENTS[i].text, 'Event: ' + EVENTS[i].textEn];
    evtMsg.textContent = L(evtPair[0], evtPair[1]);
    render();
  });
  document.addEventListener('langchange', function(){
    if (evtPair[0]) evtMsg.textContent = L(evtPair[0], evtPair[1]);
    render();
  });
  setItem('stone');
})();
