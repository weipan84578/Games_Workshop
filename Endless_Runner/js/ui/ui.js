(function(ER) {
    var _floatTexts = [];

    function Button(x, y, w, h, label, style) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.label = label;
        this.style = style || {};
        this._hovered = false;
    }

    Button.prototype.isHit = function(px, py) {
        return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
    };

    Button.prototype.draw = function(ctx, scale) {
        scale = scale || 1;
        var x = this.x, y = this.y, w = this.w, h = this.h;
        var s = this.style;
        var bgColor = s.bg || '#FF6B35';
        var textColor = s.textColor || '#FFFFFF';
        var borderColor = s.border || bgColor;

        ctx.save();
        // Shadow / glow
        ctx.shadowColor = borderColor;
        ctx.shadowBlur = this._hovered ? 16 : 8;

        // Background
        ctx.fillStyle = bgColor;
        this._roundRect(ctx, x, y, w, h, 6);
        ctx.fill();

        // Border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        this._roundRect(ctx, x, y, w, h, 6);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Text
        ctx.fillStyle = textColor;
        var fontSize = s.fontSize || Math.floor(h * 0.35);
        ctx.font = 'bold ' + fontSize + "px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, x + w/2, y + h/2 + 1);

        ctx.restore();
    };

    Button.prototype._roundRect = function(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    };

    ER.UI = {
        Button: Button,

        drawModal: function(ctx, x, y, w, h) {
            ctx.save();
            ctx.fillStyle = 'rgba(10,10,30,0.92)';
            ctx.shadowColor = '#00D4FF';
            ctx.shadowBlur = 20;
            this._roundRect(ctx, x, y, w, h, 12);
            ctx.fill();
            ctx.strokeStyle = '#00D4FF';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 8;
            this._roundRect(ctx, x, y, w, h, 12);
            ctx.stroke();
            ctx.restore();
        },

        _roundRect: function(ctx, x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
            ctx.quadraticCurveTo(x+w,y,x+w,y+r);
            ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
            ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
            ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
            ctx.closePath();
        },

        drawOverlay: function(ctx, cw, ch, alpha) {
            ctx.save();
            ctx.fillStyle = 'rgba(5,5,15,' + (alpha || 0.6) + ')';
            ctx.fillRect(0, 0, cw, ch);
            ctx.restore();
        },

        drawText: function(ctx, text, x, y, style) {
            var s = style || {};
            ctx.save();
            ctx.font = (s.weight || 'bold') + ' ' + (s.size || 16) + "px '" + (s.font || 'Press Start 2P') + "', monospace";
            ctx.textAlign = s.align || 'center';
            ctx.textBaseline = s.baseline || 'middle';
            if (s.glow) {
                ctx.shadowColor = s.glow;
                ctx.shadowBlur = 12;
            }
            if (s.stroke) {
                ctx.strokeStyle = s.stroke;
                ctx.lineWidth = s.strokeWidth || 3;
                ctx.strokeText(text, x, y);
            }
            ctx.fillStyle = s.color || '#FFFFFF';
            ctx.fillText(text, x, y);
            ctx.restore();
        },

        drawSlider: function(ctx, x, y, w, h, value, label, opts) {
            opts = opts || {};
            var labelSize  = opts.labelSize  || 10;
            var trackH     = opts.trackH     || 8;
            var thumbR     = opts.thumbR     || 10;
            var labelOff   = opts.labelOff   || 20;
            ctx.save();
            var cy = y + h / 2;
            // Track background
            ctx.fillStyle = '#1A1A3E';
            ctx.fillRect(x, cy - trackH/2, w, trackH);
            ctx.strokeStyle = '#2D2D5A';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, cy - trackH/2, w, trackH);
            // Filled portion
            ctx.fillStyle = '#00D4FF';
            ctx.fillRect(x, cy - trackH/2, w * value, trackH);
            // Thumb
            var tx = x + w * value;
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#00D4FF';
            ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(tx, cy, thumbR, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
            // Label
            ctx.fillStyle = '#F0F0FF';
            ctx.font = "bold " + labelSize + "px 'Press Start 2P', monospace";
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(label + '  ' + Math.round(value * 100) + '%', x, cy - labelOff);
            ctx.restore();
        },

        addFloatText: function(text, x, y, color) {
            _floatTexts.push({ text: text, x: x, y: y, vy: -2, life: 600, maxLife: 600, color: color || '#FFD700' });
        },

        updateFloatTexts: function(dt) {
            for (var i = _floatTexts.length - 1; i >= 0; i--) {
                var t = _floatTexts[i];
                t.y += t.vy * (dt / 16.67);
                t.life -= dt;
                if (t.life <= 0) _floatTexts.splice(i, 1);
            }
        },

        drawFloatTexts: function(ctx) {
            for (var i = 0; i < _floatTexts.length; i++) {
                var t = _floatTexts[i];
                var alpha = t.life / t.maxLife;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = t.color;
                ctx.shadowColor = t.color;
                ctx.shadowBlur = 6;
                ctx.font = "bold 14px 'Press Start 2P', monospace";
                ctx.textAlign = 'center';
                ctx.fillText(t.text, t.x, t.y);
                ctx.restore();
            }
        },

        clearFloatTexts: function() { _floatTexts = []; }
    };
})(window.ER = window.ER || {});
