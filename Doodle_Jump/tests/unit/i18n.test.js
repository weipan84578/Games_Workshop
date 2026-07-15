(function (Game, Test) {
  "use strict";
  var assert = Test.assert;

  function flatten(value, prefix, result) {
    result = result || [];
    Object.keys(value).forEach(function (key) {
      var path = prefix ? prefix + "." + key : key;
      if (value[key] && typeof value[key] === "object")
        flatten(value[key], path, result);
      else result.push(path);
    });
    return result.sort();
  }

  Test.test("三個語系的 key 集合一致", "i18n", function () {
    var keys = Game.Locales.map(function (locale) {
      return flatten(Game.I18n.dictionaries[locale]);
    });
    assert.deepEqual(keys[0], keys[1]);
    assert.deepEqual(keys[1], keys[2]);
  });

  Test.test("插值保留參數且不執行 HTML", "i18n", function () {
    Game.I18n.setLocale("en-US");
    assert.equal(
      Game.I18n.t("home.saveSummary", { height: "<b>2</b>", score: 9 }),
      "Last run: <b>2</b> m · Score 9",
    );
    Game.I18n.setLocale("zh-TW");
  });
})(window.DJGame, window.DJTest);
