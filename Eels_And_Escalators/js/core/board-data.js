(function () {
  window.EAE = window.EAE || {};

  const eels = [
    { id: "E1", type: "eel", start: 17, end: 7, label: "short" },
    { id: "E2", type: "eel", start: 54, end: 34, label: "medium" },
    { id: "E3", type: "eel", start: 62, end: 19, label: "long" },
    { id: "E4", type: "eel", start: 64, end: 60, label: "short" },
    { id: "E5", type: "eel", start: 87, end: 24, label: "extra" },
    { id: "E6", type: "eel", start: 95, end: 75, label: "medium" }
  ];

  const escalators = [
    { id: "L1", type: "escalator", start: 4, end: 14, label: "small" },
    { id: "L2", type: "escalator", start: 9, end: 31, label: "large" },
    { id: "L3", type: "escalator", start: 20, end: 38, label: "medium" },
    { id: "L4", type: "escalator", start: 28, end: 84, label: "huge" },
    { id: "L5", type: "escalator", start: 40, end: 59, label: "medium" },
    { id: "L6", type: "escalator", start: 51, end: 67, label: "small" }
  ];

  const transfers = new Map();
  eels.concat(escalators).forEach((item) => transfers.set(item.start, item));

  function getCellPosition(cell) {
    const index = cell - 1;
    const rowFromBottom = Math.floor(index / 10);
    const offset = index % 10;
    const col = rowFromBottom % 2 === 0 ? offset : 9 - offset;
    return {
      col: col,
      row: 9 - rowFromBottom,
      rowFromBottom: rowFromBottom
    };
  }

  function getCellCenter(cell) {
    const position = getCellPosition(cell);
    return {
      x: position.col * 100 + 50,
      y: position.row * 100 + 50
    };
  }

  function getTransfer(cell) {
    return transfers.get(cell) || null;
  }

  function isEelStart(cell) {
    return eels.some((item) => item.start === cell);
  }

  function isEscalatorStart(cell) {
    return escalators.some((item) => item.start === cell);
  }

  function getCells() {
    return Array.from({ length: 100 }, (_, index) => index + 1);
  }

  window.EAE.BoardData = {
    eels: eels,
    escalators: escalators,
    transfers: transfers,
    getCells: getCells,
    getCellPosition: getCellPosition,
    getCellCenter: getCellCenter,
    getTransfer: getTransfer,
    isEelStart: isEelStart,
    isEscalatorStart: isEscalatorStart
  };
})();
