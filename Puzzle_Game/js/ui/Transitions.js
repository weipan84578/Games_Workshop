export function enterScreen(node) {
  node.style.opacity = "0";
  node.style.transform = "translateY(8px)";
  requestAnimationFrame(() => {
    node.style.transition = "opacity 220ms ease, transform 220ms ease";
    node.style.opacity = "1";
    node.style.transform = "translateY(0)";
  });
}
