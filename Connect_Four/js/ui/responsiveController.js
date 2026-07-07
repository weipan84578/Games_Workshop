(function initResponsiveController(global) {
  const CF = global.CF || (global.CF = {});

  function updateViewportVars() {
    document.documentElement.style.setProperty("--vh", `${global.innerHeight * 0.01}px`);
    document.body.dataset.orientation = global.innerWidth > global.innerHeight ? "landscape" : "portrait";
  }

  function init() {
    updateViewportVars();
    global.addEventListener("resize", CF.helpers.debounce(updateViewportVars, 80));
    global.addEventListener("orientationchange", () => global.setTimeout(updateViewportVars, 120));
  }

  CF.responsiveController = { init, updateViewportVars };
})(window);
