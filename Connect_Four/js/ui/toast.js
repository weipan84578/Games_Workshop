(function initToast(global) {
  const CF = global.CF || (global.CF = {});
  let timer = null;

  function show(message) {
    const root = document.getElementById("toast-root");
    if (!root) return;
    root.innerHTML = `<div class="toast" role="status">${CF.helpers.escapeHtml(message)}</div>`;
    global.clearTimeout(timer);
    timer = global.setTimeout(() => {
      root.innerHTML = "";
    }, 2200);
  }

  CF.toast = { show };
})(window);
