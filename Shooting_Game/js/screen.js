function showScreen(name) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === `screen-${name}`);
  });
}

function setPauseVisible(visible) {
  document.querySelector("#pause-overlay").hidden = !visible;
}
