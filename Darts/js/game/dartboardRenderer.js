(function () {
  "use strict";

  window.Darts = window.Darts || {};

  var SVG_NS = "http://www.w3.org/2000/svg";
  var OUTER_RADIUS = 0.92;
  var DOUBLE_INNER = 0.82;
  var TRIPLE_OUTER = 0.54;
  var TRIPLE_INNER = 0.45;
  var BULL_OUTER = 0.1;
  var BULL_INNER = 0.05;

  function svgEl(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function point(radius, degrees) {
    var radians = degrees * Math.PI / 180;
    return {
      x: Math.sin(radians) * radius,
      y: -Math.cos(radians) * radius
    };
  }

  function wedgePath(inner, outer, start, end) {
    var p1 = point(outer, start);
    var p2 = point(outer, end);
    var p3 = point(inner, end);
    var p4 = point(inner, start);
    var large = end - start > 180 ? 1 : 0;
    return [
      "M", p1.x, p1.y,
      "A", outer, outer, 0, large, 1, p2.x, p2.y,
      "L", p3.x, p3.y,
      "A", inner, inner, 0, large, 0, p4.x, p4.y,
      "Z"
    ].join(" ");
  }

  function render(host) {
    host.textContent = "";
    var svg = svgEl("svg", {
      viewBox: "-1 -1 2 2",
      role: "img",
      "aria-label": "Dartboard"
    });
    var boardGroup = svgEl("g", { class: "board-zones" });
    var markerGroup = svgEl("g", { class: "board-markers" });
    var flightGroup = svgEl("g", { class: "board-flight" });
    var reticleGroup = svgEl("g", { class: "aim-reticle" });

    boardGroup.appendChild(svgEl("circle", { cx: 0, cy: 0, r: 0.99, fill: "#191919" }));
    boardGroup.appendChild(svgEl("circle", { cx: 0, cy: 0, r: OUTER_RADIUS, fill: "#222" }));

    window.Darts.Scoring.BOARD_NUMBERS.forEach(function (number, index) {
      var center = index * 18;
      var start = center - 9;
      var end = center + 9;
      var dark = index % 2 === 0;
      var singleColor = dark ? "#242424" : "#f3ead2";
      var bandColor = dark ? "#c82f3d" : "#2c9a63";
      boardGroup.appendChild(svgEl("path", {
        d: wedgePath(DOUBLE_INNER, OUTER_RADIUS, start, end),
        fill: bandColor,
        stroke: "#111",
        "stroke-width": 0.006
      }));
      boardGroup.appendChild(svgEl("path", {
        d: wedgePath(TRIPLE_OUTER, DOUBLE_INNER, start, end),
        fill: singleColor,
        stroke: "#111",
        "stroke-width": 0.004
      }));
      boardGroup.appendChild(svgEl("path", {
        d: wedgePath(TRIPLE_INNER, TRIPLE_OUTER, start, end),
        fill: bandColor,
        stroke: "#111",
        "stroke-width": 0.006
      }));
      boardGroup.appendChild(svgEl("path", {
        d: wedgePath(BULL_OUTER, TRIPLE_INNER, start, end),
        fill: singleColor,
        stroke: "#111",
        "stroke-width": 0.004
      }));
      var labelPoint = point(0.965, center);
      var label = svgEl("text", {
        x: labelPoint.x,
        y: labelPoint.y + 0.025,
        fill: "#f9f2e6",
        "font-size": "0.075",
        "font-family": "system-ui, sans-serif",
        "font-weight": "800",
        "text-anchor": "middle"
      });
      label.textContent = number;
      boardGroup.appendChild(label);
    });

    boardGroup.appendChild(svgEl("circle", { cx: 0, cy: 0, r: BULL_OUTER, fill: "#2c9a63", stroke: "#111", "stroke-width": 0.006 }));
    boardGroup.appendChild(svgEl("circle", { cx: 0, cy: 0, r: BULL_INNER, fill: "#c82f3d", stroke: "#111", "stroke-width": 0.006 }));
    boardGroup.appendChild(svgEl("circle", { cx: 0, cy: 0, r: OUTER_RADIUS, fill: "none", stroke: "#111", "stroke-width": 0.014 }));

    reticleGroup.appendChild(svgEl("circle", { cx: 0, cy: 0, r: 0.045, fill: "none", stroke: "var(--focus)", "stroke-width": 0.012 }));
    reticleGroup.appendChild(svgEl("line", { x1: -0.075, y1: 0, x2: 0.075, y2: 0, stroke: "var(--focus)", "stroke-width": 0.008 }));
    reticleGroup.appendChild(svgEl("line", { x1: 0, y1: -0.075, x2: 0, y2: 0.075, stroke: "var(--focus)", "stroke-width": 0.008 }));

    svg.appendChild(boardGroup);
    svg.appendChild(flightGroup);
    svg.appendChild(markerGroup);
    svg.appendChild(reticleGroup);
    host.appendChild(svg);
    host._dartsSvg = svg;
    host._markerGroup = markerGroup;
    host._flightGroup = flightGroup;
    host._reticleGroup = reticleGroup;
    setReticle(host, { x: 0, y: 0 });
    return svg;
  }

  function normalizedFromClient(host, clientX, clientY) {
    var rect = host.getBoundingClientRect();
    var size = Math.min(rect.width, rect.height);
    var x = (clientX - rect.left - rect.width / 2) / (size / 2);
    var y = (clientY - rect.top - rect.height / 2) / (size / 2);
    return { x: x, y: y };
  }

  function hitFromNormalized(pointValue) {
    var x = pointValue.x;
    var y = pointValue.y;
    var radius = Math.sqrt(x * x + y * y);
    if (radius > OUTER_RADIUS) {
      return { segment: "miss", value: 0, multiplier: 0, radius: radius };
    }
    if (radius <= BULL_INNER) {
      return { segment: "bull", value: 25, multiplier: 2, radius: radius };
    }
    if (radius <= BULL_OUTER) {
      return { segment: "outerBull", value: 25, multiplier: 1, radius: radius };
    }
    var degrees = Math.atan2(x, -y) * 180 / Math.PI;
    if (degrees < 0) {
      degrees += 360;
    }
    var index = Math.floor((degrees + 9) / 18) % 20;
    var value = window.Darts.Scoring.BOARD_NUMBERS[index];
    var segment = "single";
    var multiplier = 1;
    if (radius >= DOUBLE_INNER && radius <= OUTER_RADIUS) {
      segment = "double";
      multiplier = 2;
    } else if (radius >= TRIPLE_INNER && radius <= TRIPLE_OUTER) {
      segment = "triple";
      multiplier = 3;
    }
    return {
      segment: segment,
      value: value,
      multiplier: multiplier,
      radius: radius,
      angle: degrees
    };
  }

  function setReticle(host, pointValue) {
    if (!host || !host._reticleGroup) {
      return;
    }
    host._reticleGroup.setAttribute("transform", "translate(" + pointValue.x + " " + pointValue.y + ")");
  }

  function renderMarkers(host, markers) {
    if (!host || !host._markerGroup) {
      return;
    }
    host._markerGroup.textContent = "";
    (markers || []).forEach(function (marker) {
      var group = svgEl("g", { transform: "translate(" + marker.x + " " + marker.y + ")" });
      group.appendChild(svgEl("circle", {
        cx: 0,
        cy: 0,
        r: 0.027,
        fill: marker.color || "#fff",
        stroke: "#111",
        "stroke-width": 0.007
      }));
      group.appendChild(svgEl("line", {
        x1: 0,
        y1: -0.08,
        x2: 0,
        y2: -0.015,
        stroke: marker.color || "#fff",
        "stroke-width": 0.01,
        "stroke-linecap": "round"
      }));
      host._markerGroup.appendChild(group);
    });
  }

  function quadraticPoint(from, control, to, progress) {
    var inverse = 1 - progress;
    return {
      x: inverse * inverse * from.x + 2 * inverse * progress * control.x + progress * progress * to.x,
      y: inverse * inverse * from.y + 2 * inverse * progress * control.y + progress * progress * to.y
    };
  }

  function renderFlight(host, from, control, to, progress, color) {
    if (!host || !host._flightGroup) {
      return;
    }
    var tip = quadraticPoint(from, control, to, progress);
    var tailProgress = Math.max(0, progress - 0.08);
    var tail = quadraticPoint(from, control, to, tailProgress);
    host._flightGroup.textContent = "";
    var group = svgEl("g", { transform: "translate(" + tip.x + " " + tip.y + ")" });
    var angle = Math.atan2(tip.y - tail.y, tip.x - tail.x) * 180 / Math.PI;
    group.setAttribute("transform", "translate(" + tip.x + " " + tip.y + ") rotate(" + angle + ")");
    group.appendChild(svgEl("line", {
      x1: -0.11,
      y1: 0,
      x2: 0.02,
      y2: 0,
      stroke: color || "var(--focus)",
      "stroke-width": 0.018,
      "stroke-linecap": "round"
    }));
    group.appendChild(svgEl("path", {
      d: "M -0.13 -0.035 L -0.2 0 L -0.13 0.035 Z",
      fill: color || "var(--focus)",
      stroke: "#111",
      "stroke-width": 0.006
    }));
    group.appendChild(svgEl("circle", {
      cx: 0.035,
      cy: 0,
      r: 0.018,
      fill: "#f8f2da",
      stroke: "#111",
      "stroke-width": 0.006
    }));
    host._flightGroup.appendChild(group);
  }

  function clearFlight(host) {
    if (host && host._flightGroup) {
      host._flightGroup.textContent = "";
    }
  }

  function pointForTarget(segment, value) {
    if (segment === "bull") {
      return { x: 0, y: 0 };
    }
    if (segment === "outerBull") {
      return { x: 0, y: -0.075 };
    }
    var index = window.Darts.Scoring.BOARD_NUMBERS.indexOf(value);
    var degrees = index === -1 ? 0 : index * 18;
    var radius = 0.28;
    if (segment === "double") {
      radius = 0.87;
    } else if (segment === "triple") {
      radius = 0.495;
    } else if (segment === "singleOuter") {
      radius = 0.67;
    }
    return point(radius, degrees);
  }

  window.Darts.Dartboard = {
    render: render,
    normalizedFromClient: normalizedFromClient,
    hitFromNormalized: hitFromNormalized,
    hitFromClient: function (host, clientX, clientY) {
      return hitFromNormalized(normalizedFromClient(host, clientX, clientY));
    },
    setReticle: setReticle,
    renderMarkers: renderMarkers,
    renderFlight: renderFlight,
    clearFlight: clearFlight,
    pointForTarget: pointForTarget,
    clampPoint: function (pointValue) {
      return {
        x: Math.max(-0.98, Math.min(0.98, pointValue.x)),
        y: Math.max(-0.98, Math.min(0.98, pointValue.y))
      };
    }
  };
})();
