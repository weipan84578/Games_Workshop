(function(ER) {
    ER.Math = {
        randomBetween: function(min, max) { return Math.random() * (max - min) + min; },
        randomInt: function(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
        lerp: function(a, b, t) { return a + (b - a) * t; },
        clamp: function(val, min, max) { return Math.max(min, Math.min(max, val)); },
        weightedRandom: function(items) {
            var total = items.reduce(function(s, i) { return s + i.weight; }, 0);
            var r = Math.random() * total, sum = 0;
            for (var i = 0; i < items.length; i++) {
                sum += items[i].weight;
                if (r <= sum) return items[i].type;
            }
            return items[items.length - 1].type;
        },
        easeOut: function(t) { return 1 - Math.pow(1 - t, 3); },
        easeInOut: function(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; },
        seededRandom: function(seed) {
            var x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        }
    };
})(window.ER = window.ER || {});
