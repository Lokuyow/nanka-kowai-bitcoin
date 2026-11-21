(function(){
  function buildStory(way){
    if (way === 'none') return {reflect: '誰にも知らせていなかったので、家族は復元できなかった。', reflectEn: 'No one had been told how to recover the wallet, so the family could not access it.', steps: [
      {text: '5年後：詐欺や盗難の被害に遭うことは一度もなかった。', textEn: 'Five years on: never once a victim of fraud or theft.'},
      {text: 'ある日、本人が亡くなった。', textEn: 'One day, the person died.'},
      {text: '誰も鍵にたどり着けない。コインは台帳に残ったまま、二度と動かせない。', textEn: 'No one can reach the key. The coins stay on the ledger, never to move again.', end: 'bad'}
    ]};
    if (way === 'env') {
      var found = Math.random() < 0.6;
      return {reflect: '見つかれば引き継げる。見つからなければ、残さなかったのと同じになる。', reflectEn: 'If it is found, it can be inherited. If not, it is the same as having left nothing.', steps: [
        {text: '5年後：金庫は無事で、封筒もそのまま残っていた。', textEn: 'Five years on: the safe was intact, and the envelope still there.'},
        {text: 'ある日、本人が亡くなった。', textEn: 'One day, the person died.'},
        found ? {text: '家族が封筒を見つけた。鍵を使ってコインを引き継ぐことができた。', textEn: 'The family found the envelope. Using the key, they could inherit the coins.', end: 'good'}
              : {text: '家族は金庫を整理したとき、封筒の意味に気づかず処分してしまった。鍵は失われた。', textEn: 'Tidying the safe, the family threw the envelope away without realizing what it meant. The key was lost.', end: 'bad'}
      ]};
    }
    if (way === 'split') {
      var kept = Math.random() < 0.5;
      return {reflect: 'この例では、二人が協力して初めて復元できる。片方の情報を失うと復元できない。', reflectEn: 'In this example, recovery needs information from both people. Losing either part prevents recovery.', steps: [
        kept ? {text: '5年後：2人ともメモを大切に保管していた。', textEn: 'Five years on: both of them had kept their notes safe.'}
             : {text: '5年後：片方の家族が引っ越しでメモを失くしてしまった。', textEn: 'Five years on: one family member had lost the note in a move.'},
        {text: 'ある日、本人が亡くなった。', textEn: 'One day, the person died.'},
        kept ? {text: '2人のメモを合わせると鍵がそろった。家族が引き継ぐことができた。', textEn: 'Putting the two notes together completed the key. The family could inherit.', end: 'good'}
             : {text: '片方のメモがないと鍵はそろわない。誰も開けられなかった。', textEn: 'Without one note, the key is incomplete. No one could open it.', end: 'bad'}
      ]};
    }
    var leaked = Math.random() < 0.5;
    if (leaked) return {reflect: '情報を共有すると家族は復元できる。情報が漏れる場所も増える。', reflectEn: 'Sharing the information lets your family recover the wallet. It also creates more places where the information might leak.', steps: [
      {text: '3年後：家族のスマホがウイルスに感染し、共有していた復元情報が漏れた。一部が知らないうちに送金されていた。', textEn: 'Three years on: a family member\'s phone was infected with a virus, and the shared recovery information leaked. Some of it was sent away without anyone noticing.'},
      {text: 'ある日、本人が亡くなった。', textEn: 'One day, the person died.'},
      {text: '残りは引き継げた。でも、生きている間の管理に代償があった。', textEn: 'The rest could be inherited. But there was a price for how it was kept during life.', end: 'bad'}
    ]};
    return {reflect: '情報を共有すると家族は復元できる。情報が漏れる場所も増える。', reflectEn: 'Sharing the information lets your family recover the wallet. It also creates more places where the information might leak.', steps: [
      {text: '5年後：何事もなく過ぎた。', textEn: 'Five years on: nothing happened.'},
      {text: 'ある日、本人が亡くなった。', textEn: 'One day, the person died.'},
      {text: '家族は必要な情報を使ってウォレットを復元できた。', textEn: 'The family used the information to recover the wallet.', end: 'good'}
    ]};
  }
  var story = null, idx = 0;
  var storyList = document.getElementById('storyList');
  var reflect = document.getElementById('reflect');
  var btnTime = document.getElementById('btnTime');
  var btnRetryWay = document.getElementById('btnRetryWay');
  var wayBtns = document.querySelectorAll('#wayPick button');
  function makeCard(s, animate){
    var div = document.createElement('div');
    div.className = 'stepcard' + (animate ? ' rise' : '') + (s.end ? ' end-' + s.end : '');
    div.textContent = L(s.text, s.textEn);
    return div;
  }
  function reveal(){
    var s = story.steps[idx];
    storyList.appendChild(makeCard(s, true));
    idx++;
    if (idx >= story.steps.length) {
      reflect.textContent = L(story.reflect, story.reflectEn);
      btnTime.hidden = true;
      btnRetryWay.hidden = false;
    }
  }
  function renderStory(){
    if (!story) return;
    storyList.innerHTML = '';
    for (var i = 0; i < idx; i++) storyList.appendChild(makeCard(story.steps[i], false));
    if (idx >= story.steps.length) reflect.textContent = L(story.reflect, story.reflectEn);
  }
  document.addEventListener('langchange', renderStory);
  function start(way){
    story = buildStory(way);
    idx = 0;
    storyList.innerHTML = '';
    reflect.textContent = '';
    wayBtns.forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-way') === way); });
    btnTime.hidden = false;
    btnRetryWay.hidden = true;
    reveal();
  }
  wayBtns.forEach(function(b){
    b.addEventListener('click', function(){ start(b.getAttribute('data-way')); });
  });
  btnTime.addEventListener('click', function(){
    if (story && idx < story.steps.length) reveal();
  });
  btnRetryWay.addEventListener('click', function(){
    story = null;
    storyList.innerHTML = '';
    reflect.textContent = '';
    wayBtns.forEach(function(b){ b.classList.remove('on'); });
    btnTime.hidden = true;
    btnRetryWay.hidden = true;
  });
})();
