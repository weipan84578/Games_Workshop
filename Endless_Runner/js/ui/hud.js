(function(ER) {
    ER.HUD = {
        draw: function(ctx, cw, ch, state) {
            var score = state.score || 0;
            var best = state.bestScore || 0;
            var lives = state.lives != null ? state.lives : 3;
            var speed = state.speed || 5;
            var gameTime = state.gameTime || 0;

            ctx.save();

            // HUD background bar
            var grd = ctx.createLinearGradient(0, 0, 0, 44);
            grd.addColorStop(0, 'rgba(5,5,20,0.85)');
            grd.addColorStop(1, 'rgba(5,5,20,0)');
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, cw, 44);

            // Score
            ctx.fillStyle = '#FF6B35';
            ctx.shadowColor = '#FF6B35';
            ctx.shadowBlur = 6;
            ctx.font = "bold 13px 'Orbitron', monospace";
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('SCORE', 16, 16);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowBlur = 0;
            ctx.font = "bold 16px 'Orbitron', monospace";
            ctx.fillText(String(score).padStart(6, '0'), 16, 31);

            // Lives
            var heartX = 200;
            for (var i = 0; i < 3; i++) {
                this._drawHeart(ctx, heartX + i * 26, 22, i < lives);
            }

            // Best score (center)
            ctx.fillStyle = '#FFD700';
            ctx.font = "bold 11px 'Orbitron', monospace";
            ctx.textAlign = 'center';
            ctx.fillText('BEST', cw/2, 14);
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 4;
            ctx.font = "bold 14px 'Orbitron', monospace";
            ctx.fillText(String(best).padStart(6, '0'), cw/2, 30);
            ctx.shadowBlur = 0;

            // Speed indicator
            var speedMult = (speed / ER.Physics.INITIAL_SPEED).toFixed(1);
            ctx.fillStyle = '#00D4FF';
            ctx.font = "9px 'Press Start 2P', monospace";
            ctx.textAlign = 'right';
            ctx.fillText('x' + speedMult, cw - 50, 30);

            // Pause button
            ctx.fillStyle = '#F0F0FF';
            ctx.font = "16px sans-serif";
            ctx.textAlign = 'right';
            ctx.fillText('⏸', cw - 16, 22);

            ctx.restore();

            // Float texts
            ER.UI.drawFloatTexts(ctx);
        },

        _drawHeart: function(ctx, cx, cy, filled) {
            ctx.save();
            ctx.fillStyle = filled ? '#FF3B3B' : '#333355';
            ctx.shadowColor = filled ? '#FF3B3B' : 'transparent';
            ctx.shadowBlur = filled ? 6 : 0;
            var s = 9;
            ctx.beginPath();
            ctx.moveTo(cx, cy + s * 0.4);
            ctx.bezierCurveTo(cx, cy - s*0.2, cx - s, cy - s*0.2, cx - s, cy + s*0.3);
            ctx.bezierCurveTo(cx - s, cy + s*0.8, cx, cy + s*1.1, cx, cy + s*1.1);
            ctx.bezierCurveTo(cx, cy + s*1.1, cx + s, cy + s*0.8, cx + s, cy + s*0.3);
            ctx.bezierCurveTo(cx + s, cy - s*0.2, cx, cy - s*0.2, cx, cy + s*0.4);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },

        getPauseButtonHitbox: function(cw) {
            return { x: cw - 36, y: 6, w: 30, h: 30 };
        }
    };
})(window.ER = window.ER || {});
