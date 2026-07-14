(function (global) {
  "use strict";

  var I18n = global.BigTwo.I18n;

  describe("Internationalisation", function () {
    beforeEach(function () {
      I18n.setLocale("zh-Hant");
    });

    it("keeps exactly the same key set in Traditional Chinese, English and Japanese", function () {
      var zhKeys = Object.keys(I18n.getMessages("zh-Hant")).sort();
      var enKeys = Object.keys(I18n.getMessages("en")).sort();
      var jaKeys = Object.keys(I18n.getMessages("ja")).sort();
      assertTrue(zhKeys.length > 0);
      assertDeepEqual(enKeys, zhKeys);
      assertDeepEqual(jaKeys, zhKeys);
    });

    it("falls back to Traditional Chinese and then to the key itself", function () {
      var originalEnglish = I18n.getMessages("en");
      var incompleteEnglish = Object.assign({}, originalEnglish);
      var zh = I18n.getMessages("zh-Hant");
      delete incompleteEnglish["common.cancel"];
      try {
        I18n.register("en", incompleteEnglish);
        I18n.setLocale("en");
        assertEqual(I18n.t("common.cancel"), zh["common.cancel"]);
        assertEqual(I18n.t("test.key.that.does.not.exist"), "test.key.that.does.not.exist");
      } finally {
        I18n.register("en", originalEnglish);
      }
    });

    it("updates document language, title and the current translated view immediately", function () {
      var fixture = global.document.createElement("button");
      fixture.type = "button";
      fixture.setAttribute("data-i18n", "common.back");
      global.document.body.appendChild(fixture);
      try {
        I18n.setLocale("en");
        assertEqual(global.document.documentElement.lang, "en");
        assertEqual(global.document.title, I18n.getMessages("en")["app.documentTitle"]);
        assertEqual(fixture.textContent, I18n.getMessages("en")["common.back"]);
        I18n.setLocale("ja");
        assertEqual(global.document.documentElement.lang, "ja");
        assertEqual(fixture.textContent, I18n.getMessages("ja")["common.back"]);
      } finally {
        fixture.remove();
        I18n.setLocale("zh-Hant");
      }
    });

    it("escapes untrusted interpolation values", function () {
      I18n.setLocale("en");
      var rendered = I18n.t("app.version", { version: "<img src=x onerror=alert(1)>" });
      assertTrue(rendered.indexOf("<img") === -1);
      assertTrue(rendered.indexOf("&lt;img") !== -1);
      assertEqual(I18n.escapeInterpolation("<&\"'>"), "&lt;&amp;&quot;&#39;&gt;");
    });

    it("keeps long English and Japanese labels as operable button text", function () {
      ["en", "ja"].forEach(function (locale) {
        var messages = I18n.getMessages(locale);
        var longest = Object.keys(messages).reduce(function (winner, key) {
          var candidate = String(messages[key]);
          return candidate.length > winner.length ? candidate : winner;
        }, "");
        var button = global.document.createElement("button");
        button.type = "button";
        button.textContent = longest;
        global.document.body.appendChild(button);
        assertTrue(!button.disabled);
        assertEqual(button.tabIndex, 0);
        assertEqual(button.textContent, longest);
        button.remove();
      });
    });
  });
}(window));
