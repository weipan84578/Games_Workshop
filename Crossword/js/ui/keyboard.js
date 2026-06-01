(function () {
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  function render() {
    return `
      <div class="virtual-keyboard" aria-label="虛擬鍵盤">
        ${rows
          .map(
            (row) => `
              <div class="keyboard-row" style="--key-count:${row.length};">
                ${[...row].map((letter) => `<button class="key" type="button" data-key="${letter}">${letter}</button>`).join("")}
              </div>
            `
          )
          .join("")}
        <div class="keyboard-row" style="--key-count:6;">
          <button class="key wide" type="button" data-key="BACKSPACE" title="Backspace">⌫</button>
          <button class="key wide" type="button" data-key="ENTER" title="切換方向">↵</button>
          <button class="key wide" type="button" data-key="TAB" title="下一題">⇥</button>
        </div>
      </div>
    `;
  }

  window.VirtualKeyboard = {
    render,
  };
})();
