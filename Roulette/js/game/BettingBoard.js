(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};
  const { i18n, getResultColor, covers, formatCompact } = R;

  class BettingBoard {
    constructor(root, onBet) {
      this.root = root;
      this.onBet = onBet;
      this.betDefs = new Map();
      this.currentWheelType = "european";
      this.root.addEventListener("click", (event) => {
        const target = event.target.closest("[data-bet-id]");
        if (!target || !this.root.contains(target)) return;
        this.onBet(target.dataset.betId, target);
      });
      this.root.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const target = event.target.closest("[data-bet-id]");
        if (!target) return;
        event.preventDefault();
        this.onBet(target.dataset.betId, target);
      });
    }

    buildDefs(wheelType) {
      const defs = [];
      const numbers = Array.from({ length: 36 }, (_, index) => index + 1);
      const topRow = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
      const middleRow = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
      const bottomRow = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
      const redNumbers = numbers.filter((number) => getResultColor(number) === "red");
      const blackNumbers = numbers.filter((number) => getResultColor(number) === "black");
      const add = (def) => defs.push(def);

      add({ id: "number:0", type: "number", label: "0", covers: [0], payout: 35 });
      if (wheelType === "american") add({ id: "number:00", type: "number", label: "00", covers: ["00"], payout: 35 });
      numbers.forEach((number) => {
        add({ id: `number:${number}`, type: "number", label: i18n.t("bet.number", { number }), covers: [number], payout: 35 });
      });
      add({ id: "column:top", type: "column", label: i18n.t("bet.columnTop"), covers: topRow, payout: 2 });
      add({ id: "column:middle", type: "column", label: i18n.t("bet.columnMiddle"), covers: middleRow, payout: 2 });
      add({ id: "column:bottom", type: "column", label: i18n.t("bet.columnBottom"), covers: bottomRow, payout: 2 });
      add({ id: "dozen:1", type: "dozen", label: i18n.t("bet.dozen1"), covers: numbers.slice(0, 12), payout: 2 });
      add({ id: "dozen:2", type: "dozen", label: i18n.t("bet.dozen2"), covers: numbers.slice(12, 24), payout: 2 });
      add({ id: "dozen:3", type: "dozen", label: i18n.t("bet.dozen3"), covers: numbers.slice(24, 36), payout: 2 });
      add({ id: "outside:low", type: "outside", label: i18n.t("bet.low"), covers: numbers.slice(0, 18), payout: 1 });
      add({ id: "outside:even", type: "outside", label: i18n.t("bet.even"), covers: numbers.filter((number) => number % 2 === 0), payout: 1 });
      add({ id: "outside:red", type: "outside", label: i18n.t("bet.red"), covers: redNumbers, payout: 1 });
      add({ id: "outside:black", type: "outside", label: i18n.t("bet.black"), covers: blackNumbers, payout: 1 });
      add({ id: "outside:odd", type: "outside", label: i18n.t("bet.odd"), covers: numbers.filter((number) => number % 2 === 1), payout: 1 });
      add({ id: "outside:high", type: "outside", label: i18n.t("bet.high"), covers: numbers.slice(18, 36), payout: 1 });

      this.betDefs = new Map(defs.map((def) => [def.id, def]));
      return defs;
    }

    getDef(id) {
      return this.betDefs.get(id);
    }

    render({ wheelType, bets = [], result = null, locked = false }) {
      this.currentWheelType = wheelType;
      this.buildDefs(wheelType);
      this.root.classList.toggle("locked", locked);
      const W = 74;
      const H = 58;
      const left = 86;
      const top = 22;
      const rightW = 64;
      const zeroW = 66;
      const boardW = left + W * 12 + rightW + 22;
      const boardH = top + H * 5 + 32;
      const rowMap = [
        [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
        [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
        [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
      ];
      const cells = [];
      const addCell = (id, x, y, w, h, label, fill, subLabel = "") => {
        const def = this.betDefs.get(id);
        const winning = result !== null && def && covers(def, result);
        cells.push({ id, x, y, w, h, label, fill, subLabel, winning });
      };

      if (wheelType === "american") {
        addCell("number:0", 14, top, zeroW, H * 1.5, "0", "green");
        addCell("number:00", 14, top + H * 1.5, zeroW, H * 1.5, "00", "green");
      } else {
        addCell("number:0", 14, top, zeroW, H * 3, "0", "green");
      }

      rowMap.forEach((row, rowIndex) => {
        row.forEach((number, colIndex) => {
          addCell(`number:${number}`, left + colIndex * W, top + rowIndex * H, W, H, String(number), getResultColor(number));
        });
      });

      const rightX = left + W * 12;
      addCell("column:top", rightX, top, rightW, H, "2:1", "outside", i18n.t("bet.columnTop"));
      addCell("column:middle", rightX, top + H, rightW, H, "2:1", "outside", i18n.t("bet.columnMiddle"));
      addCell("column:bottom", rightX, top + H * 2, rightW, H, "2:1", "outside", i18n.t("bet.columnBottom"));

      const dozenY = top + H * 3;
      addCell("dozen:1", left, dozenY, W * 4, H, "1st 12", "outside");
      addCell("dozen:2", left + W * 4, dozenY, W * 4, H, "2nd 12", "outside");
      addCell("dozen:3", left + W * 8, dozenY, W * 4, H, "3rd 12", "outside");

      const outsideY = dozenY + H;
      [
        ["outside:low", "1-18", "outside"],
        ["outside:even", i18n.t("bet.even"), "outside"],
        ["outside:red", i18n.t("bet.red"), "red"],
        ["outside:black", i18n.t("bet.black"), "black"],
        ["outside:odd", i18n.t("bet.odd"), "outside"],
        ["outside:high", "19-36", "outside"],
      ].forEach(([id, label, fill], index) => {
        addCell(id, left + index * W * 2, outsideY, W * 2, H, label, fill);
      });

      const chips = new Map();
      bets.forEach((bet) => {
        chips.set(bet.id, (chips.get(bet.id) || 0) + bet.amount);
      });

      const cellMarkup = cells.map((cell) => this.cellMarkup(cell, chips.get(cell.id) || 0)).join("");
      this.root.innerHTML = `
        <svg class="roulette-table-svg" viewBox="0 0 ${boardW} ${boardH}" role="group" aria-label="Roulette betting table">
          <rect x="0" y="0" width="${boardW}" height="${boardH}" rx="14" fill="rgba(0,0,0,0.28)" stroke="rgba(255,255,255,0.2)" />
          ${cellMarkup}
        </svg>
      `;
    }

    cellMarkup(cell, chipAmount) {
      const fillMap = {
        red: "var(--color-number-red)",
        black: "var(--color-number-black)",
        green: "var(--color-number-green)",
        outside: "rgba(0,0,0,0.28)",
      };
      const centerX = cell.x + cell.w / 2;
      const centerY = cell.y + cell.h / 2;
      const chipX = cell.x + cell.w - 13;
      const chipY = cell.y + 13;
      const chip = chipAmount > 0 ? `
        <g class="chip-token" transform="translate(${chipX}, ${chipY})">
          <circle r="11"></circle>
          <text text-anchor="middle" dominant-baseline="middle">${formatCompact(chipAmount)}</text>
        </g>
      ` : "";
      return `
        <g class="bet-cell fill-${cell.fill} ${cell.winning ? "winning" : ""}" data-bet-id="${cell.id}" tabindex="0" role="button" aria-label="${cell.label}">
          <rect x="${cell.x}" y="${cell.y}" width="${cell.w}" height="${cell.h}" rx="4" fill="${fillMap[cell.fill] || fillMap.outside}"></rect>
          <text x="${centerX}" y="${centerY - (cell.subLabel ? 7 : 0)}" text-anchor="middle" dominant-baseline="middle">${cell.label}</text>
          ${cell.subLabel ? `<text class="sub-label" x="${centerX}" y="${centerY + 15}" text-anchor="middle" dominant-baseline="middle">${cell.subLabel}</text>` : ""}
          ${chip}
        </g>
      `;
    }
  }

  Object.assign(R, { BettingBoard });
})();
