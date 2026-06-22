(function () {
  function colorInfo(color) {
    const bg = UNO_CONSTANTS.COLOR_HEX[color] || "#111827";
    const oval = UNO_CONSTANTS.COLOR_DEEP_HEX[color] || "#000000";
    return { bg, oval, text: "#ffffff" };
  }

  function numberSvg(card) {
    const c = colorInfo(card.color);
    const value = Helpers.escapeHtml(card.value);
    return `
      <svg width="100" height="150" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="100" height="150" rx="16" fill="${c.bg}"/>
        <rect x="4" y="4" width="92" height="142" rx="13" fill="none" stroke="white" stroke-width="3"/>
        <ellipse cx="50" cy="75" rx="35" ry="52" fill="${c.oval}" transform="rotate(-30 50 75)"/>
        <text x="50" y="82" text-anchor="middle" dominant-baseline="middle" font-size="56" font-weight="900" fill="white" font-family="Nunito, sans-serif" paint-order="stroke" stroke="${c.oval}" stroke-width="3">${value}</text>
        <text x="11" y="24" font-size="19" font-weight="900" fill="white" font-family="Nunito, sans-serif">${value}</text>
        <text x="89" y="126" text-anchor="middle" font-size="19" font-weight="900" fill="white" font-family="Nunito, sans-serif" transform="rotate(180 89 126)">${value}</text>
      </svg>`;
  }

  function actionSvg(card) {
    const c = colorInfo(card.color);
    const label = Card.getShortLabel(card);
    const symbol = card.value === "skip" ? "⊘" : card.value === "reverse" ? "⇄" : "+2";
    return `
      <svg width="100" height="150" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="100" height="150" rx="16" fill="${c.bg}"/>
        <rect x="4" y="4" width="92" height="142" rx="13" fill="none" stroke="white" stroke-width="3"/>
        <ellipse cx="50" cy="75" rx="35" ry="52" fill="white" transform="rotate(-30 50 75)"/>
        <text x="50" y="71" text-anchor="middle" dominant-baseline="middle" font-size="${card.value === "draw_two" ? 42 : 48}" font-weight="900" fill="${c.bg}" font-family="Nunito, sans-serif">${symbol}</text>
        <text x="50" y="101" text-anchor="middle" font-size="13" font-weight="900" fill="${c.bg}" font-family="Nunito, sans-serif">${label}</text>
        <text x="10" y="24" font-size="15" font-weight="900" fill="white" font-family="Nunito, sans-serif">${label}</text>
        <text x="90" y="126" text-anchor="middle" font-size="15" font-weight="900" fill="white" font-family="Nunito, sans-serif" transform="rotate(180 90 126)">${label}</text>
      </svg>`;
  }

  function wildSvg(card) {
    const label = card.value === "wild_draw_four" ? "+4" : "WILD";
    return `
      <svg width="100" height="150" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="100" height="150" rx="16" fill="#171923"/>
        <rect x="4" y="4" width="92" height="142" rx="13" fill="none" stroke="white" stroke-width="3"/>
        <ellipse cx="50" cy="75" rx="35" ry="52" fill="#f8fafc" transform="rotate(-30 50 75)"/>
        <g transform="rotate(-30 50 75)">
          <path d="M50 75 L50 38 A37 37 0 0 1 87 75 Z" fill="${UNO_CONSTANTS.COLOR_HEX.red}"/>
          <path d="M50 75 L87 75 A37 37 0 0 1 50 112 Z" fill="${UNO_CONSTANTS.COLOR_HEX.blue}"/>
          <path d="M50 75 L50 112 A37 37 0 0 1 13 75 Z" fill="${UNO_CONSTANTS.COLOR_HEX.green}"/>
          <path d="M50 75 L13 75 A37 37 0 0 1 50 38 Z" fill="${UNO_CONSTANTS.COLOR_HEX.yellow}"/>
          <circle cx="50" cy="75" r="20" fill="#171923"/>
        </g>
        <text x="50" y="83" text-anchor="middle" dominant-baseline="middle" font-size="${label === "+4" ? 43 : 22}" font-weight="900" fill="white" font-family="Nunito, sans-serif">${label}</text>
        <text x="10" y="24" font-size="16" font-weight="900" fill="white" font-family="Nunito, sans-serif">${label}</text>
        <text x="90" y="126" text-anchor="middle" font-size="16" font-weight="900" fill="white" font-family="Nunito, sans-serif" transform="rotate(180 90 126)">${label}</text>
      </svg>`;
  }

  function backSvg() {
    return `
      <svg width="100" height="150" viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="100" height="150" rx="16" fill="#111827"/>
        <rect x="4" y="4" width="92" height="142" rx="13" fill="none" stroke="white" stroke-width="3"/>
        <ellipse cx="50" cy="75" rx="35" ry="52" fill="#e11d48" transform="rotate(-30 50 75)"/>
        <text x="50" y="84" text-anchor="middle" dominant-baseline="middle" font-size="36" font-style="italic" font-weight="900" fill="white" font-family="Nunito, sans-serif" paint-order="stroke" stroke="#111827" stroke-width="3">UNO</text>
      </svg>`;
  }

  const CardRenderer = {
    renderCard(card, options) {
      const opts = options || {};
      if (opts.back) return this.renderBack(opts);
      const classes = ["uno-card"];
      if (opts.className) classes.push(opts.className);
      if (opts.playable) classes.push("is-playable");
      if (opts.selected) classes.push("is-selected");
      if (opts.disabled) classes.push("is-disabled");
      const svg = card.type === "number" ? numberSvg(card) : card.type === "action" ? actionSvg(card) : wildSvg(card);
      const attrs = [];
      if (opts.interactive) {
        attrs.push('role="button"', 'tabindex="0"', `aria-label="${Helpers.escapeHtml(Card.getLabel(card))}"`, `data-card-id="${Helpers.escapeHtml(card.id)}"`);
      }
      return `<div class="${classes.join(" ")}" ${attrs.join(" ")}>${svg}</div>`;
    },

    renderBack(options) {
      const opts = options || {};
      const classes = ["uno-card"];
      if (opts.className) classes.push(opts.className);
      return `<div class="${classes.join(" ")}">${backSvg()}</div>`;
    },
  };

  window.CardRenderer = CardRenderer;
})();
