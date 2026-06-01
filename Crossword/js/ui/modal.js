(function () {
  const containerId = "modal-container";

  function open({ title, body, actions = "" }) {
    AudioManager.playSFX("menu_open");
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <div class="modal-backdrop" data-modal-close>
        <section class="modal" role="dialog" aria-modal="true" aria-label="${title}">
          <header class="modal-header">
            <div class="modal-title">${title}</div>
            <button class="icon-btn" type="button" data-modal-close title="關閉">×</button>
          </header>
          <div class="modal-body">${body}</div>
          ${actions ? `<footer class="modal-actions">${actions}</footer>` : ""}
        </section>
      </div>
    `;
    container.querySelector(".modal").addEventListener("click", (event) => event.stopPropagation());
    Helpers.$all("[data-modal-close]", container).forEach((element) => {
      element.addEventListener("click", close);
    });
  }

  function close() {
    const container = document.getElementById(containerId);
    if (container.innerHTML) {
      AudioManager.playSFX("menu_close");
    }
    container.innerHTML = "";
  }

  window.Modal = {
    open,
    close,
  };
})();
