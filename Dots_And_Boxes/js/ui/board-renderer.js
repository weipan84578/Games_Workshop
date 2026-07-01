(function (ns) {
  "use strict";

  var root = null;
  var onMove = null;

  function point(model, row, col) {
    var boardSize = 840;
    var padding = 80;
    return {
      x: padding + col * (boardSize / model.cols),
      y: padding + row * (boardSize / model.rows)
    };
  }

  function appendOwnerMarker(svg, model, move, owner) {
    if (!owner) {
      return;
    }
    var start;
    var end;
    if (move.type === "h") {
      start = point(model, move.row, move.col);
      end = point(model, move.row, move.col + 1);
    } else {
      start = point(model, move.row, move.col);
      end = point(model, move.row + 1, move.col);
    }
    var cx = (start.x + end.x) / 2;
    var cy = (start.y + end.y) / 2;
    if (owner === "player") {
      svg.appendChild(ns.createSvg("circle", {
        class: "owner-marker--player",
        cx: cx,
        cy: cy,
        r: 8
      }));
    } else {
      svg.appendChild(ns.createSvg("rect", {
        class: "owner-marker--ai",
        x: cx - 8,
        y: cy - 8,
        width: 16,
        height: 16,
        rx: 2
      }));
    }
  }

  function createLineGroup(model, move, owner, disabled) {
    var start;
    var end;
    if (move.type === "h") {
      start = point(model, move.row, move.col);
      end = point(model, move.row, move.col + 1);
    } else {
      start = point(model, move.row, move.col);
      end = point(model, move.row + 1, move.col);
    }

    var group = ns.createSvg("g", {});
    if (!owner && !disabled) {
      var hit = ns.createSvg("line", {
        class: "line-hit",
        x1: start.x,
        y1: start.y,
        x2: end.x,
        y2: end.y,
        tabindex: "0",
        role: "button",
        "aria-label": move.type === "h" ? "horizontal line" : "vertical line"
      });
      hit.addEventListener("click", function () {
        onMove(move);
      });
      hit.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onMove(move);
        }
      });
      group.appendChild(hit);
    }
    group.appendChild(ns.createSvg("line", {
      class: "board-line board-line--" + (owner || "empty"),
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    }));
    return group;
  }

  ns.BoardRenderer = {
    mount: function (element, moveHandler) {
      root = element;
      onMove = moveHandler;
    },

    render: function (model, options) {
      if (!root || !model) {
        return;
      }
      var disabled = options && options.disabled;
      root.innerHTML = "";
      var svg = ns.createSvg("svg", {
        viewBox: "0 0 1000 1000",
        role: "application",
        "aria-label": "Dots and Boxes board"
      });

      for (var row = 0; row < model.rows; row += 1) {
        for (var col = 0; col < model.cols; col += 1) {
          var start = point(model, row, col);
          var next = point(model, row + 1, col + 1);
          svg.appendChild(ns.createSvg("rect", {
            class: "box-fill box-fill--" + (model.boxes[row][col].owner || "empty"),
            x: start.x + 12,
            y: start.y + 12,
            width: next.x - start.x - 24,
            height: next.y - start.y - 24,
            rx: 8
          }));
        }
      }

      model.horizontalLines.forEach(function (lineRow, rowIndex) {
        lineRow.forEach(function (line, colIndex) {
          svg.appendChild(createLineGroup(model, { type: "h", row: rowIndex, col: colIndex }, line.owner, disabled));
        });
      });
      model.verticalLines.forEach(function (lineRow, rowIndex) {
        lineRow.forEach(function (line, colIndex) {
          svg.appendChild(createLineGroup(model, { type: "v", row: rowIndex, col: colIndex }, line.owner, disabled));
        });
      });

      model.horizontalLines.forEach(function (lineRow, rowIndex) {
        lineRow.forEach(function (line, colIndex) {
          appendOwnerMarker(svg, model, { type: "h", row: rowIndex, col: colIndex }, line.owner);
        });
      });
      model.verticalLines.forEach(function (lineRow, rowIndex) {
        lineRow.forEach(function (line, colIndex) {
          appendOwnerMarker(svg, model, { type: "v", row: rowIndex, col: colIndex }, line.owner);
        });
      });

      for (var dotRow = 0; dotRow <= model.rows; dotRow += 1) {
        for (var dotCol = 0; dotCol <= model.cols; dotCol += 1) {
          var dot = point(model, dotRow, dotCol);
          svg.appendChild(ns.createSvg("circle", {
            class: "board-dot",
            cx: dot.x,
            cy: dot.y,
            r: 14
          }));
        }
      }
      root.appendChild(svg);
    }
  };
})(window.DAB = window.DAB || {});
