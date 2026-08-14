(function (root) {
    "use strict";

    var cg = root.CastleGame = root.CastleGame || {};
    function level(number, weather, gates, pace, hpScale) { return { number: number, weather: weather, gates: gates, enemyPace: pace, hpScale: hpScale || 1 }; }
    var levels = [
        level(1, "clear", [{ value: 2, type: "multiply", icon: "↑", move: "still" }, { value: 3, type: "multiply", icon: "↑", move: "still" }], 1.08),
        level(2, "cloud", [{ value: 2, type: "multiply", icon: "↑", move: "sway" }, { value: 3, type: "multiply", icon: "↑", move: "still" }, { value: 4, type: "multiply", icon: "↑", move: "sway" }], 1.05),
        level(3, "clear", [{ value: 3, type: "multiply", icon: "↑", move: "sway" }, { value: 5, type: "multiply", icon: "↑", move: "still" }, { value: 2, type: "multiply", icon: "↑", move: "sway" }], 1),
        level(4, "sunset", [{ value: 2, type: "multiply", icon: "↑", move: "slide" }, { value: 5, type: "multiply", icon: "↑", move: "sway" }, { value: 3, type: "multiply", icon: "↑", move: "slide" }], .97),
        level(5, "cloud", [{ value: 5, type: "multiply", icon: "↑", move: "slide" }, { value: 2, type: "multiply", icon: "↑", move: "sway" }, { value: 5, type: "multiply", icon: "↑", move: "slide" }], .94),
        level(6, "rain", [{ value: 3, type: "multiply", icon: "↑", move: "slide" }, { value: 2, type: "divide", icon: "⚠", move: "sway" }, { value: 5, type: "multiply", icon: "↑", move: "slide" }], .91),
        level(7, "sunset", [{ value: 5, type: "multiply", icon: "↑", move: "slide" }, { value: 2, type: "divide", icon: "⚠", move: "sway" }, { value: 10, type: "multiply", icon: "↑", move: "slide" }], .88),
        level(8, "night", [{ value: 2, type: "multiply", icon: "↑", move: "sway" }, { value: 5, type: "multiply", icon: "↑", move: "slide" }, { value: 2, type: "divide", icon: "⚠", move: "sway" }, { value: 3, type: "multiply", icon: "↑", move: "slide" }], .85),
        level(9, "snow", [{ value: 5, type: "multiply", icon: "↑", move: "slide" }, { value: 10, type: "multiply", icon: "↑", move: "sway" }, { value: 2, type: "divide", icon: "⚠", move: "sway" }], .82),
        level(10, "night", [{ value: 3, type: "multiply", icon: "↑", move: "slide" }, { value: 5, type: "multiply", icon: "↑", move: "sway" }, { value: 10, type: "multiply", icon: "↑", move: "slide" }, { value: 2, type: "divide", icon: "⚠", move: "sway" }], .79, 1.1),
        level(11, "rain", [{ value: 5, type: "multiply", icon: "↑", move: "slide" }, { value: 5, type: "multiply", icon: "↑", move: "sway" }, { value: 2, type: "divide", icon: "⚠", move: "sway" }, { value: 10, type: "multiply", icon: "↑", move: "slide" }], .77, 1.12),
        level(12, "sunset", [{ value: 10, type: "multiply", icon: "↑", move: "slide" }, { value: 2, type: "divide", icon: "⚠", move: "sway" }, { value: 5, type: "multiply", icon: "↑", move: "slide" }, { value: 3, type: "multiply", icon: "↑", move: "sway" }], .74, 1.15),
        level(13, "cloud", [{ value: 2, type: "multiply", icon: "↑", move: "sway" }, { value: 10, type: "multiply", icon: "↑", move: "slide" }, { value: 2, type: "divide", icon: "⚠", move: "sway" }, { value: 5, type: "multiply", icon: "↑", move: "slide" }], .72, 1.18),
        level(14, "night", [{ value: 5, type: "multiply", icon: "↑", move: "slide" }, { value: 2, type: "divide", icon: "⚠", move: "sway" }, { value: 10, type: "multiply", icon: "↑", move: "sway" }, { value: 5, type: "multiply", icon: "↑", move: "slide" }], .7, 1.2),
        level(15, "rain", [{ value: 3, type: "multiply", icon: "↑", move: "slide" }, { value: 5, type: "multiply", icon: "↑", move: "sway" }, { value: 2, type: "divide", icon: "⚠", move: "slide" }, { value: 10, type: "multiply", icon: "↑", move: "slide" }], .68, 1.23),
        level(16, "snow", [{ value: 10, type: "multiply", icon: "★", move: "slide", special: true }, { value: 2, type: "divide", icon: "⚠", move: "sway" }, { value: 5, type: "multiply", icon: "↑", move: "slide" }, { value: 10, type: "multiply", icon: "★", move: "sway", special: true }], .66, 1.26),
        level(17, "sunset", [{ value: 5, type: "multiply", icon: "↑", move: "slide" }, { value: 10, type: "multiply", icon: "★", move: "sway", special: true }, { value: 2, type: "divide", icon: "⚠", move: "slide" }, { value: 5, type: "multiply", icon: "↑", move: "slide" }], .64, 1.3),
        level(18, "night", [{ value: 10, type: "multiply", icon: "★", move: "slide", special: true }, { value: 2, type: "divide", icon: "⚠", move: "sway" }, { value: 10, type: "multiply", icon: "↑", move: "slide" }, { value: 5, type: "multiply", icon: "↑", move: "sway" }], .62, 1.34),
        level(19, "rain", [{ value: 5, type: "multiply", icon: "↑", move: "sway" }, { value: 2, type: "divide", icon: "⚠", move: "slide" }, { value: 10, type: "multiply", icon: "★", move: "slide", special: true }, { value: 10, type: "multiply", icon: "↑", move: "sway" }], .6, 1.38),
        level(20, "night", [{ value: 5, type: "multiply", icon: "★", move: "slide", special: true }, { value: 10, type: "multiply", icon: "↑", move: "sway" }, { value: 2, type: "divide", icon: "⚠", move: "slide" }, { value: 10, type: "multiply", icon: "★", move: "slide", special: true }], .58, 1.44)
    ];
    cg.Level = {
        get: function (number) {
            var value = levels[Math.max(0, Math.min(levels.length - 1, (Number(number) || 1) - 1))];
            return JSON.parse(JSON.stringify(value));
        },
        count: levels.length
    };
}(window));
