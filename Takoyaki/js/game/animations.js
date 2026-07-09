(function registerAnimations(app) {
  "use strict";

  app.Animations = {
    burstStars(container) {
      if (!container) {
        return;
      }
      for (let index = 0; index < 5; index += 1) {
        const star = document.createElement("span");
        star.className = "sparkle";
        star.style.left = `${44 + index * 5}%`;
        star.style.top = `${46 - (index % 2) * 12}%`;
        star.style.animationDelay = `${index * 80}ms`;
        container.append(star);
        window.setTimeout(() => star.remove(), 1000);
      }
    }
  };
})(window.Takoyaki = window.Takoyaki || {});
