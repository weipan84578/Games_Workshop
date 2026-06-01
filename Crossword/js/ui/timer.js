(function () {
  let intervalId = null;
  let onTick = null;

  function start(callback) {
    stop();
    onTick = callback;
    intervalId = window.setInterval(() => {
      onTick();
    }, 1000);
  }

  function stop() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function render(seconds, visible = true) {
    return `<span class="timer-pill ${visible ? "" : "is-hidden"}" title="計時器">⏱ <span data-timer-text>${Helpers.formatTime(seconds)}</span></span>`;
  }

  function update(seconds) {
    Helpers.$all("[data-timer-text]").forEach((element) => {
      element.textContent = Helpers.formatTime(seconds);
    });
  }

  window.GameTimer = {
    start,
    stop,
    render,
    update,
  };
})();
