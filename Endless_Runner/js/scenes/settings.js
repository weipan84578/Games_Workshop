(function(ER) {
    var _tempSettings  = null;
    var _sliders       = {};
    var _btnSave;
    var _draggingSlider = null;
    var _qualityOptions = ['high', 'medium', 'low'];
    var _qualityLabels  = ['HIGH', 'MED', 'LOW'];
    var _layout = {};

    ER.Settings = {
        enter: function() {
            var data = ER.Storage.load();
            _tempSettings = JSON.parse(JSON.stringify(data.settings));
            if (!_tempSettings.speedPreset) _tempSettings.speedPreset = 'normal';
            _draggingSlider = null;

            var cw = ER.Renderer.canvas.width;
            var ch = ER.Renderer.canvas.height;
            var mx = cw / 2;

            // Modal dimensions — slightly taller to fit all rows comfortably
            var mw   = Math.min(560, cw - 60);
            var mh   = Math.min(560, ch - 40);
            var mTop = Math.floor(ch / 2 - mh / 2);
            var sw   = mw - 80;

            // Adaptive button heights (scale down for small modals, clamp min for touch)
            var qualBtnH = Math.max(32, Math.min(52, Math.round(mh * 0.093)));
            var spdBtnH  = qualBtnH;
            var saveBtnH = Math.max(36, Math.min(52, Math.round(mh * 0.093)));

            // Adaptive button widths — scale to fit within slider width
            var qualBtnW = 130, qualGap = 16;
            var spdBtnW  =  88, spdGap  = 10;

            var totalQ = 3 * qualBtnW + 2 * qualGap;
            if (totalQ > sw) {
                var qs = sw / totalQ;
                qualBtnW = Math.floor(qualBtnW * qs);
                qualGap  = Math.max(4, Math.floor(qualGap * qs));
            }
            var totalS = 5 * spdBtnW + 4 * spdGap;
            if (totalS > sw) {
                var ss2 = sw / totalS;
                spdBtnW = Math.floor(spdBtnW * ss2);
                spdGap  = Math.max(3, Math.floor(spdGap * ss2));
            }

            // Proportional Y positions — scale naturally with modal height
            _layout = {
                mx: mx, mTop: mTop, mw: mw, mh: mh,
                sliderX: mx - sw / 2, sliderW: sw,
                titleY:   mTop + Math.round(mh * 0.075),
                bgmY:     mTop + Math.round(mh * 0.196),
                sfxY:     mTop + Math.round(mh * 0.357),
                qualLY:   mTop + Math.round(mh * 0.500),
                qualY:    mTop + Math.round(mh * 0.571),
                spdLY:    mTop + Math.round(mh * 0.679),
                spdY:     mTop + Math.round(mh * 0.750),
                spdInfoY: mTop + Math.round(mh * 0.839),
                saveY:    mTop + Math.round(mh * 0.893),
                qualBtnW: qualBtnW, qualBtnH: qualBtnH, qualGap: qualGap,
                spdBtnW:  spdBtnW,  spdBtnH:  spdBtnH,  spdGap:  spdGap,
                saveBtnH: saveBtnH
            };

            _sliders.bgm = { x: _layout.sliderX, y: _layout.bgmY, w: sw };
            _sliders.sfx = { x: _layout.sliderX, y: _layout.sfxY, w: sw };

            _btnSave = new ER.UI.Button(mx - 140, _layout.saveY, 280, saveBtnH, '✓  SAVE & BACK', {
                bg: '#FF6B35', border: '#FF8855', textColor: '#FFF', fontSize: 12
            });
        },

        _getSliderVal: function(slider, px) {
            return ER.Math.clamp((px - slider.x) / slider.w, 0, 1);
        },

        /* ── Draw a row of toggle buttons ─────────────────────────── */
        _drawOptionRow: function(ctx, options, labels, activeKey, rowCY, btnW, btnH, gap, useChinese) {
            var mx     = _layout.mx;
            var total  = options.length;
            var totalW = total * btnW + (total - 1) * gap;
            var startX = mx - totalW / 2;
            var halfH  = btnH / 2;
            var fSize  = Math.max(9, Math.round(btnH * 0.27));

            options.forEach(function(key, i) {
                var bx     = startX + i * (btnW + gap);
                var active = activeKey === key;

                ctx.save();
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

                ctx.fillStyle    = active ? '#FFFFFF' : '#8888BB';
                ctx.textAlign    = 'center';
                ctx.textBaseline = 'middle';
                if (useChinese) {
                    ctx.font = 'bold ' + fSize + 'px sans-serif';
                } else {
                    ctx.font = 'bold ' + fSize + "px 'Press Start 2P', monospace";
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
            var L     = _layout;
            var ptr   = ER.Input.pointerPos;
            var click = ER.Input.clickPos;

            // Clear drag state when pointer is released
            if (!ptr) _draggingSlider = null;

            // ── Slider drag (runs every frame while pointer is held) ──
            if (ptr) {
                var px = ptr.x, py = ptr.y;

                // Detect which slider is being grabbed (only when not already dragging)
                if (_draggingSlider === null) {
                    var sl = _sliders.bgm;
                    if (py >= sl.y - 28 && py <= sl.y + 28 &&
                        px >= sl.x - 16 && px <= sl.x + sl.w + 16) {
                        _draggingSlider = 'bgm';
                    }
                    var ss = _sliders.sfx;
                    if (py >= ss.y - 28 && py <= ss.y + 28 &&
                        px >= ss.x - 16 && px <= ss.x + ss.w + 16) {
                        _draggingSlider = 'sfx';
                    }
                }

                if (_draggingSlider === 'bgm') {
                    _tempSettings.volBGM = this._getSliderVal(_sliders.bgm, px);
                    ER.Audio.setVolume('bgm', _tempSettings.volBGM);
                } else if (_draggingSlider === 'sfx') {
                    _tempSettings.volSFX = this._getSliderVal(_sliders.sfx, px);
                    ER.Audio.setVolume('sfx', _tempSettings.volSFX);
                }

                // While a slider is active, absorb the click so buttons don't fire
                if (_draggingSlider !== null) {
                    ER.Input.clearClick();
                    return;
                }
            }

            // ── Button clicks ─────────────────────────────────────────
            if (!click) return;
            var cx = click.x, cy = click.y;

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

            // Quality buttons
            var qHit = this._hitOptionRow(cx, cy, _qualityOptions, L.qualY,
                L.qualBtnW, L.qualBtnH, L.qualGap);
            if (qHit) { _tempSettings.quality = qHit; ER.Audio.playSFX('btnClick'); }

            // Speed preset buttons
            var speedKeys = ER.Physics.SPEED_PRESET_ORDER;
            var sHit = this._hitOptionRow(cx, cy, speedKeys, L.spdY,
                L.spdBtnW, L.spdBtnH, L.spdGap);
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
                L.qualBtnW, L.qualBtnH, L.qualGap, false);

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
                L.spdBtnW, L.spdBtnH, L.spdGap, true);

            // ── Speed info hint ───────────────────────────────────
            var cfg = ER.Physics.SPEED_PRESET[_tempSettings.speedPreset];
            if (cfg) {
                ctx.save();
                ctx.fillStyle    = '#FF6B35';
                ctx.shadowColor  = '#FF6B35';
                ctx.shadowBlur   = 8;
                ctx.font         = "bold 16px 'Orbitron', sans-serif";
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
