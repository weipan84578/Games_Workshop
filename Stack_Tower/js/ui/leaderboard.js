(function (window) {
  'use strict';

  const Leaderboard = {
    init() {
      this.list = Helpers.qs('#leaderboard-list');
      this.empty = Helpers.qs('#leaderboard-empty');
      Helpers.qs('#clear-leaderboard-btn').addEventListener('click', () => {
        this.clear();
        this.render();
      });
      this.render();
    },

    get() {
      const items = Storage.get('leaderboard', []);
      return items
        .slice()
        .sort((a, b) => b.score - a.score || b.floors - a.floors)
        .slice(0, 5);
    },

    add(score, floors) {
      const items = this.get();
      items.push({ score, floors, date: Helpers.formatDate() });
      items.sort((a, b) => b.score - a.score || b.floors - a.floors);
      Storage.set('leaderboard', items.slice(0, 5));
    },

    clear() {
      Storage.remove('leaderboard');
      ScreenManager.toast(I18n.t('settings.resetDone'));
    },

    render() {
      if (!this.list || !this.empty) return;
      const items = this.get();
      this.list.replaceChildren();
      this.empty.classList.toggle('is-hidden', items.length > 0);

      items.forEach((item, index) => {
        const li = document.createElement('li');
        const rank = document.createElement('span');
        const score = document.createElement('span');
        const scoreLine = document.createElement('span');
        const dateLine = document.createElement('span');
        const floor = document.createElement('strong');
        rank.className = 'rank-badge';
        score.className = 'score-cell';
        scoreLine.className = 'score-line';
        dateLine.className = 'date-line';
        floor.className = 'floor-cell';

        rank.textContent = this.rankLabel(index);
        scoreLine.textContent = `${I18n.t('leaderboard.score')} ${item.score}`;
        dateLine.textContent = item.date;
        score.append(scoreLine, dateLine);
        floor.textContent = `${item.floors}F`;
        li.append(rank, score, floor);
        this.list.append(li);
      });
    },

    rankLabel(index) {
      if (index === 0) return '1';
      if (index === 1) return '2';
      if (index === 2) return '3';
      return String(index + 1);
    }
  };

  window.Leaderboard = Leaderboard;
})(window);
