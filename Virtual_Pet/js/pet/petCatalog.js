window.VP = window.VP || {};

VP.PetCatalog = (function () {
  var COLLECTION_KEY = "vp_collection";

  var EGG_TYPES = [
    { id: "ember", icon: "🔥", colors: ["#ff8b3d", "#ffd166"], affinities: ["fire", "light"] },
    { id: "tide", icon: "💧", colors: ["#44a7d8", "#b8f1ff"], affinities: ["water", "night"] },
    { id: "meadow", icon: "🌿", colors: ["#4caf6f", "#d3f6b6"], affinities: ["nature", "light"] },
    { id: "moon", icon: "🌙", colors: ["#7b63c7", "#c9c0ff"], affinities: ["night", "water"] },
    { id: "crystal", icon: "✦", colors: ["#e58cff", "#9ee7e2"], affinities: ["light", "fire", "water", "nature", "night"] }
  ];

  var PETS = [
    { id: "ember_drake", family: "dragon", affinity: "fire", icon: "🐉", names: { zh: "焰角龍", en: "Ember Drake", ja: "ほむらドレイク" }, colors: ["#d84a2b", "#ffb45d", "#ffe08a"] },
    { id: "pearl_dragon", family: "dragon", affinity: "water", icon: "🐉", names: { zh: "珍珠水龍", en: "Pearl Dragon", ja: "しんじゅドラゴン" }, colors: ["#3b9fce", "#c7f0ff", "#f6ffff"] },
    { id: "moss_wyvern", family: "dragon", affinity: "nature", icon: "🐉", names: { zh: "苔翼龍", en: "Moss Wyvern", ja: "こけワイバーン" }, colors: ["#3f8d52", "#b7e08b", "#f2d36b"] },
    { id: "midnight_wyrm", family: "dragon", affinity: "night", icon: "🐉", names: { zh: "午夜幼龍", en: "Midnight Wyrm", ja: "まよなかワーム" }, colors: ["#4d3d8f", "#9d8cff", "#6ce3d2"] },
    { id: "aurora_drake", family: "dragon", affinity: "light", icon: "🐉", names: { zh: "極光龍", en: "Aurora Drake", ja: "オーロラドレイク" }, colors: ["#e07bd8", "#95e7da", "#fff0a5"] },

    { id: "flare_koi", family: "fish", affinity: "fire", icon: "🐟", names: { zh: "焰尾錦鯉", en: "Flare Koi", ja: "ほのおゴイ" }, colors: ["#ef5b3f", "#ffd3a5", "#ffe66f"] },
    { id: "bubble_fin", family: "fish", affinity: "water", icon: "🐟", names: { zh: "泡泡鰭", en: "Bubble Fin", ja: "あわヒレ" }, colors: ["#2b94c7", "#9eeaff", "#ffffff"] },
    { id: "reed_guppy", family: "fish", affinity: "nature", icon: "🐟", names: { zh: "蘆葦孔雀魚", en: "Reed Guppy", ja: "あしグッピー" }, colors: ["#4f9d5d", "#d9f5a0", "#f2c26b"] },
    { id: "moonray_fish", family: "fish", affinity: "night", icon: "🐟", names: { zh: "月光魟魚", en: "Moonray Fish", ja: "つきエイ" }, colors: ["#4a4d8f", "#b7bbff", "#73ddff"] },
    { id: "sunscale_minnow", family: "fish", affinity: "light", icon: "🐟", names: { zh: "日鱗小魚", en: "Sunscale Minnow", ja: "ひうろこミノー" }, colors: ["#f0a72c", "#fff2a5", "#ff85a1"] },

    { id: "cinder_cat", family: "cat", affinity: "fire", icon: "🐱", names: { zh: "煤火貓", en: "Cinder Cat", ja: "こげネコ" }, colors: ["#c84d32", "#ffbd75", "#3d2f2a"] },
    { id: "mist_cat", family: "cat", affinity: "water", icon: "🐱", names: { zh: "霧藍貓", en: "Mist Cat", ja: "きりネコ" }, colors: ["#5ba8cf", "#c9ecff", "#ffffff"] },
    { id: "clover_cat", family: "cat", affinity: "nature", icon: "🐱", names: { zh: "幸運草貓", en: "Clover Cat", ja: "クローバーネコ" }, colors: ["#54a85f", "#c8f0b8", "#f6f0d1"] },
    { id: "shadow_cat", family: "cat", affinity: "night", icon: "🐱", names: { zh: "影尾貓", en: "Shadow Cat", ja: "かげネコ" }, colors: ["#47335e", "#a98de8", "#71d4c9"] },
    { id: "halo_cat", family: "cat", affinity: "light", icon: "🐱", names: { zh: "光環貓", en: "Halo Cat", ja: "ひかりネコ" }, colors: ["#e6a93a", "#fff1b8", "#f9a5c8"] },

    { id: "spark_pup", family: "dog", affinity: "fire", icon: "🐶", names: { zh: "火花犬", en: "Spark Pup", ja: "ひばなイヌ" }, colors: ["#d65339", "#ffca83", "#7d3b2b"] },
    { id: "harbor_pup", family: "dog", affinity: "water", icon: "🐶", names: { zh: "港灣犬", en: "Harbor Pup", ja: "みなとイヌ" }, colors: ["#347fa8", "#bce8ff", "#f5fbff"] },
    { id: "sprout_hound", family: "dog", affinity: "nature", icon: "🐶", names: { zh: "芽芽獵犬", en: "Sprout Hound", ja: "めばえハウンド" }, colors: ["#468a4f", "#cde6a0", "#fff0c6"] },
    { id: "nocturne_dog", family: "dog", affinity: "night", icon: "🐶", names: { zh: "夜曲犬", en: "Nocturne Dog", ja: "ノクターンイヌ" }, colors: ["#3f3b72", "#9b91dd", "#55c3c5"] },
    { id: "comet_pup", family: "dog", affinity: "light", icon: "🐶", names: { zh: "彗星犬", en: "Comet Pup", ja: "すいせいイヌ" }, colors: ["#e39932", "#fff1a8", "#ff95a8"] },

    { id: "toast_calf", family: "cow", affinity: "fire", icon: "🐮", names: { zh: "烤吐司小牛", en: "Toast Calf", ja: "トーストこうし" }, colors: ["#b95a32", "#fff0ce", "#5b3327"] },
    { id: "river_calf", family: "cow", affinity: "water", icon: "🐮", names: { zh: "河川小牛", en: "River Calf", ja: "かわこうし" }, colors: ["#388db7", "#d6f3ff", "#264c6d"] },
    { id: "pasture_cow", family: "cow", affinity: "nature", icon: "🐮", names: { zh: "牧草牛", en: "Pasture Cow", ja: "まきばウシ" }, colors: ["#4b8b4d", "#f4f8dc", "#345b34"] },
    { id: "starlit_cow", family: "cow", affinity: "night", icon: "🐮", names: { zh: "星斑牛", en: "Starlit Cow", ja: "ほしまだらウシ" }, colors: ["#393866", "#efeaff", "#8ed7e8"] },
    { id: "buttercup_cow", family: "cow", affinity: "light", icon: "🐮", names: { zh: "奶油花牛", en: "Buttercup Cow", ja: "バターカップウシ" }, colors: ["#d69632", "#fff6c9", "#ef8fb0"] },

    { id: "phoenix_chick", family: "bird", affinity: "fire", icon: "🐦", names: { zh: "鳳火幼鳥", en: "Phoenix Chick", ja: "ひのとりヒナ" }, colors: ["#e04d2e", "#ffc36d", "#ffed8a"] },
    { id: "spray_lark", family: "bird", affinity: "water", icon: "🐦", names: { zh: "浪花雲雀", en: "Spray Lark", ja: "しぶきヒバリ" }, colors: ["#2c96bf", "#c4f1ff", "#ffffff"] },
    { id: "leaf_sparrow", family: "bird", affinity: "nature", icon: "🐦", names: { zh: "葉羽麻雀", en: "Leaf Sparrow", ja: "このはスズメ" }, colors: ["#4fa05c", "#d8ed9c", "#f1c467"] },
    { id: "owlbit", family: "bird", affinity: "night", icon: "🐦", names: { zh: "小夜梟", en: "Owlbit", ja: "こよみフクロウ" }, colors: ["#4e447e", "#b1a2ef", "#72d6cf"] },
    { id: "dawn_canary", family: "bird", affinity: "light", icon: "🐦", names: { zh: "晨光金絲雀", en: "Dawn Canary", ja: "あけぼのカナリア" }, colors: ["#f0b531", "#fff3a9", "#ff9cb7"] },

    { id: "pepper_bun", family: "rabbit", affinity: "fire", icon: "🐰", names: { zh: "胡椒兔", en: "Pepper Bun", ja: "ペッパーうさ" }, colors: ["#c75538", "#ffd0a0", "#6b3a2d"] },
    { id: "splash_bun", family: "rabbit", affinity: "water", icon: "🐰", names: { zh: "水花兔", en: "Splash Bun", ja: "しぶきうさ" }, colors: ["#489dcc", "#d6f6ff", "#ffffff"] },
    { id: "fern_bun", family: "rabbit", affinity: "nature", icon: "🐰", names: { zh: "蕨葉兔", en: "Fern Bun", ja: "しだうさ" }, colors: ["#4d9656", "#ccefb0", "#fff2ce"] },
    { id: "lunar_bun", family: "rabbit", affinity: "night", icon: "🐰", names: { zh: "月影兔", en: "Lunar Bun", ja: "つきかげうさ" }, colors: ["#514886", "#c8bcff", "#84d9dd"] },
    { id: "sugar_bun", family: "rabbit", affinity: "light", icon: "🐰", names: { zh: "糖霜兔", en: "Sugar Bun", ja: "シュガーうさ" }, colors: ["#e4a034", "#fff6c2", "#f7a3c7"] },

    { id: "saffron_fox", family: "fox", affinity: "fire", icon: "🦊", names: { zh: "番紅花狐", en: "Saffron Fox", ja: "サフランキツネ" }, colors: ["#dd6635", "#ffc069", "#6f352a"] },
    { id: "rain_fox", family: "fox", affinity: "water", icon: "🦊", names: { zh: "雨線狐", en: "Rain Fox", ja: "あめキツネ" }, colors: ["#368eb8", "#bcecff", "#f7fbff"] },
    { id: "bramble_fox", family: "fox", affinity: "nature", icon: "🦊", names: { zh: "荊棘狐", en: "Bramble Fox", ja: "いばらキツネ" }, colors: ["#4c8d51", "#c9e99b", "#f1be68"] },
    { id: "eclipse_fox", family: "fox", affinity: "night", icon: "🦊", names: { zh: "蝕月狐", en: "Eclipse Fox", ja: "しょくキツネ" }, colors: ["#44346e", "#a890ee", "#75d7cc"] },
    { id: "glimmer_fox", family: "fox", affinity: "light", icon: "🦊", names: { zh: "微光狐", en: "Glimmer Fox", ja: "きらめきキツネ" }, colors: ["#e7a334", "#fff0a7", "#ff9ab5"] },

    { id: "basalt_turtle", family: "turtle", affinity: "fire", icon: "🐢", names: { zh: "玄武岩龜", en: "Basalt Turtle", ja: "げんぶガメ" }, colors: ["#b45136", "#ffcf91", "#59433a"] },
    { id: "lagoon_turtle", family: "turtle", affinity: "water", icon: "🐢", names: { zh: "瀉湖龜", en: "Lagoon Turtle", ja: "ラグーンガメ" }, colors: ["#2f93b7", "#bff3ff", "#e9fffb"] },
    { id: "mossback", family: "turtle", affinity: "nature", icon: "🐢", names: { zh: "苔背龜", en: "Mossback", ja: "こけせなか" }, colors: ["#4a9050", "#c7eda0", "#eee1a5"] },
    { id: "nebula_turtle", family: "turtle", affinity: "night", icon: "🐢", names: { zh: "星雲龜", en: "Nebula Turtle", ja: "せいうんガメ" }, colors: ["#4c4079", "#b7a7f4", "#79d5db"] },
    { id: "opal_turtle", family: "turtle", affinity: "light", icon: "🐢", names: { zh: "蛋白石龜", en: "Opal Turtle", ja: "オパールガメ" }, colors: ["#d99f36", "#fff4b8", "#f5a1c4"] },

    { id: "blaze_corn", family: "unicorn", affinity: "fire", icon: "🦄", names: { zh: "赤焰獨角獸", en: "Blazecorn", ja: "ブレイズコーン" }, colors: ["#d85a34", "#ffd084", "#fff18f"] },
    { id: "aqua_corn", family: "unicorn", affinity: "water", icon: "🦄", names: { zh: "水晶獨角獸", en: "Aquacorn", ja: "アクアコーン" }, colors: ["#3c9fcb", "#caf2ff", "#ffffff"] },
    { id: "ivy_corn", family: "unicorn", affinity: "nature", icon: "🦄", names: { zh: "藤蔓獨角獸", en: "Ivycorn", ja: "アイビーコーン" }, colors: ["#4f9a59", "#d6f0a7", "#f5cf7b"] },
    { id: "dream_corn", family: "unicorn", affinity: "night", icon: "🦄", names: { zh: "夢夜獨角獸", en: "Dreamcorn", ja: "ドリームコーン" }, colors: ["#50438a", "#c1b0ff", "#72d9d2"] },
    { id: "prism_corn", family: "unicorn", affinity: "light", icon: "🦄", names: { zh: "稜光獨角獸", en: "Prismcorn", ja: "プリズムコーン" }, colors: ["#e29b36", "#fff0a8", "#f29fd0"] }
  ];

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getCurrentLang() {
    return VP.i18n && VP.i18n.getLang ? VP.i18n.getLang() : "zh";
  }

  function listPets() {
    return PETS.slice();
  }

  function getPet(id) {
    return PETS.filter(function (pet) {
      return pet.id === id;
    })[0] || PETS[0];
  }

  function getPetName(id, lang) {
    var pet = typeof id === "string" ? getPet(id) : id;
    lang = lang || getCurrentLang();
    return (pet.names && (pet.names[lang] || pet.names.zh || pet.names.en)) || pet.id;
  }

  function getEggType(id) {
    return EGG_TYPES.filter(function (egg) {
      return egg.id === id;
    })[0] || EGG_TYPES[0];
  }

  function listEggs() {
    return EGG_TYPES.slice();
  }

  function randomPetId(eggTypeId) {
    var egg = getEggType(eggTypeId);
    var pool = PETS.filter(function (pet) {
      return egg.affinities.indexOf(pet.affinity) >= 0;
    });
    var list = pool.length ? pool : PETS;
    return list[Math.floor(Math.random() * list.length)].id;
  }

  function loadCollection() {
    var raw = safeGet(COLLECTION_KEY);
    if (!raw) {
      return {};
    }
    try {
      return JSON.parse(raw) || {};
    } catch (error) {
      return {};
    }
  }

  function saveCollection(collection) {
    safeSet(COLLECTION_KEY, JSON.stringify(collection || {}));
    VP.EventBus.emit("collection:changed", collection || {});
  }

  function markSeen(petId) {
    if (!petId) {
      return;
    }
    var collection = loadCollection();
    collection[petId] = collection[petId] || {};
    collection[petId].seen = true;
    collection[petId].firstSeenAt = collection[petId].firstSeenAt || Date.now();
    saveCollection(collection);
  }

  function markRaised(petId) {
    if (!petId) {
      return;
    }
    var collection = loadCollection();
    collection[petId] = collection[petId] || {};
    collection[petId].seen = true;
    collection[petId].raised = true;
    collection[petId].raisedAt = collection[petId].raisedAt || Date.now();
    saveCollection(collection);
  }

  function markMemorial(petId) {
    if (!petId) {
      return;
    }
    var collection = loadCollection();
    collection[petId] = collection[petId] || {};
    collection[petId].seen = true;
    collection[petId].memorials = (collection[petId].memorials || 0) + 1;
    collection[petId].lastMemorialAt = Date.now();
    saveCollection(collection);
  }

  function getRaisedCount() {
    var collection = loadCollection();
    return PETS.filter(function (pet) {
      return collection[pet.id] && collection[pet.id].raised;
    }).length;
  }

  function getDisplayName(state) {
    if (!state || !state.speciesId || !state.isRevealed) {
      return VP.i18n ? VP.i18n.t("eggSelection.mysteryEgg") : "Mystery Egg";
    }
    return getPetName(state.speciesId);
  }

  return {
    listPets: listPets,
    getPet: getPet,
    getPetName: getPetName,
    listEggs: listEggs,
    getEggType: getEggType,
    randomPetId: randomPetId,
    loadCollection: loadCollection,
    markSeen: markSeen,
    markRaised: markRaised,
    markMemorial: markMemorial,
    getRaisedCount: getRaisedCount,
    getDisplayName: getDisplayName
  };
})();
