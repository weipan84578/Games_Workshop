(function () {
  const Toast = {
    show(message, type) {
      const container = Helpers.qs("#toast-container");
      const toast = document.createElement("div");
      const nextType = type || "info";
      const icon = nextType === "success" ? "✓" : nextType === "error" ? "!" : nextType === "warning" ? "!" : "•";
      toast.className = `toast toast-${nextType}`;
      toast.innerHTML = `<strong>${icon}</strong><span>${Helpers.escapeHtml(message)}</span>`;
      container.appendChild(toast);
      window.setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";
      }, 2400);
      window.setTimeout(() => toast.remove(), 2850);
    },
  };

  window.Toast = Toast;
})();
