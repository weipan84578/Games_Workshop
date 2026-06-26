(function (window) {
  'use strict';

  const ColorUtil = {
    blockHue(floor, score = 0) {
      const scoreShift = score > 500 ? 90 : score > 300 ? 60 : score > 150 ? 36 : score > 50 ? 18 : 0;
      return (200 + floor * 15 + scoreShift) % 360;
    },

    hsl(hue, lightness, saturation = 75) {
      return `hsl(${Math.round(hue)} ${saturation}% ${lightness}%)`;
    },

    buildingPalette(hue) {
      return {
        top: this.hsl(hue, 80),
        face: this.hsl(hue, 58),
        side: this.hsl(hue, 40),
        beam: this.hsl((hue + 18) % 360, 36, 52),
        window: 'rgba(232, 251, 255, 0.86)',
        windowDark: 'rgba(36, 67, 94, 0.72)'
      };
    },

    sky(score) {
      if (score >= 501) {
        return ['#21456B', '#F6A95D', '#FFD166'];
      }
      if (score >= 301) {
        return ['#10375B', '#2F80A9', '#8AD7E8'];
      }
      if (score >= 151) {
        return ['#111B34', '#5A3F6D', '#E98F62'];
      }
      if (score >= 51) {
        return ['#0D1B2A', '#263F58', '#3E705F'];
      }
      return ['#0D1B2A', '#1B2A4A', '#2D1B4E'];
    }
  };

  window.ColorUtil = ColorUtil;
})(window);
