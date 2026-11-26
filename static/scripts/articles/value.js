(function(){
  var PRESETS = {
    stone: {want: 10, scarce: 20},
    gold: {want: 70, scarce: 65},
    btc: {want: 55, scarce: 85}
  };
  var EVENTS = [
    {text: '有名人が「これが好きだ」と紹介した。', textEn: 'A celebrity introduced it, saying "I love this".', d: {want: 25}},
    {text: '出回る量が増えて、手に入りやすくなった。', textEn: 'More became available, making it easier to get.', d: {scarce: -40}},
    {text: '使える場所が増えた。', textEn: 'More places accept it now.', d: {want: 25}},
    {text: '「あれはもう終わった」という空気が広がった。', textEn: 'A mood spread that "that thing is finished".', d: {want: -35}},
    {text: '市場に出回る量が減った。', textEn: 'Less of it became available on the market.', d: {scarce: 25}}
  ];
  var item = 'stone';
  var slWant = document.getElementById('slWant');
  var slScarce = document.getElementById('slScarce');
  var sliders = [slWant, slScarce];
  var meterFill = document.getElementById('meterFill');
  var meterNum = document.getElementById('meterNum');
  var labMsg = document.getElementById('labMsg');
  var evtMsg = document.getElementById('evtMsg');
  var itemBtns = document.querySelectorAll('[data-item]');
  var lastEvent = -1;
  var evtPair = ['', ''];
  function clamp(v){ return Math.max(0, Math.min(100, v)); }
  function score(){
    // 希少さは買いたい人がいるときだけ値段を押し上げる。
    return Math.round(slWant.valueAsNumber * (0.7 + 0.3 * slScarce.valueAsNumber / 100));
  }
  function message(s){
    if (slWant.valueAsNumber === 0) return L('買いたい人がいないと、珍しくても値段はつかない。', 'Even something scarce commands no price if nobody wants to buy it.');
    if (item === 'stone' && s >= 70) return L('石ころにまで値段がついた。昔の貝や石のお金で起こっていたことと、同じことが起きている。', 'Even a stone got a price. The same thing that happened with old shell and stone money is happening.');
    if (s < 25) return L('ほとんど値段がつかない。ただのものとして扱われている。', 'Almost no price. It is treated as just a thing.');
    if (s < 60) return L('一部の人の間では、値段がつくようになってきた。', 'Among some people, it has started to carry a price.');
    return L('買いたい人が多く、高い値段がついている。', 'Many people want to buy it, so it commands a high price.');
  }
  function render(){
    var s = score();
    meterFill.style.width = s + '%';
    meterNum.textContent = s;
    labMsg.textContent = message(s);
    sliders.forEach(function(sl){ window.updateRangeFill?.(sl); });
  }
  function setItem(name){
    item = name;
    var p = PRESETS[name];
    slWant.value = p.want; slScarce.value = p.scarce;
    evtMsg.textContent = ''; evtPair = ['', ''];
    itemBtns.forEach(function(b){ var on = b.getAttribute('data-item') === name; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    render();
  }
  sliders.forEach(function(sl){
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
