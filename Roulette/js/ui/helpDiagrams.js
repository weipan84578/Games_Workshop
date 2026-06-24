(() => {
  "use strict";
  const R = window.Roulette = window.Roulette || {};

  function describeArc(cx, cy, radius, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  function polarToCartesian(cx, cy, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  }

  function miniBetSvg(tone) {
    const fill = tone === "red" ? "var(--color-number-red)" : tone === "black" ? "var(--color-number-black)" : "rgba(0,0,0,0.3)";
    return `
      <svg class="mini-diagram" viewBox="0 0 180 80" aria-hidden="true">
        <rect x="8" y="8" width="164" height="64" rx="8" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.35)"></rect>
        <rect x="24" y="20" width="36" height="40" rx="4" fill="${fill}" stroke="rgba(255,255,255,0.65)"></rect>
        <rect x="68" y="20" width="36" height="40" rx="4" fill="var(--color-number-red)" stroke="rgba(255,255,255,0.45)"></rect>
        <rect x="112" y="20" width="36" height="40" rx="4" fill="var(--color-number-black)" stroke="rgba(255,255,255,0.45)"></rect>
      </svg>
    `;
  }

  Object.assign(R, { describeArc, miniBetSvg });
})();
