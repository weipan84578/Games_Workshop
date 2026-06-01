(function () {
  window.EASY_PUZZLES = [
    CrosswordDataTools.createPuzzle({
      id: "easy_001",
      difficulty: "easy",
      title: "入門網頁",
      subtitle: "基本網頁與遊戲詞彙",
      size: { rows: 10, cols: 10 },
      hints: 5,
      clues: {
        across: [
          { row: 0, col: 0, answer: "CODE", clue: "程式設計時撰寫的內容" },
          { row: 2, col: 0, answer: "WEB", clue: "瀏覽器開啟的網路世界" },
          { row: 2, col: 4, answer: "HTML", clue: "網頁結構標記語言" },
          { row: 4, col: 0, answer: "GRID", clue: "用列與欄排列的版面" },
          { row: 4, col: 5, answer: "SAVE", clue: "把進度寫入儲存空間" },
          { row: 6, col: 1, answer: "HINT", clue: "卡關時可使用的提示" },
          { row: 6, col: 6, answer: "PLAY", clue: "開始進行遊戲" },
          { row: 8, col: 2, answer: "TIMER", clue: "記錄遊玩時間的工具" },
        ],
        down: [
          { row: 0, col: 0, answer: "COW", clue: "會哞哞叫的農場動物" },
          { row: 0, col: 1, answer: "ORE", clue: "可被開採的礦石" },
          { row: 0, col: 2, answer: "DAB", clue: "輕點或少量塗抹" },
          { row: 2, col: 4, answer: "HEX", clue: "常用於色碼的十六進位縮寫" },
          { row: 6, col: 6, answer: "PER", clue: "表示每一、每個的英文介系詞" },
          { row: 6, col: 8, answer: "ANT", clue: "體型小、常群體行動的昆蟲" },
        ],
      },
    }),
  ];
})();
