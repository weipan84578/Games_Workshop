(function(ER) {
    var _offscreenFar = null, _offscreenMid = null, _offscreenNear = null;
    var _bgScrollFar = 0, _bgScrollMid = 0, _bgScrollNear = 0;
    var _bgBuilt = false;
    var BG_W = 1600;

    function buildFarBG(w, h, groundY) {
        var c = document.createElement('canvas');
        c.width = w; c.height = groundY;
        var ctx = c.getContext('2d');
        // Distant city silhouette
        ctx.fillStyle = '#1A1A3E';
        var seed = 1;
        function sr() { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; }
        var bx = 0;
        while (bx < w) {
            var bw = Math.floor(sr() * 80 + 40);
            var bh = Math.floor(sr() * groundY * 0.4 + groundY * 0.1);
            ctx.fillRect(bx, groundY - bh, bw, bh);
            bx += bw + Math.floor(sr() * 10);
        }
        // Antenna lights
        ctx.fillStyle = '#FF3B3B';
        seed = 42;
        for (var i = 0; i < 12; i++) {
            var lx = Math.floor(sr() * w);
            var ly = Math.floor(sr() * groundY * 0.35);
            ctx.beginPath(); ctx.arc(lx, ly, 2, 0, Math.PI*2); ctx.fill();
        }
        return c;
    }

    function buildMidBG(w, h, groundY) {
        var c = document.createElement('canvas');
        c.width = w; c.height = groundY;
        var ctx = c.getContext('2d');
        var seed = 7;
        function sr() { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; }
        // Buildings with windows
        var bx = 0;
        while (bx < w) {
            var bw = Math.floor(sr() * 70 + 30);
            var bh = Math.floor(sr() * groundY * 0.55 + groundY * 0.1);
            var hue = sr() < 0.5 ? '#1E2A4A' : '#2A1E4A';
            ctx.fillStyle = hue;
            ctx.fillRect(bx, groundY - bh, bw, bh);
            // Neon edge
            var neonColors = ['#FF6B3522','#00D4FF22','#FF3B3B22'];
            ctx.strokeStyle = neonColors[Math.floor(sr() * neonColors.length)];
            ctx.lineWidth = 1;
            ctx.strokeRect(bx, groundY - bh, bw, bh);
            // Windows
            var wrows = Math.floor(bh / 18), wcols = Math.floor(bw / 14);
            for (var r = 0; r < wrows; r++) {
                for (var col = 0; col < wcols; col++) {
                    if (sr() > 0.4) {
                        var wc = sr() < 0.3 ? '#00D4FF88' : sr() < 0.5 ? '#FFD70088' : '#FF6B3588';
                        ctx.fillStyle = wc;
                        ctx.fillRect(bx + col*14 + 3, groundY - bh + r*18 + 3, 8, 10);
                    }
                }
            }
            bx += bw + Math.floor(sr() * 8 + 2);
        }
        return c;
    }

    function buildNearBG(w, h, groundY) {
        var c = document.createElement('canvas');
        c.width = w; c.height = groundY;
        var ctx = c.getContext('2d');
        var seed = 13;
        function sr() { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; }
        // Lamp posts
        for (var i = 0; i < Math.floor(w / 160); i++) {
            var lx = i * 160 + Math.floor(sr() * 40);
            // Post
            ctx.strokeStyle = '#4A4A8A';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(lx, groundY);
            ctx.lineTo(lx, groundY - 80);
            ctx.lineTo(lx + 16, groundY - 80);
            ctx.stroke();
            // Light glow
            var lgrd = ctx.createRadialGradient(lx + 16, groundY - 80, 0, lx + 16, groundY - 80, 30);
            lgrd.addColorStop(0, 'rgba(255,220,100,0.6)');
            lgrd.addColorStop(1, 'transparent');
            ctx.fillStyle = lgrd;
            ctx.beginPath(); ctx.arc(lx + 16, groundY - 80, 30, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#FFDC64';
            ctx.beginPath(); ctx.arc(lx + 16, groundY - 80, 5, 0, Math.PI*2); ctx.fill();
        }
        // Near buildings (dark)
        var bx = 0;
        while (bx < w) {
            var bw = Math.floor(sr() * 60 + 20);
            var bh = Math.floor(sr() * groundY * 0.35 + groundY * 0.05);
            ctx.fillStyle = 'rgba(8,8,24,0.85)';
            ctx.fillRect(bx, groundY - bh, bw, bh);
            bx += bw + Math.floor(sr() * 30 + 10);
        }
        return c;
    }

    function buildOrRebuild(cw, ch) {
        var groundY = Math.floor(ch * 0.75);
        _offscreenFar = buildFarBG(BG_W, ch, groundY);
        _offscreenMid = buildMidBG(BG_W, ch, groundY);
        _offscreenNear = buildNearBG(BG_W, ch, groundY);
        _bgBuilt = true;
    }

    function drawTiled(ctx, offscreen, scrollX, dh) {
        var sw = offscreen.width;
        var ox = -(scrollX % sw);
        if (ox > 0) ox -= sw;
        ctx.drawImage(offscreen, ox, 0);
        ctx.drawImage(offscreen, ox + sw, 0);
        if (ox + sw * 2 < dh) ctx.drawImage(offscreen, ox + sw * 2, 0);
    }

    ER.Renderer = {
        canvas: null,
        ctx: null,
        // Fixed logical resolution for internal game logic
        LOGICAL_WIDTH: 1280,
        LOGICAL_HEIGHT: 720,

        init: function(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.resize();
        },

        resize: function() {
            var c      = this.canvas;
            var aspect = this.LOGICAL_WIDTH / this.LOGICAL_HEIGHT;
            
            var vp = window.visualViewport;
            var vw = Math.floor(vp ? vp.width  : window.innerWidth);
            var vh = Math.floor(vp ? vp.height : window.innerHeight);

            // CSS display size: fill the visible viewport maintaining aspect ratio
            var dispW, dispH;
            if (vw / vh > aspect) {
                dispH = vh;
                dispW = Math.round(vh * aspect);
            } else {
                dispW = vw;
                dispH = Math.round(vw / aspect);
            }

            // Buffer size: match actual pixels for sharpness (DPI aware)
            var dpr = window.devicePixelRatio || 1;
            c.width  = this.LOGICAL_WIDTH * dpr;
            c.height = this.LOGICAL_HEIGHT * dpr;

            // Set display size via CSS
            c.style.width  = dispW + 'px';
            c.style.height = dispH + 'px';

            // Scale context so we can use logical coordinates (0-1280, 0-720)
            this.ctx.resetTransform();
            this.ctx.scale(dpr, dpr);

            _bgBuilt = false;

            // Notify current scene to re-layout UI using logical dimensions
            if (ER.Game && ER.Game.getCurrentScene()) {
                var scene = ER.Game.getCurrentScene();
                if (scene.layout) scene.layout(this.LOGICAL_WIDTH, this.LOGICAL_HEIGHT);
            }
        },

        getGroundY: function() { return Math.floor(this.LOGICAL_HEIGHT * 0.75); },

        update: function(dt, worldSpeed) {
            if (!_bgBuilt) buildOrRebuild(this.canvas.width, this.canvas.height);
            var spd = worldSpeed * (dt / 16.67);
            _bgScrollFar += spd * 0.1;
            _bgScrollMid += spd * 0.3;
            _bgScrollNear += spd * 0.6;
        },

        drawBackground: function() {
            var ctx = this.ctx;
            var cw = this.canvas.width, ch = this.canvas.height;
            var groundY = this.getGroundY();

            // Layer 0: Sky gradient
            var sky = ctx.createLinearGradient(0, 0, 0, groundY);
            sky.addColorStop(0, '#0A0A1A');
            sky.addColorStop(0.6, '#0E0E2E');
            sky.addColorStop(1, '#1A1A3E');
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, cw, groundY);

            // Stars
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            for (var i = 0; i < 40; i++) {
                var sx = (ER.Math.seededRandom(i * 7.3) * cw);
                var sy = (ER.Math.seededRandom(i * 3.7) * groundY * 0.7);
                var br = 0.4 + 0.6 * Math.abs(Math.sin(Date.now() * 0.001 + i));
                ctx.globalAlpha = br * 0.5;
                ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI*2); ctx.fill();
            }
            ctx.globalAlpha = 1;

            if (!_bgBuilt) return;

            // Layer 1: Far BG (0.1x)
            drawTiled(ctx, _offscreenFar, _bgScrollFar, cw);

            // Layer 2: Mid BG (0.3x)
            drawTiled(ctx, _offscreenMid, _bgScrollMid, cw);

            // Layer 3: Near BG (0.6x)
            drawTiled(ctx, _offscreenNear, _bgScrollNear, cw);
        },

        drawGround: function(worldX) {
            var ctx = this.ctx;
            var cw = this.canvas.width, ch = this.canvas.height;
            var groundY = this.getGroundY();

            // Ground base
            var grd = ctx.createLinearGradient(0, groundY, 0, ch);
            grd.addColorStop(0, '#2D2D5A');
            grd.addColorStop(1, '#1A1A3E');
            ctx.fillStyle = grd;
            ctx.fillRect(0, groundY, cw, ch - groundY);

            // Ground top edge glow
            ctx.strokeStyle = '#00D4FF';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#00D4FF';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(0, groundY); ctx.lineTo(cw, groundY);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Tile grid lines (horizontal)
            ctx.strokeStyle = 'rgba(0,212,255,0.15)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            var tileH = 20;
            for (var y = groundY + tileH; y < ch; y += tileH) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
            }

            // Tile grid lines (vertical - scrolling)
            var tileW = 64;
            var offset = worldX % tileW;
            for (var x = -offset; x < cw; x += tileW) {
                ctx.beginPath(); ctx.moveTo(x, groundY); ctx.lineTo(x, ch); ctx.stroke();
            }
        }
    };
})(window.ER = window.ER || {});
