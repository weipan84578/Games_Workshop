/* board.js — 棋盤幾何模型:主走道座標、終點通道、基地槽位、座標轉換。
   座標系統:回傳 {x, y} 為棋盤分數 0..1(x=水平/欄, y=垂直/列)。
   render 時 left=x*100%, top=y*100%, 再 translate(-50%,-50%) 置中。 */
(function (L) {
  'use strict';

  var B = L.engine.board;
  var GRID = L.config.BOARD_GRID; // 15

  // 主走道 52 格的 [row, col](0-indexed,15x15),順時針。索引 0 = 紅起始格。
  var LOOP = [
    [6,1],[6,2],[6,3],[6,4],[6,5],            // 0-4
    [5,6],[4,6],[3,6],[2,6],[1,6],[0,6],      // 5-10
    [0,7],                                     // 11
    [0,8],[1,8],[2,8],[3,8],[4,8],[5,8],      // 12-17
    [6,9],[6,10],[6,11],[6,12],[6,13],[6,14], // 18-23
    [7,14],                                    // 24
    [8,14],[8,13],[8,12],[8,11],[8,10],[8,9], // 25-30
    [9,8],[10,8],[11,8],[12,8],[13,8],[14,8], // 31-36
    [14,7],                                    // 37
    [14,6],[13,6],[12,6],[11,6],[10,6],[9,6], // 38-43
    [8,5],[8,4],[8,3],[8,2],[8,1],[8,0],      // 44-49
    [7,0],[6,0]                                // 50-51
  ];
  B.LOOP = LOOP;

  // 各色終點通道(由通道口往中央,5 格)。
  var HOME_COLS = {
    0: [[7,1],[7,2],[7,3],[7,4],[7,5]],   // 紅(左臂 row7)
    1: [[1,7],[2,7],[3,7],[4,7],[5,7]],   // 綠(上臂 col7)
    2: [[7,13],[7,12],[7,11],[7,10],[7,9]],// 黃(右臂 row7)
    3: [[13,7],[12,7],[11,7],[10,7],[9,7]] // 藍(下臂 col7)
  };
  B.HOME_COLS = HOME_COLS;

  // 基地 4 槽位中心(cell 單位,直接給中心值)
  var YARD_SLOTS = {
    0: [[1.5,1.5],[1.5,3.5],[3.5,1.5],[3.5,3.5]],       // 紅 左上
    1: [[1.5,10.5],[1.5,12.5],[3.5,10.5],[3.5,12.5]],   // 綠 右上
    2: [[10.5,10.5],[10.5,12.5],[12.5,10.5],[12.5,12.5]],// 黃 右下
    3: [[10.5,1.5],[10.5,3.5],[12.5,1.5],[12.5,3.5]]    // 藍 左下
  };
  B.YARD_SLOTS = YARD_SLOTS;

  // 中央終點區:各色完成棋子停放點(略偏向自家方向)
  var CENTER_SPOTS = {
    0: [6.5, 5.9], 1: [5.9, 8.5], 2: [8.5, 9.1], 3: [9.1, 6.5]
  };
  B.CENTER_SPOTS = CENTER_SPOTS;

  // 將 cell (row,col) 轉為棋盤分數中心點
  function cellCenter(r, c) {
    return { x: (c + 0.5) / GRID, y: (r + 0.5) / GRID };
  }
  // 直接給中心 cell 單位
  function centerOf(rc) {
    return { x: rc[1] / GRID, y: rc[0] / GRID };
  }

  B.cellCenter = cellCenter;

  // 絕對主走道索引 → cell
  B.absCell = function (abs) { return LOOP[((abs % 52) + 52) % 52]; };

  // 玩家 owner 的相對位置 rel → 絕對主走道索引(僅 rel<=50 有效)
  B.relToAbs = function (owner, rel) {
    return (L.config.START_OFFSET[owner] + rel) % 52;
  };

  /* 給定棋子,回傳其顯示中心 {x,y}。
     finished → 中央;inYard → 基地槽;rel 0..50 → 主走道;51..55 → 終點通道。 */
  B.tokenPos = function (tk) {
    if (tk.finished) {
      return centerOf(CENTER_SPOTS[tk.owner]);
    }
    if (tk.inYard) {
      var slot = YARD_SLOTS[tk.owner][tk.index];
      return centerOf(slot);
    }
    return cellOfRel(tk.owner, tk.rel);
  };

  // rel → {x,y}
  function cellOfRel(owner, rel) {
    if (rel <= 50) {
      return cellCenter.apply(null, B.absCell(B.relToAbs(owner, rel)));
    }
    if (rel <= 55) {
      var rc = HOME_COLS[owner][rel - 51];
      return cellCenter(rc[0], rc[1]);
    }
    // rel 56 = 中央
    return centerOf(CENTER_SPOTS[owner]);
  }
  B.cellOfRel = cellOfRel;

  // 取得一段 rel 路徑(用於逐格動畫),含起訖中間點
  B.pathCoords = function (owner, fromRel, toRel, fromYard) {
    var pts = [];
    if (fromYard) {
      // 由基地直接跳到起始格(rel 0)
      pts.push(cellOfRel(owner, toRel));
      return pts;
    }
    for (var r = fromRel + 1; r <= toRel; r++) {
      pts.push(cellOfRel(owner, r));
    }
    return pts;
  };

  // 判斷某絕對索引是否為安全格
  B.isSafeAbs = function (abs) {
    return L.config.SAFE_CELLS.indexOf(((abs % 52) + 52) % 52) >= 0;
  };

  // 建立 cell 類型查詢表(供 render-board)
  B.buildCellMap = function () {
    var map = {};
    // 主走道
    for (var i = 0; i < LOOP.length; i++) {
      var key = LOOP[i][0] + ',' + LOOP[i][1];
      map[key] = { type: 'track', abs: i, safe: B.isSafeAbs(i), start: null };
    }
    // 起始格上色
    var so = L.config.START_OFFSET;
    for (var p = 0; p < 4; p++) {
      var c = LOOP[so[p]];
      map[c[0] + ',' + c[1]].start = p;
      map[c[0] + ',' + c[1]].safe = true;
    }
    // 終點通道
    for (var owner = 0; owner < 4; owner++) {
      var hc = HOME_COLS[owner];
      for (var h = 0; h < hc.length; h++) {
        map[hc[h][0] + ',' + hc[h][1]] = { type: 'homecol', owner: owner };
      }
    }
    return map;
  };
})(window.Ludo);
