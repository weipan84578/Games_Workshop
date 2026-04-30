(function(ER) {
    ER.Physics = {
        GRAVITY: 0.6,
        JUMP_FORCE: -15,
        DOUBLE_JUMP_FORCE: -12,
        MAX_FALL_SPEED: 20,
        INITIAL_SPEED: 5,
        MAX_SPEED: 20,
        SPEED_INCREMENT: 0.001,

        SPEED_PRESET: {
            verySlow: { label: '超慢速', initial: 2,  max: 10, increment: 0.0003 },
            slow:     { label: '慢速',   initial: 3,  max: 14, increment: 0.0006 },
            normal:   { label: '普通',   initial: 5,  max: 20, increment: 0.001  },
            fast:     { label: '快速',   initial: 8,  max: 26, increment: 0.0015 },
            veryFast: { label: '超快速', initial: 13, max: 32, increment: 0.002  }
        },
        SPEED_PRESET_ORDER: ['verySlow', 'slow', 'normal', 'fast', 'veryFast'],

        aabb: function(a, b) {
            return a.x < b.x + b.w &&
                   a.x + a.w > b.x &&
                   a.y < b.y + b.h &&
                   a.y + a.h > b.y;
        }
    };
})(window.ER = window.ER || {});
