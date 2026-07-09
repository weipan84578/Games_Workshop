(function exposeInstructionsPanel(root, factory) {
  var InstructionsPanel = factory(root);
  root.BBQ = root.BBQ || {};
  root.BBQ.InstructionsPanel = InstructionsPanel;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = InstructionsPanel;
  }
})(typeof window !== "undefined" ? window : globalThis, function instructionsPanelFactory() {
  "use strict";

  function InstructionsPanel(options) {
    this.layer = options.layer;
    this.element = options.element;
    this.audio = options.audio;
    this.tabs = Array.from(this.element.querySelectorAll("[data-tab]"));
    this.pages = Array.from(this.element.querySelectorAll("[data-page]"));
    this.closeButtons = Array.from(this.element.querySelectorAll("[data-close-modal]"));
  }

  InstructionsPanel.prototype.bind = function bind() {
    this.tabs.forEach(function bindTab(tab) {
      tab.addEventListener("click", function selectTab() {
        this.select(tab.getAttribute("data-tab"));
        if (this.audio) {
          this.audio.playSfx("click");
        }
      }.bind(this));
    }, this);

    this.closeButtons.forEach(function bindClose(button) {
      button.addEventListener("click", this.close.bind(this));
    }, this);
  };

  InstructionsPanel.prototype.select = function select(name) {
    this.tabs.forEach(function updateTab(tab) {
      tab.classList.toggle("active", tab.getAttribute("data-tab") === name);
    });
    this.pages.forEach(function updatePage(page) {
      page.classList.toggle("active", page.getAttribute("data-page") === name);
    });
  };

  InstructionsPanel.prototype.open = function open() {
    this.layer.hidden = false;
    this.element.hidden = false;
    this.tabs[0].focus();
  };

  InstructionsPanel.prototype.close = function close() {
    this.element.hidden = true;
    this.layer.hidden = true;
  };

  return InstructionsPanel;
});
