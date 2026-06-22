(function () {
  const Toast = {
    show(message, type) {
      const container = Helpers.qs("#toast-container");
      const toast = document.createElement("div");
      const nextType = type || "info";
      const icon = nextType === "success" ? "OK" : nextType === "error" ? "!" : nextType === "warning" ? "!" : "i";
      toast.className = `toast toast-${nextType}`;
      toast.innerHTML = `<strong>${icon}</strong><span>${Helpers.escapeHtml(message)}</span>`;
      container.prepend(toast);

      while (container.children.length > 4) {
        container.lastElementChild.remove();
      }
      this.updateStack(container);

      window.setTimeout(() => {
        toast.style.opacity = "0";
        if (toast === container.firstElementChild) {
          toast.style.transform = "translateY(-8px)";
        }
      }, 2400);
      window.setTimeout(() => {
        toast.remove();
        this.updateStack(container);
      }, 2850);
    },

    updateStack(container) {
      Array.from(container.children).forEach((toast, index) => {
        toast.style.setProperty("--stack-index", index);
      });
    },
  };

  window.Toast = Toast;
})();
