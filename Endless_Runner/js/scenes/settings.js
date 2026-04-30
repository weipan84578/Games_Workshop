(function(ER) {
    var _tempSettings = null;
    var _sliders = {};
    var _btnSave;
    var _qualityOptions = ['high', 'medium', 'low'];
    var _qualityLabels  = ['HIGH', 'MED', 'LOW'];
    var _layout = {};

    // Button geometry for option rows
    var QUAL_BTN_W  = 130, QUAL_BTN_H  = 52, QUAL_GAP  = 16;
    var SPEED_BTN_W =  88, SPEED_BTN_H = 52, SPEED_GAP = 10;

    ER.Settings = {
        enter: function() {
            var data = ER.Storage.load();
            _tempSettings = JSON.parse(JSON.stringify(data.settings));
            if (!_tempSettings.speedPreset) _tempSettings.speedPreset = 'normal';

            var cw = ER.Renderer.canvas.width;
            var ch = ER.Renderer.canvas.height;
            var mx = cw / 2;

            // Modal dimensions — fill ~80% of the canvas
            var mw = Math.min(560, cw - 60);
            var mh = Math.min(520, ch - 60);
            var mTop = Math.floor(ch / 2 - mh / 2);
            var sw   = mw - 80;   // slider width

            _layout = {
                mx: mx, mTop: mTop, mw: mw, mh: mh,
                sliderX: mx - sw / 2, sliderW: sw,
                titleY:  mTop + 42,
                bgmY:    mTop + 105,
                sfxY:    mTop + 190,
                qualLY:  mTop + 272,
                qualY:   mTop + 308,
                spdLY:   mTop + 372,
                spdY:    mTop + 410,
                spdInfoY:mTop + 442,
                saveY:   mTop + 480
            };

            _sliders.bgm = { x: _layout.sliderX, y: _layout.bgmY, w: sw };
            _sliders.sfx = { x: _layout.sliderX, y: _layout.sfxY, w: sw };

            _btnSave = new ER.UI.Button(mx - 140, _layout.saveY, 280, 52, '✓  SAVE & BACK', {
                bg: '#FF6B35', border: '#FF8855', textColor: '#FFF', fontSize: 12
            });
        },

        _getSliderVal: function(slider, px) {
            return ER.Math.clamp((px - slider.x) / slider.w, 0, 1);
        },

        /* ── Draw a row of toggle buttons ─────────────────────────── */
        _drawOptionRow: function(ctx, options, labels, activeKey, rowCY, btnW, btnH, gap, useChinese) {
            var mx    = _layout.mx;
            var total = options.length;
            var totalW = total * btnW + (total - 1) * gap;
            var startX = mx - totalW / 2;
            var halfH  = btnH / 2;

            options.forEach(function(key, i) {
                var bx     = startX + i * (btnW + gap);
                var active = activeKey === key;

                ctx.save();
                // Button fill
                ctx.fillStyle   = active ? '#FF6B35' : 'rgba(15,15,50,0.9)';
                ctx.strokeStyle = active ? '#FF9966' : '#4A4A8A';
                ctx.lineWidth   = active ? 2.5 : 1.5;
                ctx.shadowColor = active ? '#FF6B35' : 'transparent';
                ctx.shadowBlur  = active ? 14 : 0;
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(bx, rowCY - halfH, btnW, btnH, 6);
                else ctx.rect(bx, rowCY - halfH, btnW, btnH);
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Label text
                ctx.fillStyle     = active ? '#FFFFFF' : '#8888BB';
                ctx.textAlign     = 'center';
                ctx.textBaseline  = 'middle';
                if (useChinese) {
                    // Chinese labels: use system sans-serif for proper rendering
                    ctx.font = 'bold 14px sans-serif';
                } else {
                    ctx.font = "bold 11px 'Press Start 2P', monospace";
                }
                ctx.fillText(labels[i], bx + btnW / 2, rowCY);
                ctx.restore();
            });
        },

        /* ── Hit-test a row of buttons ───────────────────────────── */
        _hitOptionRow: function(cx, cy, options, rowCY, btnW, btnH, gap) {
            var total  = options.length;
            var totalW = total * btnW + (total - 1) * gap;
            var startX = _layout.mx - totalW / 2;
            var halfH  = btnH / 2;
            for (var i = 0; i < options.length; i++) {
                var bx = startX + i * (btnW + gap);
                if (cx >= bx && cx <= bx + btnW &&
                    cy >= rowCY - halfH && cy <= rowCY + halfH) {
                    return options[i];
                }
            }
            return null;
        },

        update: function(dt) {
            var click = ER.Input.clickPos;
            if (!click) return;
            var cx = click.x, cy = click.y;
            var L = _layout;

            // Save button
            if (_btnSave.isHit(cx, cy)) {
                var data = ER.Storage.load();
                data.settings = _tempSettings;
                ER.Storage.save(data);
                ER.Audio.applySettings(_tempSettings);
                ER.Audio.playSFX('btnClick');
                ER.Input.clearClick();
                ER.Game.gotoScene('main');
                return;
            }

            // BGM slider
            var sl = _sliders.bgm;
            if (cy >= sl.y - 20 && cy <= sl.y + 20 &&
                cx >= sl.x - 12 && cx <= sl.x + sl.w + 12) {
                _tempSettings.volBGM = this._getSliderVal(sl, cx);
                ER.Audio.setVolume('bgm', _tempSettings.volBGM);
            }

            // SFX slider
            var ss = _sliders.sfx;
            if (cy >= ss.y - 20 && cy <= ss.y + 20 &&
                cx >= ss.x - 12 && cx <= ss.x + ss.w + 12) {
                _tempSettings.volSFX = this._getSliderVal(ss, cx);
                ER.Audio.setVolume('sfx', _tempSettings.volSFX);
            }

            // Quality buttons
            var qHit = this._hitOptionRow(cx, cy, _qualityOptions, L.qualY, QUAL_BTN_W, QUAL_BTN_H, QUAL_GAP);
            if (qHit) { _tempSettings.quality = qHit; ER.Audio.playSFX('btnClick'); }

            // Speed preset buttons
            var speedKeys = ER.Physics.SPEED_PRESET_ORDER;
            var sHit = this._hitOptionRow(cx, cy, speedKeys, L.spdY, SPEED_BTN_W, SPEED_BTN_H, SPEED_GAP);
            if (sHit) { _tempSettings.speedPreset = sHit; ER.Audio.playSFX('btnClick'); }

            ER.Input.clearClick();
        },

        draw: function(ctx) {
            var L  = _layout;
            var cw = ER.Renderer.canvas.width;
            var ch = ER.Renderer.canvas.height;

            // Background
            ER.Renderer.drawBackground();
            ER.UI.drawOverlay(ctx, cw, ch, 0.72);

            // Modal panel
            ER.UI.drawModal(ctx, L.mx - L.mw / 2, L.mTop, L.mw, L.mh);

            // ── Title ──────────────────────────────────────────────
            ER.UI.drawText(ctx, '⚙  SETTINGS', L.mx, L.titleY, {
                size: 18, glow: '#00D4FF', color: '#00D4FF'
            });

            // ── BGM Slider ────────────────────────────────────────
            ER.UI.drawSlider(ctx,
                _sliders.bgm.x, L.bgmY, _sliders.bgm.w, 50,
                _tempSettings.volBGM, 'BGM',
                { labelSize: 12, trackH: 10, thumbR: 13, labelOff: 25 }
            );

            // ── SFX Slider ────────────────────────────────────────
            ER.UI.drawSlider(ctx,
                _sliders.sfx.x, L.sfxY, _sliders.sfx.w, 50,
                _tempSettings.volSFX, 'SFX',
                { labelSize: 12, trackH: 10, thumbR: 13, labelOff: 25 }
            );

            // ── Quality section ───────────────────────────────────
            ER.UI.drawText(ctx, 'QUALITY', L.mx, L.qualLY, {
                size: 12, color: '#CCCCEE'
            });
            this._drawOptionRow(ctx, _qualityOptions, _qualityLabels,
                _tempSettings.quality, L.qualY,
                QUAL_BTN_W, QUAL_BTN_H, QUAL_GAP, false);

            // ── Speed section ─────────────────────────────────────
            ER.UI.drawText(ctx, 'SPEED', L.mx, L.spdLY, {
                size: 12, color: '#CCCCEE'
            });
            var speedKeys   = ER.Physics.SPEED_PRESET_ORDER;
            var speedLabels = speedKeys.map(function(k) {
                return ER.Physics.SPEED_PRESET[k].label;
            });
            this._drawOptionRow(ctx, speedKeys, speedLabels,
                _tempSettings.speedPreset, L.spdY,
                SPEED_BTN_W, SPEED_BTN_H, SPEED_GAP, true);

            // Speed info hint below buttons
            var cfg = ER.Physics.SPEED_PRESET[_tempSettings.speedPreset];
            if (cfg) {
                ctx.save();
                ctx.fillStyle    = '#FF6B35';
                ctx.font         = "12px 'Orbitron', monospace";
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    '初速 ' + cfg.initial + '  ／  最高 ' + cfg.max + '  px/frame',
                    L.mx, L.spdInfoY
                );
                ctx.restore();
            }

            // ── Save button ───────────────────────────────────────
            _btnSave.draw(ctx);
        }
    };
})(window.ER = window.ER || {});
