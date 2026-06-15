/* namespace.js — 建立全域唯一命名空間 window.Ludo。
   所有模組掛在底下,取代 import/export,讓 file:// 直接開檔可用。
   必須最先載入。 */
window.Ludo = {
  config:  {},
  state:   {},
  storage: {},
  engine:  { board: {}, rules: {}, dice: {}, token: {}, turn: {} },
  ai:      {},
  audio:   {},
  ui:      {},
  input:   {}
};
