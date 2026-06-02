export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const escapeHTML = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

export const uid = (prefix = "id") => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const makeButton = ({ label, className = "btn", action = "", disabled = false, title = "" }) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.disabled = disabled;
  if (action) button.dataset.action = action;
  if (title) button.title = title;
  return button;
};
