(function(){
  function buildStory(way){
    if (way === 'none') return {reflect: 'いちばん安全な残し方は、いちばん引き継げない残し方でもあった。', reflectEn: 'The safest way to leave it was also the way that could least be inherited.', steps: [
      {text: '5年後：詐欺や盗難の被害に遭うことは、一度もなかった。', textEn: 'Five years on: never once a victim of fraud or theft.'},
      {text: 'ある日、本人が亡くなった。', textEn: 'One day, the person died.'},
      {text: '誰も鍵にたどり着けない。コインは台帳に残ったまま、二度と動かせない。', textEn: 'No one can reach the key. The coins stay on the ledger, never to move again.', end: 'bad'}
    ]};
    if (way === 'env') {
      var found = Math.random() < 0.6;
      return {reflect: '見つかれば引き継げる。見つからなければ、残さなかったのと同じになる。', reflectEn: 'If it is found, it can be inherited. If not, it is the same as having left nothing.', steps: [
        {text: '5年後：金庫は無事で、封筒もそのまま残っていた。', textEn: 'Five years on: the safe was intact, and the envelope still there.'},
        {text: 'ある日、本人が亡くなった。', textEn: 'One day, the person died.'},
        found ? {text: '家族が封筒を見つけた。鍵を使って、コインを引き継ぐことができた。', textEn: 'The family found the envelope. Using the key, they could inherit the coins.', end: 'good'}
              : {text: '家族は金庫を整理したとき、封筒の意味に気づかず処分してしまった。鍵は失われた。', textEn: 'Tidying the safe, the family threw the envelope away without realizing what it meant. The key was lost.', end: 'bad'}
      ]};
    }
    if (way === 'split') {
      var kept = Math.random() < 0.5;
      return {reflect: '分けると盗まれにくい。でも、欠けると開けられない。', reflectEn: 'Splitting makes it hard to steal. But if a piece is missing, it cannot be opened.', steps: [
        kept ? {text: '5年後：2人とも、メモを大切に保管していた。', textEn: 'Five years on: both of them had kept their notes safe.'}
             : {text: '5年後：片方の家族が、引っ越しでメモを失くしてしまった。', textEn: 'Five years on: one family member had lost the note in a move.'},
        {text: 'ある日、本人が亡くなった。', textEn: 'One day, the person died.'},
        kept ? {text: '2人のメモを合わせると鍵がそろった。家族が引き継ぐことができた。', textEn: 'Putting the two notes together completed the key. The family could inherit.', end: 'good'}
             : {text: '片方のメモがないと鍵はそろわない。誰も開けられなかった。', textEn: 'Without one note, the key is incomplete. No one could open it.', end: 'bad'}
      ]};
    }
    var leaked = Math.random() < 0.5;
    if (leaked) return {reflect: '引き継ぎはいちばん確実だ。でも、生きている間の危険も一緒に渡すことになる。', reflectEn: 'Inheritance is the most certain this way. But you also hand over the risks of your lifetime.', steps: [
      {text: '3年後：家族のスマホがウイルスに感染し、共有していたパスワードが漏れた。一部が、知らないうちに送金されていた。', textEn: 'Three years on: a family member\'s phone was infected with a virus, and the shared password leaked. Some of it was sent away without anyone noticing.'},
      {text: 'ある日、本人が亡くなった。', textEn: 'One day, the person died.'},
      {text: '残りは引き継げた。でも、生きている間の管理に代償があった。', textEn: 'The rest could be inherited. But there was a price for how it was kept during life.', end: 'bad'}
    ]};
    return {reflect: '引き継ぎはいちばん確実だ。でも、生きている間の危険も一緒に渡すことになる。', reflectEn: 'Inheritance is the most certain this way. But you also hand over the risks of your lifetime.', steps: [
      {text: '5年後：何事もなく過ぎた。', textEn: 'Five years on: nothing happened.'},
      {text: 'ある日、本人が亡くなった。', textEn: 'One day, the person died.'},
      {text: '家族はパスワードを知っているので、そのまま引き継ぐことができた。', textEn: 'The family knew the password, so they could inherit it as-is.', end: 'good'}
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
