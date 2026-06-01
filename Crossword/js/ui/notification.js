(function () {
  function show(message, type = "default") {
    const container = document.getElementById("notification-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    window.setTimeout(() => {
      toast.remove();
    }, 2600);
  }

  window.Notify = {
    show,
  };
})();
