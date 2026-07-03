(function () {
  window.SicBo = window.SicBo || {};

  function isLowPowerDevice() {
    return window.navigator && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  }

  function burstParticles(target, count) {
    if (!target) return;
    const reduced = document.documentElement.dataset.reducedEffects === "true" || isLowPowerDevice();
    const total = reduced ? Math.min(count, 10) : count;
    for (let i = 0; i < total; i += 1) {
      const particle = document.createElement("span");
      particle.className = "win-particle";
      particle.style.setProperty("--x", (Math.random() * 220 - 110).toFixed(0) + "px");
      particle.style.setProperty("--y", (Math.random() * -160 - 50).toFixed(0) + "px");
      particle.style.left = (45 + Math.random() * 10).toFixed(1) + "%";
      particle.style.top = (42 + Math.random() * 12).toFixed(1) + "%";
      target.appendChild(particle);
      window.setTimeout(function () {
        particle.remove();
      }, 900);
    }
  }

  window.SicBo.AnimationController = {
    burstParticles: burstParticles,
    isLowPowerDevice: isLowPowerDevice
  };
})();
