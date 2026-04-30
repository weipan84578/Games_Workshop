(function(ER) {
    ER.HUD = {
        draw: function(ctx, cw, ch, state) {
            // HUD uses LOGICAL resolution
            cw = ER.Renderer.LOGICAL_WIDTH;
            ch = ER.Renderer.LOGICAL_HEIGHT;

            var score = state.score || 0;
            var best = state.bestScore || 0;
            var lives = state.lives != null ? state.lives : 3;
            var speed = state.speed || 5;

            ctx.save();
            // HUD background bar
            var grd = ctx.createLinearGradient(0, 0, 0, 60);
            grd.addColorStop(0, 'rgba(5,5,20,0.85)');
            grd.addColorStop(1, 'rgba(5,5,20,0)');
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, cw, 60);

            // Score
            ctx.fillStyle = '#FF6B35';
            ctx.shadowColor = '#FF6B35';
            ctx.shadowBlur = 6;
            ctx.font = "bold 18px 'Orbitron', monospace";
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText('SCORE', 24, 20);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowBlur = 0;
            ctx.font = "bold 24px 'Orbitron', monospace";
            var scoreStr = String(score).padStart(6, '0');
            ctx.fillText(scoreStr, 24, 42);
            
            // Lives - fixed position after score in logical space
            var heartX = 260;
            for (var i = 0; i < 3; i++) {
                this._drawHeart(ctx, heartX + i * 32, 30, i < lives);
            }

            // Best score (center)
            var bestX = cw / 2;
            ctx.fillStyle = '#FFD700';
            ctx.font = "bold 16px 'Orbitron', monospace";
            ctx.textAlign = 'center';
            ctx.fillText('BEST', bestX, 18);
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 4;
            ctx.font = "bold 20px 'Orbitron', monospace";
            ctx.fillText(String(best).padStart(6, '0'), bestX, 40);
            ctx.shadowBlur = 0;

            // Speed indicator
            var speedMult = (speed / ER.Physics.INITIAL_SPEED).toFixed(1);
            ctx.fillStyle = '#00D4FF';
            ctx.font = "14px 'Press Start 2P', monospace";
            ctx.textAlign = 'right';
            ctx.fillText('x' + speedMult, cw - 70, 40);

            // Pause button
            ctx.fillStyle = '#F0F0FF';
            ctx.font = "24px sans-serif";
            ctx.textAlign = 'right';
            ctx.fillText('⏸', cw - 24, 30);

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
