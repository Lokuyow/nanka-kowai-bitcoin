(function(){
  var PATHS = {
    fish: '<path d="M2.5 12C5.5 7.5 9 5 13 5c3.5 0 6.5 2.5 8.5 7-2 4.5-5 7-8.5 7-4 0-7.5-2.5-10.5-7Z"/><path d="M2.5 12 1 8.5M2.5 12 1 15.5"/><circle cx="16.8" cy="10.3" r="1.1" fill="currentColor" stroke="none"/>',
    bread: '<path d="M5.2 10.2A5.2 4.6 0 0 1 10.4 5.6h3.2a5.2 4.6 0 0 1 5.2 4.6c.7.6 1.2 1.4 1.2 2.4V15a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 15v-2.4c0-1 .5-1.8 1.2-2.4Z"/><path d="M8.8 9.3l1.6 2.2M13 9.3l1.6 2.2"/>',
    egg: '<path d="M12 3.5c2.9 0 5.6 5.1 5.6 9.4a5.6 5.6 0 1 1-11.2 0C6.4 8.6 9.1 3.5 12 3.5Z"/>',
    cloth: '<rect x="4" y="6" width="16" height="12" rx="1"/><path d="M4 10.2c2.7-1.7 5.3 1.7 8 0s5.3 1.7 8 0M4 14.2c2.7-1.7 5.3 1.7 8 0s5.3 1.7 8 0"/>',
    wood: '<circle cx="8" cy="16.5" r="3.4"/><circle cx="16" cy="16.5" r="3.4"/><circle cx="12" cy="9.5" r="3.4"/><circle cx="8" cy="16.5" r="1.1"/><circle cx="16" cy="16.5" r="1.1"/><circle cx="12" cy="9.5" r="1.1"/>',
    shell: '<path d="M4 19c0-6.8 3.8-12.8 8.5-12.8S21 12.2 21 19"/><path d="M3.5 19h18"/><path d="M12 6.8V19M7.9 8.4 9.5 19M16.1 8.4 14.5 19"/>'
  };
  const names = {
    fish: ['魚', 'Fish'], egg: ['卵', 'Eggs'], bread: ['パン', 'Bread'],
    cloth: ['布', 'Cloth'], wood: ['まき', 'Firewood'], shell: ['貝がら', 'Shells']
  };
  const barter = [
    { id: 'baker', name: ['パン屋', 'Bakery'], offer: 'bread', wants: 'cloth' },
    { id: 'weaver', name: ['布屋', 'Weaver'], offer: 'cloth', wants: 'egg' },
    { id: 'woodcutter', name: ['まき屋', 'Firewood stall'], offer: 'wood', wants: 'fish' },
    { id: 'fisher', name: ['魚屋', 'Fish stall'], offer: 'fish', wants: 'wood' },
    { id: 'eggs', name: ['卵屋', 'Egg stall'], offer: 'egg', wants: 'fish' }
  ];
  const fishBuyers = [
    { id: 'eggs', name: ['卵屋', 'Egg stall'], amount: 4 },
    { id: 'woodcutter', name: ['まき屋', 'Firewood stall'], amount: 3 }
  ];
  const breadSellers = [
    { id: 'baker', name: ['パン屋', 'Bakery'], amount: 3 },
    { id: 'second-baker', name: ['広場のパン屋', 'Square bakery'], amount: 2 }
  ];
  const limit = 5;
  const byId = id => document.getElementById(id);
  const stalls = byId('marketStalls');
  const next = byId('btnMoney');
  const retry = byId('btnRetry');
  const translate = pair => L(...pair);
  const item = key => translate(names[key]);
  const icon = name => '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + PATHS[name] + '</svg>';
  const shells = count => L('貝がら ' + count + '枚', count + ' shells');

  let mode, holding, balance, turns, history, feedback, barterTurns;

  function offers() {
    if (mode === 'barter') return barter;
    return holding === 'fish' ? fishBuyers : breadSellers;
  }

  function reset(round) {
    mode = round;
    holding = 'fish';
    balance = 0;
    turns = 0;
    history = [];
    feedback = ['', ''];
    if (round === 'barter') barterTurns = null;
    render();
  }

  function record(from, to) {
    return () => from() + ' → ' + to();
  }

  function trade(offer) {
    turns++;
    if (mode === 'barter') {
      if (offer.wants !== holding) {
        feedback = ['この店が欲しいのは' + names[offer.wants][0] + '。ほかの店を見てみよう。',
          'This stall wants ' + names[offer.wants][1].toLowerCase() + '. Try another stall.'];
      } else {
        const former = holding;
        holding = offer.offer;
        history.push(record(() => item(former), () => item(offer.offer)));
        feedback = ['交換できた。次は' + names[holding][0] + 'を欲しがる店を探そう。',
          'Trade made. Look for a stall that wants your ' + names[holding][1].toLowerCase() + '.'];
      }
    } else if (holding === 'fish') {
      holding = 'shell';
      balance = offer.amount;
      history.push(record(() => item('fish'), () => shells(offer.amount)));
      feedback = ['魚が売れた。パン屋の値段を比べてみよう。', 'You sold the fish. Compare the bread prices.'];
    } else {
      balance -= offer.amount;
      holding = 'bread';
      history.push(record(() => shells(offer.amount), () => item('bread')));
    }

    if (holding === 'bread') {
      if (mode === 'barter') {
        barterTurns = turns;
        feedback = ['パンを手に入れた！ 交換のたびに、手持ちの品を欲しがる店を探した。',
          'You got the bread! At each step you had to find a stall that wanted what you had.'];
      } else {
        const comparison = barterTurns === null
          ? ['物々交換ではパンに届かなかった。貝がらを使うと、魚を売る店とパンを買う店を別々に選べた。',
             'Barter did not get you to bread. With shells, you could sell your fish at one stall and buy bread at another.']
          : ['物々交換は' + barterTurns + '手、貝がらを使うと' + turns + '手。',
             'Barter took ' + barterTurns + ' moves. Using shells took ' + turns + '.'];
        feedback = [balance > 0
          ? 'パンを買えた！ 残った貝がら' + balance + '枚は次の買い物に使える。' + comparison[0]
          : 'パンを買えた！ 貝がらは使い切った。' + comparison[0],
          balance > 0
            ? 'You bought the bread! You have ' + balance + ' shells left for another purchase. ' + comparison[1]
            : 'You bought the bread! You used all your shells. ' + comparison[1]];
      }
    } else if (turns === limit) {
      feedback = ['5手を使い切った。貝がらを使える市場でも試してみよう。',
        'All five moves are used. Try the market that accepts shells.'];
    }
  }

  function render() {
    const done = holding === 'bread' || turns === limit;
    const active = document.activeElement;
    const focusedTrader = stalls.contains(active) ? active.closest('[data-trader]')?.dataset.trader : null;
    byId('marketRound').textContent = mode === 'barter' ? L('物々交換', 'Barter') : L('貝がらで売り買い', 'Trading with shells');
    byId('marketTurns').textContent = L('残り ' + (limit - turns) + ' 手', (limit - turns) + ' moves left');
    byId('holdIcon').innerHTML = icon(holding);
    byId('holdName').textContent = holding === 'shell' ? shells(balance) : item(holding);
    byId('marketGuide').textContent = done ? '' : mode === 'barter'
      ? L('手持ちの品を欲しがる店を選んで交換しよう。', 'Pick a stall that wants what you have.')
      : holding === 'fish' ? L('どの店に魚を売る？', 'Which stall will you sell your fish to?')
        : L('どの店でパンを買う？', 'Which stall will you buy bread from?');
    stalls.hidden = done;
    stalls.replaceChildren(...offers().map(offer => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.trader = offer.id;
      const title = document.createElement('strong');
      title.textContent = translate(offer.name);
      const detail = document.createElement('span');
      detail.textContent = mode === 'barter'
        ? L(item(offer.wants) + 'と' + item(offer.offer) + 'を交換', 'Trade ' + item(offer.wants).toLowerCase() + ' for ' + item(offer.offer).toLowerCase())
        : holding === 'fish' ? L('魚を' + shells(offer.amount) + 'で買い取る', 'Buys fish for ' + shells(offer.amount))
          : L('パンを' + shells(offer.amount) + 'で売る', 'Sells bread for ' + shells(offer.amount));
      button.append(title, detail);
      return button;
    }));
    byId('pMsg').textContent = translate(feedback);
    const trail = byId('marketTrail');
    trail.hidden = history.length === 0;
    trail.replaceChildren(...history.map(step => {
      const row = document.createElement('li');
      row.textContent = step();
      return row;
    }));
    next.hidden = !(done && mode === 'barter');
    retry.hidden = !(done && mode === 'shells');
    if (focusedTrader) {
      const target = done ? (mode === 'barter' ? next : retry)
        : [...stalls.children].find(button => button.dataset.trader === focusedTrader) || stalls.firstElementChild;
      target.focus({preventScroll:true});
    }
  }

  stalls.addEventListener('click', event => {
    const button = event.target.closest('[data-trader]');
    if (!button || stalls.hidden) return;
    trade(offers().find(offer => offer.id === button.dataset.trader));
    render();
  });
  document.addEventListener('langchange', render);
  next.addEventListener('click', () => { reset('shells'); stalls.firstElementChild.focus(); });
  retry.addEventListener('click', () => { reset('barter'); stalls.firstElementChild.focus(); });
  byId('goalIcon').innerHTML = icon('bread');
  reset('barter');
})();
