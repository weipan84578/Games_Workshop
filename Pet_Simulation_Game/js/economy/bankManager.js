(function (PSG) {
  'use strict';

  var INTEREST_RATE = 0.01;

  function accountFor(save) {
    save.economy = save.economy || {};
    save.economy.savings = save.economy.savings || {};
    return save.economy.savings;
  }

  function balance(save) {
    return Math.max(0, Math.floor(Number(accountFor(save).balance) || 0));
  }

  function amountFor(value) {
    var amount = Math.floor(Number(value));
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
  }

  function deposit(save, value) {
    var amount = amountFor(value);
    var coins = Math.max(0, Math.floor(Number(save.player.coins) || 0));
    if (!amount) return { ok: false, reason: 'amount' };
    if (coins < amount) return { ok: false, reason: 'coins' };

    var account = accountFor(save);
    save.player.coins = coins - amount;
    account.balance = balance(save) + amount;
    PSG.storage.save.write(save);
    return { ok: true, amount: amount, balance: account.balance, coins: save.player.coins };
  }

  function withdraw(save, value) {
    var amount = amountFor(value);
    var savings = balance(save);
    if (!amount) return { ok: false, reason: 'amount' };
    if (savings < amount) return { ok: false, reason: 'savings' };

    var account = accountFor(save);
    account.balance = savings - amount;
    save.player.coins = Math.max(0, Math.floor(Number(save.player.coins) || 0)) + amount;
    PSG.storage.save.write(save);
    return { ok: true, amount: amount, balance: account.balance, coins: save.player.coins };
  }

  function settleInterest(save) {
    var account = accountFor(save);
    var principal = balance(save);
    var interest = Math.floor(principal * INTEREST_RATE);
    account.balance = principal;
    save.player.coins = Math.max(0, Math.floor(Number(save.player.coins) || 0)) + interest;
    return { ok: true, principal: principal, interest: interest, balance: account.balance, coins: save.player.coins };
  }

  PSG.economy.bank = {
    interestRate: INTEREST_RATE,
    balance: balance,
    deposit: deposit,
    withdraw: withdraw,
    settleInterest: settleInterest
  };
})(window.PSG);
