(function(){
  var btnsWrap = document.getElementById('hlBtns');
  var feed = document.getElementById('hlFeed');
  var answeredOk = null;
  function shuffleBtns(){
    var btns = Array.prototype.slice.call(btnsWrap.children);
    for (var i = btns.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      btnsWrap.appendChild(btns[j]);
    }
  }
  function renderFeed(){
    if (answeredOk === null) { feed.innerHTML = ''; return; }
    feed.innerHTML = answeredOk
      ? L('<b>正解。</b>これだけが<span class="acc">正確</span>な見出し。でも実際にテレビや新聞で大きく出たのはまちがっている方。本文はどれも「取引所の社長」と書いていたのに、見出しだけが独り歩きした。', '<b>Correct.</b> This is the only <span class="acc">accurate</span> headline. Yet the ones splashed across TV and newspapers were the wrong ones. Every article\'s text said "the exchange\'s president" — only the headlines ran off on their own.')
      : L('<b>それは実際に大きく報じられた見出し。でも<span class="acc">正確</span>じゃない。</b>逮捕されたのは取引所の社長。「ビットコインの社長」という見出しが誤解を広げた。', '<b>That headline really did run, widely. But it isn\'t <span class="acc">accurate</span>.</b> The man arrested was the exchange\'s president. Headlines about a "Bitcoin president" spread the misunderstanding.');
  }
  btnsWrap.addEventListener('click', function(e){
    var b = e.target.closest('button');
    if (!b || b.disabled) return;
    var ok = b.dataset.ok === '1';
    Array.prototype.forEach.call(btnsWrap.children, function(x){
      x.disabled = true;
      if (x.dataset.ok === '1') x.classList.add('right');
    });
    if (!ok) b.classList.add('wrong');
    answeredOk = ok;
    renderFeed();
  });
  document.addEventListener('langchange', renderFeed);
  shuffleBtns();
})();
