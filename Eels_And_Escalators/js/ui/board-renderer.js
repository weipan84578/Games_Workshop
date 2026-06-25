(function () {
  window.EAE = window.EAE || {};

  class BoardRenderer {
    constructor(container, boardData, options) {
      this.container = container;
      this.boardData = boardData;
      this.options = Object.assign({ showPieces: true }, options || {});
      this.piecePositions = { player: 1, ai: 1 };
      this.pieces = {};
    }

    render() {
      if (!this.container) return;
      this.container.innerHTML = this._buildSvg();
      this.pieces.player = this.container.querySelector("#piece-player");
      this.pieces.ai = this.container.querySelector("#piece-ai");
      this._applyPieceTransforms();
    }

    updatePieces(playerPos, aiPos) {
      this.piecePositions.player = playerPos;
      this.piecePositions.ai = aiPos;
      this._applyPieceTransforms();
    }

    moveActor(actor, position) {
      this.piecePositions[actor] = position;
      this._applyPieceTransforms();
    }

    flashPiece(actor, className, duration) {
      const piece = this.pieces[actor];
      if (!piece) return;
      const art = piece.querySelector(".piece-art") || piece;
      art.classList.add(className);
      window.setTimeout(() => art.classList.remove(className), duration || 200);
    }

    _buildSvg() {
      const cells = this.boardData.getCells().map((cell) => this._renderCell(cell)).join("");
      const escalators = this.boardData.escalators.map((item) => this._renderEscalator(item)).join("");
      const eels = this.boardData.eels.map((item, index) => this._renderEel(item, index)).join("");
      const pieces = this.options.showPieces ? this._renderPieces() : "";
      return `
        <svg class="board-svg" viewBox="0 0 1000 1000" role="img" aria-label="Eels and Escalators board">
          <defs>
            <pattern id="cell-water" width="32" height="32" patternUnits="userSpaceOnUse">
              <rect width="32" height="32" fill="#90e0ef"></rect>
              <path d="M-4 18c8-8 16-8 24 0s16 8 24 0" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="3"></path>
            </pattern>
            <pattern id="cell-coral" width="34" height="34" patternUnits="userSpaceOnUse">
              <rect width="34" height="34" fill="#ff9f7f"></rect>
              <circle cx="8" cy="9" r="2" fill="rgba(255,255,255,.38)"></circle>
              <circle cx="25" cy="22" r="2.5" fill="rgba(255,255,255,.34)"></circle>
            </pattern>
            <linearGradient id="cell-start" x1="0" x2="1" y1="0" y2="1">
              <stop stop-color="#fff176"></stop><stop offset="1" stop-color="#ffb703"></stop>
            </linearGradient>
            <linearGradient id="cell-finish" x1="0" x2="1" y1="0" y2="1">
              <stop stop-color="#ff595e"></stop><stop offset=".28" stop-color="#ffca3a"></stop><stop offset=".55" stop-color="#8ac926"></stop><stop offset=".78" stop-color="#1982c4"></stop><stop offset="1" stop-color="#6a4c93"></stop>
            </linearGradient>
            <linearGradient id="escalator-gradient" x1="0" x2="1" y1="0" y2="1">
              <stop stop-color="#fff7ad"></stop><stop offset=".45" stop-color="#ff9ed8"></stop><stop offset="1" stop-color="#8be9ff"></stop>
            </linearGradient>
            <linearGradient id="escalator-rail-gradient" x1="0" x2="1" y1="0" y2="1">
              <stop stop-color="#ffffff"></stop><stop offset="1" stop-color="#ffe0f1"></stop>
            </linearGradient>
            <linearGradient id="eel-gradient" x1="0" x2="1">
              <stop stop-color="#ffcfec"></stop><stop offset=".5" stop-color="#b57cff"></stop><stop offset="1" stop-color="#62d8ff"></stop>
            </linearGradient>
            <linearGradient id="eel-belly-gradient" x1="0" x2="1">
              <stop stop-color="#fff7ad"></stop><stop offset="1" stop-color="#ffffff"></stop>
            </linearGradient>
          </defs>
          <g class="cells">${cells}</g>
          <g class="routes">${escalators}${eels}</g>
          <g class="pieces">${pieces}</g>
        </svg>`;
    }

    _renderCell(cell) {
      const pos = this.boardData.getCellPosition(cell);
      const x = pos.col * 100;
      const y = pos.row * 100;
      const classes = ["board-cell", cell % 2 ? "odd" : "even"];
      if (cell === 1) classes.push("start");
      if (cell === 100) classes.push("finish");
      if (this.boardData.isEscalatorStart(cell)) classes.push("escalator-start");
      if (this.boardData.isEelStart(cell)) classes.push("eel-start");

      let icon = "";
      if (cell === 1) icon = `<text class="cell-icon" x="${x + 66}" y="${y + 75}">★</text>`;
      else if (cell === 100) icon = `<text class="cell-icon" x="${x + 63}" y="${y + 75}">🏁</text>`;
      else if (this.boardData.isEscalatorStart(cell)) icon = `<text class="cell-icon" x="${x + 66}" y="${y + 75}">↗</text>`;
      else if (this.boardData.isEelStart(cell)) icon = `<text class="cell-icon" x="${x + 66}" y="${y + 75}">⚠</text>`;

      return `<g>
        <rect class="${classes.join(" ")}" x="${x}" y="${y}" width="100" height="100"></rect>
        <text class="cell-number" x="${x + 10}" y="${y + 30}">${cell}</text>
        ${icon}
      </g>`;
    }

    _renderEscalator(item) {
      const start = this.boardData.getCellCenter(item.start);
      const end = this.boardData.getCellCenter(item.end);
      const path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const steps = Array.from({ length: 5 }, (_, index) => {
        const t = (index + 1) / 6;
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;
        return `<circle class="escalator-step-bubble" cx="${x}" cy="${y}" r="13"></circle>`;
      }).join("");
      return `<g class="cute-escalator">
        <path class="escalator-cloud-path" d="${path}"></path>
        <path class="escalator-track" d="${path}"></path>
        <path class="escalator-highlight" d="${path}"></path>
        ${steps}
        <g class="escalator-cloud" transform="translate(${start.x} ${start.y})">
          <circle cx="-18" cy="8" r="16"></circle><circle cx="0" cy="0" r="22"></circle><circle cx="22" cy="8" r="15"></circle>
          <path d="M-9 5 Q0 14 10 5" class="cloud-smile"></path>
        </g>
        <g class="escalator-cloud top" transform="translate(${end.x} ${end.y})">
          <circle cx="-20" cy="8" r="16"></circle><circle cx="0" cy="0" r="24"></circle><circle cx="24" cy="8" r="16"></circle>
          <path d="M-10 5 Q0 16 12 5" class="cloud-smile"></path>
        </g>
        <text class="board-label" x="${midX + 8}" y="${midY - 8}">${item.id}</text>
      </g>`;
    }

    _renderEel(item, index) {
      const path = this._curvePath(item.start, item.end, index);
      const head = this.boardData.getCellCenter(item.start);
      const cheekY = head.y + 5;
      return `<g>
        <path class="eel-body" d="${path}"></path>
        <path class="eel-belly" d="${path}"></path>
        <path class="eel-spark" d="${path}"></path>
        <circle class="eel-head" cx="${head.x}" cy="${head.y}" r="28"></circle>
        <circle class="eel-cheek" cx="${head.x - 15}" cy="${cheekY}" r="6"></circle>
        <circle class="eel-cheek" cx="${head.x + 15}" cy="${cheekY}" r="6"></circle>
        <circle class="eel-eye" cx="${head.x - 9}" cy="${head.y - 7}" r="6"></circle>
        <circle class="eel-eye" cx="${head.x + 9}" cy="${head.y - 7}" r="6"></circle>
        <circle class="eel-pupil" cx="${head.x - 8}" cy="${head.y - 7}" r="2"></circle>
        <circle class="eel-pupil" cx="${head.x + 10}" cy="${head.y - 7}" r="2"></circle>
        <path class="eel-smile" d="M ${head.x - 8} ${head.y + 8} Q ${head.x} ${head.y + 15} ${head.x + 10} ${head.y + 8}"></path>
        <path class="eel-fin" d="M ${head.x - 28} ${head.y + 4} q -16 10 0 22"></path>
        <path class="eel-fin right" d="M ${head.x + 28} ${head.y + 4} q 16 10 0 22"></path>
        <text class="board-label" x="${head.x + 24}" y="${head.y + 34}">${item.id}</text>
      </g>`;
    }

    _curvePath(startCell, endCell, index) {
      const start = this.boardData.getCellCenter(startCell);
      const end = this.boardData.getCellCenter(endCell);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      const normalX = -dy / length;
      const normalY = dx / length;
      const offset = (index % 2 === 0 ? 90 : -90) + (index % 3) * 24;
      const c1 = {
        x: start.x + dx * 0.28 + normalX * offset,
        y: start.y + dy * 0.28 + normalY * offset
      };
      const c2 = {
        x: start.x + dx * 0.72 - normalX * offset,
        y: start.y + dy * 0.72 - normalY * offset
      };
      return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
    }

    _renderPieces() {
      return `
        <g id="piece-player" class="piece">
          <g class="piece-art piece-core">
            <rect x="-24" y="-26" width="48" height="52" rx="8" fill="#ffd60a" stroke="#6b4e00" stroke-width="4"></rect>
            <circle cx="-9" cy="-8" r="7" fill="#fff"></circle>
            <circle cx="9" cy="-8" r="7" fill="#fff"></circle>
            <circle cx="-8" cy="-8" r="3" fill="#0077b6"></circle>
            <circle cx="10" cy="-8" r="3" fill="#0077b6"></circle>
            <path d="M-10 10 Q0 18 12 10" fill="none" stroke="#6b4e00" stroke-width="3" stroke-linecap="round"></path>
          </g>
        </g>
        <g id="piece-ai" class="piece">
          <g class="piece-art piece-core">
            <ellipse cx="0" cy="-4" rx="25" ry="28" fill="#b57cff" stroke="#3a0ca3" stroke-width="4"></ellipse>
            <circle cx="-8" cy="-10" r="5" fill="#fff"></circle>
            <circle cx="8" cy="-10" r="5" fill="#fff"></circle>
            <circle cx="-7" cy="-10" r="2" fill="#111"></circle>
            <circle cx="9" cy="-10" r="2" fill="#111"></circle>
            <path d="M-20 23 C-24 34 -15 34 -10 24 M0 25 C-3 37 8 37 6 25 M20 23 C24 34 15 34 10 24" fill="none" stroke="#3a0ca3" stroke-width="5" stroke-linecap="round"></path>
          </g>
        </g>`;
    }

    _applyPieceTransforms() {
      if (!this.options.showPieces) return;
      const sameCell = this.piecePositions.player === this.piecePositions.ai;
      this._setTransform("player", this.piecePositions.player, sameCell ? -22 : -12);
      this._setTransform("ai", this.piecePositions.ai, sameCell ? 22 : 12);
    }

    _setTransform(actor, position, offsetX) {
      const piece = this.pieces[actor];
      if (!piece) return;
      const center = this.boardData.getCellCenter(position);
      piece.setAttribute("transform", `translate(${center.x + offsetX} ${center.y})`);
    }
  }

  window.EAE.BoardRenderer = BoardRenderer;
})();
