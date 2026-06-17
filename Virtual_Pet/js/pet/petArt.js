window.VP = window.VP || {};

VP.PetArt = (function () {
  var serial = 0;

  var STAGE_META = {
    egg: { scale: 0.96, y: 4, detail: 0 },
    juvenile: { scale: 0.96, y: 10, detail: 1 },
    mature: { scale: 1, y: 2, detail: 2 },
    prime: { scale: 1.04, y: -2, detail: 3 },
    elder: { scale: 0.98, y: 12, detail: 4, elder: true }
  };

  var AFFINITY_COLORS = {
    fire: "#ff7a3c",
    water: "#47c8ff",
    nature: "#73d66d",
    night: "#9a86ff",
    light: "#ffd957"
  };

  function hashString(value) {
    var hash = 0;
    var text = String(value || "");
    var i;
    for (i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  }

  function safeColor(value, fallback) {
    return /^#[0-9a-f]{3,8}$/i.test(value || "") ? value : fallback;
  }

  function nextId(seed) {
    serial = (serial + 1) % 1000000;
    return "pa-" + hashString(seed + "-" + serial).toString(36);
  }

  function stageMeta(stage) {
    return STAGE_META[stage] || STAGE_META.egg;
  }

  function getEgg(eggType) {
    return VP.PetCatalog.getEggType(eggType || "ember");
  }

  function getColors(pet, egg, useEgg) {
    var source = useEgg || !pet ? [egg.colors[0], egg.colors[1], "#ffffff"] : pet.colors;
    return [
      safeColor(source[0], "#f58f63"),
      safeColor(source[1], "#ffe0a6"),
      safeColor(source[2] || source[1], "#ffffff")
    ];
  }

  function outline(width, opacity) {
    return ' stroke="#2a2430" stroke-width="' + (width || 5) + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + (opacity || 1) + '"';
  }

  function defs(uid, colors) {
    return [
      "<defs>",
      '<linearGradient id="' + uid + '-body" x1="20%" y1="10%" x2="82%" y2="90%">',
      '<stop offset="0%" stop-color="' + colors[1] + '"/>',
      '<stop offset="55%" stop-color="' + colors[0] + '"/>',
      '<stop offset="100%" stop-color="' + colors[0] + '" stop-opacity="0.78"/>',
      "</linearGradient>",
      '<linearGradient id="' + uid + '-soft" x1="0%" y1="0%" x2="100%" y2="100%">',
      '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.72"/>',
      '<stop offset="100%" stop-color="' + colors[1] + '" stop-opacity="0.18"/>',
      "</linearGradient>",
      '<radialGradient id="' + uid + '-shine" cx="34%" cy="25%" r="70%">',
      '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.86"/>',
      '<stop offset="48%" stop-color="#ffffff" stop-opacity="0.22"/>',
      '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>',
      "</radialGradient>",
      '<linearGradient id="' + uid + '-accent" x1="0%" y1="0%" x2="100%" y2="100%">',
      '<stop offset="0%" stop-color="' + colors[2] + '"/>',
      '<stop offset="100%" stop-color="' + colors[1] + '"/>',
      "</linearGradient>",
      "</defs>"
    ].join("");
  }

  function shellPattern(uid, variant, index) {
    if (variant === 0) {
      return [
        '<circle cx="104" cy="120" r="9" fill="url(#' + uid + '-accent)" opacity="0.5"/>',
        '<circle cx="142" cy="104" r="7" fill="#ffffff" opacity="0.55"/>',
        '<circle cx="152" cy="154" r="11" fill="url(#' + uid + '-accent)" opacity="0.38"/>',
        '<circle cx="114" cy="174" r="6" fill="#ffffff" opacity="0.48"/>'
      ].join("");
    }
    if (variant === 1) {
      return [
        '<path d="M78 126 C106 116 136 116 182 128" fill="none" stroke="url(#' + uid + '-accent)" stroke-width="10" opacity="0.42" stroke-linecap="round"/>',
        '<path d="M84 158 C112 148 144 148 176 160" fill="none" stroke="#ffffff" stroke-width="7" opacity="0.5" stroke-linecap="round"/>'
      ].join("");
    }
    if (variant === 2) {
      return [
        '<path d="M130 86 L142 110 L168 114 L149 132 L154 158 L130 145 L106 158 L111 132 L92 114 L118 110 Z" fill="url(#' + uid + '-accent)" opacity="0.36"/>',
        '<circle cx="130" cy="123" r="12" fill="#ffffff" opacity="0.44"/>'
      ].join("");
    }
    if (variant === 3) {
      return [
        '<path d="M91 102 L169 172" fill="none" stroke="#ffffff" stroke-width="8" opacity="0.48" stroke-linecap="round"/>',
        '<path d="M168 104 L92 174" fill="none" stroke="url(#' + uid + '-accent)" stroke-width="8" opacity="0.38" stroke-linecap="round"/>'
      ].join("");
    }
    return [
      '<path d="M104 120 C116 98 146 98 158 120 C146 112 116 112 104 120 Z" fill="#ffffff" opacity="0.48"/>',
      '<path d="M112 162 C125 145 146 145 158 162 C146 156 124 156 112 162 Z" fill="url(#' + uid + '-accent)" opacity="0.42"/>',
      '<circle cx="' + (116 + index % 24) + '" cy="136" r="5" fill="#ffffff" opacity="0.58"/>'
    ].join("");
  }

  function eggArt(uid, colors, egg, pet, mood) {
    var seed = pet ? pet.id : egg.id;
    var index = hashString(seed);
    var variant = index % 5;
    var wobble = variant * 2;
    var eyeY = 142;
    var face = mood === "sleeping" ? [
      '<path d="M111 ' + eyeY + ' Q118 ' + (eyeY + 5) + ' 125 ' + eyeY + '" fill="none" stroke="#2a2430" stroke-width="4" stroke-linecap="round"/>',
      '<path d="M137 ' + eyeY + ' Q144 ' + (eyeY + 5) + ' 151 ' + eyeY + '" fill="none" stroke="#2a2430" stroke-width="4" stroke-linecap="round"/>',
      '<text x="166" y="105" font-size="22" font-weight="800" fill="#2a2430" opacity="0.42">Z</text>'
    ].join("") : [
      '<ellipse cx="118" cy="' + eyeY + '" rx="5" ry="7" fill="#2a2430"/>',
      '<ellipse cx="144" cy="' + eyeY + '" rx="5" ry="7" fill="#2a2430"/>',
      '<path d="M121 161 Q131 168 142 161" fill="none" stroke="#2a2430" stroke-width="4" stroke-linecap="round"/>'
    ].join("");

    return [
      '<g class="pet-art-egg">',
      '<ellipse cx="130" cy="139" rx="' + (64 + wobble) + '" ry="' + (88 - wobble) + '" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<ellipse cx="110" cy="96" rx="28" ry="39" fill="url(#' + uid + '-shine)" opacity="0.82"/>',
      shellPattern(uid, variant, index),
      '<path d="M92 84 C104 72 121 66 139 68" fill="none" stroke="#ffffff" stroke-width="7" opacity="0.35" stroke-linecap="round"/>',
      face,
      '<ellipse cx="130" cy="228" rx="66" ry="13" fill="#2a2430" opacity="0.12"/>',
      "</g>"
    ].join("");
  }

  function transformFor(stage) {
    var meta = stageMeta(stage);
    return ' transform="translate(130 ' + (136 + meta.y) + ') scale(' + meta.scale + ') translate(-130 -136)"';
  }

  function aura(uid, affinity, stage, variant) {
    var detail = stageMeta(stage).detail;
    var color = AFFINITY_COLORS[affinity] || AFFINITY_COLORS.light;
    var opacity = stage === "elder" ? 0.18 : 0.28 + detail * 0.04;
    var offset = variant * 4;
    if (affinity === "fire") {
      return [
        '<g class="pet-art-aura" opacity="' + opacity + '">',
        '<path d="M67 120 C48 88 74 66 68 38 C99 62 91 89 99 111 Z" fill="' + color + '"/>',
        '<path d="M188 122 C207 91 185 70 194 42 C164 61 169 91 160 112 Z" fill="' + color + '"/>',
        detail >= 3 ? '<path d="M126 52 C142 82 132 96 148 119 C116 104 111 81 126 52 Z" fill="' + color + '"/>' : "",
        "</g>"
      ].join("");
    }
    if (affinity === "water") {
      return [
        '<g class="pet-art-aura" fill="none" stroke="' + color + '" stroke-width="4" opacity="' + opacity + '">',
        '<circle cx="' + (58 + offset) + '" cy="110" r="14"/>',
        '<circle cx="' + (198 - offset) + '" cy="95" r="10"/>',
        '<path d="M48 164 C78 144 103 184 132 164 C160 145 184 184 213 164"/>',
        detail >= 2 ? '<circle cx="182" cy="166" r="7"/>' : "",
        "</g>"
      ].join("");
    }
    if (affinity === "nature") {
      return [
        '<g class="pet-art-aura" fill="' + color + '" opacity="' + opacity + '">',
        '<ellipse cx="' + (62 + offset) + '" cy="126" rx="12" ry="24" transform="rotate(-34 ' + (62 + offset) + ' 126)"/>',
        '<ellipse cx="' + (196 - offset) + '" cy="118" rx="12" ry="24" transform="rotate(34 ' + (196 - offset) + ' 118)"/>',
        detail >= 3 ? '<path d="M125 54 C142 74 144 95 130 112 C112 92 112 72 125 54 Z"/>' : "",
        "</g>"
      ].join("");
    }
    if (affinity === "night") {
      return [
        '<g class="pet-art-aura" fill="' + color + '" opacity="' + opacity + '">',
        '<path d="M65 83 C80 90 93 84 101 70 C100 92 84 107 62 101 C51 98 43 92 39 83 C48 88 57 88 65 83 Z"/>',
        star(196 - offset, 80, 11, color, 1),
        star(207, 141, 7, color, 0.78),
        detail >= 2 ? star(58, 164, 7, color, 0.7) : "",
        "</g>"
      ].join("");
    }
    return [
      '<g class="pet-art-aura" stroke="' + color + '" stroke-width="5" stroke-linecap="round" opacity="' + opacity + '">',
      '<path d="M130 37 L130 67"/>',
      '<path d="M74 62 L92 86"/>',
      '<path d="M188 62 L169 86"/>',
      '<path d="M43 134 L73 134"/>',
      '<path d="M217 134 L187 134"/>',
      "</g>"
    ].join("");
  }

  function star(cx, cy, r, fill, opacity) {
    return '<path d="M' + cx + " " + (cy - r) + " L" + (cx + r * 0.3) + " " + (cy - r * 0.3) + " L" + (cx + r) + " " + cy + " L" + (cx + r * 0.3) + " " + (cy + r * 0.3) + " L" + cx + " " + (cy + r) + " L" + (cx - r * 0.3) + " " + (cy + r * 0.3) + " L" + (cx - r) + " " + cy + " L" + (cx - r * 0.3) + " " + (cy - r * 0.3) + ' Z" fill="' + fill + '" opacity="' + opacity + '"/>';
  }

  function affinityMark(uid, affinity, x, y, size) {
    var color = AFFINITY_COLORS[affinity] || AFFINITY_COLORS.light;
    if (affinity === "fire") {
      return '<path d="M' + x + " " + (y - size) + " C" + (x + size * 0.8) + " " + (y - size * 0.2) + " " + (x + size * 0.35) + " " + (y + size) + " " + x + " " + (y + size * 1.15) + " C" + (x - size * 0.8) + " " + (y + size * 0.2) + " " + (x - size * 0.2) + " " + (y - size * 0.1) + " " + x + " " + (y - size) + ' Z" fill="' + color + '" opacity="0.72"/>';
    }
    if (affinity === "water") {
      return '<path d="M' + x + " " + (y - size) + " C" + (x + size) + " " + y + " " + (x + size * 0.7) + " " + (y + size * 1.15) + " " + x + " " + (y + size * 1.15) + " C" + (x - size * 0.7) + " " + (y + size * 1.15) + " " + (x - size) + " " + y + " " + x + " " + (y - size) + ' Z" fill="' + color + '" opacity="0.72"/>';
    }
    if (affinity === "nature") {
      return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + size * 0.72 + '" ry="' + size * 1.1 + '" fill="' + color + '" opacity="0.72" transform="rotate(38 ' + x + " " + y + ')"/>';
    }
    if (affinity === "night") {
      return '<path d="M' + (x - size * 0.3) + " " + (y - size) + " C" + (x + size * 0.9) + " " + (y - size * 0.3) + " " + (x + size * 0.6) + " " + (y + size * 0.9) + " " + (x - size * 0.5) + " " + (y + size) + " C" + (x + size * 0.05) + " " + y + " " + (x + size * 0.05) + " " + (y - size * 0.45) + " " + (x - size * 0.3) + " " + (y - size) + ' Z" fill="' + color + '" opacity="0.72"/>';
    }
    return star(x, y, size, color, 0.76);
  }

  function face(cx, cy, mood, variant, scale, stage) {
    var s = scale || 1;
    var eyeFill = "#241f28";
    var brow = stage === "elder" ? [
      '<path d="M' + (cx - 38 * s) + " " + (cy - 19 * s) + " Q" + (cx - 24 * s) + " " + (cy - 28 * s) + " " + (cx - 10 * s) + " " + (cy - 20 * s) + '" fill="none" stroke="#ffffff" stroke-width="' + (4 * s) + '" stroke-linecap="round" opacity="0.75"/>',
      '<path d="M' + (cx + 10 * s) + " " + (cy - 20 * s) + " Q" + (cx + 25 * s) + " " + (cy - 28 * s) + " " + (cx + 38 * s) + " " + (cy - 19 * s) + '" fill="none" stroke="#ffffff" stroke-width="' + (4 * s) + '" stroke-linecap="round" opacity="0.75"/>'
    ].join("") : "";

    if (mood === "dead") {
      return [
        '<g class="pet-art-face">',
        xEye(cx - 23 * s, cy - 5 * s, 8 * s),
        xEye(cx + 23 * s, cy - 5 * s, 8 * s),
        '<path d="M' + (cx - 14 * s) + " " + (cy + 24 * s) + " L" + (cx + 14 * s) + " " + (cy + 24 * s) + '" stroke="' + eyeFill + '" stroke-width="' + (4 * s) + '" stroke-linecap="round"/>',
        "</g>"
      ].join("");
    }

    if (mood === "sleeping") {
      return [
        '<g class="pet-art-face">',
        brow,
        '<path d="M' + (cx - 33 * s) + " " + (cy - 6 * s) + " Q" + (cx - 23 * s) + " " + (cy + 2 * s) + " " + (cx - 12 * s) + " " + (cy - 6 * s) + '" fill="none" stroke="' + eyeFill + '" stroke-width="' + (4 * s) + '" stroke-linecap="round"/>',
        '<path d="M' + (cx + 12 * s) + " " + (cy - 6 * s) + " Q" + (cx + 23 * s) + " " + (cy + 2 * s) + " " + (cx + 33 * s) + " " + (cy - 6 * s) + '" fill="none" stroke="' + eyeFill + '" stroke-width="' + (4 * s) + '" stroke-linecap="round"/>',
        '<path d="M' + (cx - 8 * s) + " " + (cy + 25 * s) + " Q" + cx + " " + (cy + 29 * s) + " " + (cx + 8 * s) + " " + (cy + 25 * s) + '" fill="none" stroke="' + eyeFill + '" stroke-width="' + (3 * s) + '" stroke-linecap="round"/>',
        '<text x="' + (cx + 42 * s) + '" y="' + (cy - 32 * s) + '" font-size="' + (18 * s) + '" font-weight="800" fill="' + eyeFill + '" opacity="0.42">Z</text>',
        "</g>"
      ].join("");
    }

    var eyeLeft = variant === 2 ? '<path d="M' + (cx - 25 * s) + " " + (cy - 16 * s) + " L" + (cx - 18 * s) + " " + (cy - 3 * s) + " L" + (cx - 32 * s) + " " + (cy - 3 * s) + ' Z" fill="' + eyeFill + '"/>' : '<ellipse cx="' + (cx - 24 * s) + '" cy="' + (cy - 8 * s) + '" rx="' + (6 * s) + '" ry="' + (variant === 1 ? 10 * s : 8 * s) + '" fill="' + eyeFill + '"/>';
    var eyeRight = variant === 2 ? '<path d="M' + (cx + 25 * s) + " " + (cy - 16 * s) + " L" + (cx + 32 * s) + " " + (cy - 3 * s) + " L" + (cx + 18 * s) + " " + (cy - 3 * s) + ' Z" fill="' + eyeFill + '"/>' : '<ellipse cx="' + (cx + 24 * s) + '" cy="' + (cy - 8 * s) + '" rx="' + (6 * s) + '" ry="' + (variant === 1 ? 10 * s : 8 * s) + '" fill="' + eyeFill + '"/>';
    var sad = mood === "sad" || mood === "sick";
    var mouth = sad ?
      '<path d="M' + (cx - 13 * s) + " " + (cy + 30 * s) + " Q" + cx + " " + (cy + 20 * s) + " " + (cx + 13 * s) + " " + (cy + 30 * s) + '" fill="none" stroke="' + eyeFill + '" stroke-width="' + (4 * s) + '" stroke-linecap="round"/>' :
      '<path d="M' + (cx - 14 * s) + " " + (cy + 18 * s) + " Q" + cx + " " + (cy + 30 * s) + " " + (cx + 14 * s) + " " + (cy + 18 * s) + '" fill="none" stroke="' + eyeFill + '" stroke-width="' + (4 * s) + '" stroke-linecap="round"/>';
    var cheeks = sad ? "" : '<circle cx="' + (cx - 44 * s) + '" cy="' + (cy + 15 * s) + '" r="' + (7 * s) + '" fill="#ff8ea8" opacity="0.42"/><circle cx="' + (cx + 44 * s) + '" cy="' + (cy + 15 * s) + '" r="' + (7 * s) + '" fill="#ff8ea8" opacity="0.42"/>';
    var sick = mood === "sick" ? '<path d="M' + (cx + 41 * s) + " " + (cy - 33 * s) + " C" + (cx + 55 * s) + " " + (cy - 48 * s) + " " + (cx + 66 * s) + " " + (cy - 36 * s) + '" fill="none" stroke="#6edfcf" stroke-width="' + (4 * s) + '" stroke-linecap="round" opacity="0.75"/>' : "";

    return [
      '<g class="pet-art-face">',
      brow,
      eyeLeft,
      eyeRight,
      cheeks,
      mouth,
      sick,
      stage === "elder" ? '<path d="M' + (cx - 14 * s) + " " + (cy + 41 * s) + " Q" + cx + " " + (cy + 46 * s) + " " + (cx + 14 * s) + " " + (cy + 41 * s) + '" fill="none" stroke="#ffffff" stroke-width="' + (2.5 * s) + '" opacity="0.42" stroke-linecap="round"/>' : "",
      "</g>"
    ].join("");
  }

  function xEye(cx, cy, size) {
    return [
      '<path d="M' + (cx - size) + " " + (cy - size) + " L" + (cx + size) + " " + (cy + size) + '" stroke="#241f28" stroke-width="4" stroke-linecap="round"/>',
      '<path d="M' + (cx + size) + " " + (cy - size) + " L" + (cx - size) + " " + (cy + size) + '" stroke="#241f28" stroke-width="4" stroke-linecap="round"/>'
    ].join("");
  }

  function bodyMarks(uid, variant, detail, stage, family) {
    var opacity = stage === "elder" ? 0.26 : 0.38 + detail * 0.06;
    if (detail < 1) {
      return "";
    }
    if (variant === 0) {
      return '<circle cx="103" cy="131" r="12" fill="url(#' + uid + '-accent)" opacity="' + opacity + '"/><circle cx="154" cy="160" r="9" fill="#ffffff" opacity="' + opacity + '"/>';
    }
    if (variant === 1) {
      return '<path d="M91 126 L170 148" stroke="url(#' + uid + '-accent)" stroke-width="9" opacity="' + opacity + '" stroke-linecap="round"/><path d="M96 153 L160 173" stroke="#ffffff" stroke-width="7" opacity="' + (opacity * 0.8) + '" stroke-linecap="round"/>';
    }
    if (variant === 2) {
      return star(130, family === "bird" ? 139 : 150, 12, "url(#" + uid + "-accent)", opacity);
    }
    if (variant === 3) {
      return '<path d="M108 119 Q130 136 152 119" fill="none" stroke="#ffffff" stroke-width="7" opacity="' + opacity + '" stroke-linecap="round"/><path d="M103 170 Q130 151 157 170" fill="none" stroke="url(#' + uid + '-accent)" stroke-width="7" opacity="' + opacity + '" stroke-linecap="round"/>';
    }
    return '<path d="M117 123 C128 116 143 118 151 130 C139 127 127 132 117 123 Z" fill="#ffffff" opacity="' + opacity + '"/><circle cx="142" cy="166" r="7" fill="url(#' + uid + '-accent)" opacity="' + opacity + '"/>';
  }

  function elderVeil(stage) {
    if (stage !== "elder") {
      return "";
    }
    return '<path d="M81 108 C111 88 151 88 181 108 C170 99 148 97 130 99 C111 97 91 99 81 108 Z" fill="#ffffff" opacity="0.24"/>';
  }

  function dragonArt(uid, pet, stage, mood, variant) {
    var detail = stageMeta(stage).detail;
    var wing = detail >= 2;
    return [
      '<g class="pet-art-creature pet-art-dragon"' + transformFor(stage) + ">",
      wing ? '<path d="M90 122 C57 84 73 57 42 42 C45 80 36 109 83 145 Z" fill="url(#' + uid + '-accent)" opacity="0.74"' + outline(4) + "/>" : '<path d="M90 136 C68 124 65 102 52 91 C53 117 64 139 89 151 Z" fill="url(#' + uid + '-accent)" opacity="0.45"' + outline(3, 0.75) + "/>",
      wing ? '<path d="M170 122 C203 84 187 57 218 42 C215 80 224 109 177 145 Z" fill="url(#' + uid + '-accent)" opacity="0.74"' + outline(4) + "/>" : '<path d="M170 136 C192 124 195 102 208 91 C207 117 196 139 171 151 Z" fill="url(#' + uid + '-accent)" opacity="0.45"' + outline(3, 0.75) + "/>",
      '<path d="M173 164 C203 179 225 153 209 130 C228 140 232 169 208 187 C188 202 164 184 158 170 Z" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<ellipse cx="130" cy="143" rx="69" ry="68" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<ellipse cx="130" cy="164" rx="34" ry="42" fill="url(#' + uid + '-soft)" opacity="0.72"/>',
      bodyMarks(uid, variant, detail, stage, "dragon"),
      '<path d="M105 86 L89 48 L121 77 Z" fill="url(#' + uid + '-accent)"' + outline(4) + "/>",
      '<path d="M155 86 L171 48 L139 77 Z" fill="url(#' + uid + '-accent)"' + outline(4) + "/>",
      detail >= 3 ? '<path d="M130 70 L140 91 L120 91 Z" fill="#ffffff" opacity="0.7"' + outline(3, 0.8) + "/>" : "",
      '<path d="M91 189 Q107 203 124 190" fill="none"' + outline(7, 0.82) + "/>",
      '<path d="M136 190 Q153 203 170 189" fill="none"' + outline(7, 0.82) + "/>",
      affinityMark(uid, pet.affinity, 130, 169, detail >= 3 ? 12 : 9),
      elderVeil(stage),
      face(130, 130, mood, variant, 1, stage),
      "</g>"
    ].join("");
  }

  function fishArt(uid, pet, stage, mood, variant) {
    var detail = stageMeta(stage).detail;
    var tall = variant % 2 === 0 ? 52 : 44;
    return [
      '<g class="pet-art-creature pet-art-fish"' + transformFor(stage) + ">",
      '<path d="M185 136 L223 ' + (95 + variant * 3) + ' L223 ' + (177 - variant * 2) + ' Z" fill="url(#' + uid + '-accent)"' + outline(5) + "/>",
      '<path d="M103 103 C82 113 70 130 69 147 C84 139 96 131 111 121 Z" fill="url(#' + uid + '-accent)" opacity="0.68"' + outline(4) + "/>",
      detail >= 2 ? '<path d="M126 91 C143 60 166 70 173 104 Z" fill="url(#' + uid + '-accent)" opacity="0.62"' + outline(4) + "/>" : "",
      '<ellipse cx="132" cy="138" rx="72" ry="' + tall + '" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="M122 187 C142 210 166 200 170 170 Z" fill="url(#' + uid + '-accent)" opacity="0.55"' + outline(4) + "/>",
      '<ellipse cx="103" cy="137" rx="22" ry="28" fill="url(#' + uid + '-soft)" opacity="0.58"/>',
      detail >= 2 ? '<path d="M127 113 Q139 137 127 162 M148 112 Q160 137 148 162 M169 120 Q178 137 169 154" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.42" stroke-linecap="round"/>' : "",
      bodyMarks(uid, variant, detail, stage, "fish"),
      affinityMark(uid, pet.affinity, 153, 143, detail >= 3 ? 11 : 8),
      elderVeil(stage),
      face(105, 132, mood, variant, 0.78, stage),
      detail >= 3 ? '<path d="M202 117 L226 98 M201 156 L226 176" stroke="#ffffff" stroke-width="5" opacity="0.38" stroke-linecap="round"/>' : "",
      "</g>"
    ].join("");
  }

  function catArt(uid, pet, stage, mood, variant) {
    var detail = stageMeta(stage).detail;
    return [
      '<g class="pet-art-creature pet-art-cat"' + transformFor(stage) + ">",
      '<path d="M177 169 C215 152 211 111 184 102 C211 107 235 143 215 177 C202 199 181 194 166 179 Z" fill="url(#' + uid + '-accent)"' + outline(5) + "/>",
      '<path d="M91 95 L68 49 L111 75 Z" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="M169 95 L192 49 L149 75 Z" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="M92 75 L79 54 L102 68 Z" fill="#ffc8d6" opacity="0.64"/>',
      '<path d="M168 75 L181 54 L158 68 Z" fill="#ffc8d6" opacity="0.64"/>',
      '<ellipse cx="130" cy="143" rx="70" ry="65" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      bodyMarks(uid, variant, detail, stage, "cat"),
      detail >= 2 ? '<path d="M78 139 L37 127 M78 153 L37 153 M182 139 L223 127 M182 153 L223 153" stroke="#2a2430" stroke-width="3.5" stroke-linecap="round" opacity="0.74"/>' : "",
      '<path d="M93 194 Q110 205 124 190" fill="none"' + outline(7, 0.72) + "/>",
      '<path d="M136 190 Q151 205 168 194" fill="none"' + outline(7, 0.72) + "/>",
      affinityMark(uid, pet.affinity, 130, 170, detail >= 3 ? 11 : 8),
      elderVeil(stage),
      face(130, 132, mood, variant, 1, stage),
      "</g>"
    ].join("");
  }

  function dogArt(uid, pet, stage, mood, variant) {
    var detail = stageMeta(stage).detail;
    return [
      '<g class="pet-art-creature pet-art-dog"' + transformFor(stage) + ">",
      '<path d="M174 169 C199 148 212 158 218 178 C200 174 189 191 170 184 Z" fill="url(#' + uid + '-accent)"' + outline(5) + "/>",
      '<path d="M88 91 C54 91 55 139 82 151 C93 132 93 110 88 91 Z" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="M172 91 C206 91 205 139 178 151 C167 132 167 110 172 91 Z" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<ellipse cx="130" cy="145" rx="70" ry="64" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<ellipse cx="130" cy="159" rx="34" ry="25" fill="url(#' + uid + '-soft)" opacity="0.82"/>',
      bodyMarks(uid, variant, detail, stage, "dog"),
      detail >= 2 ? '<path d="M103 187 Q111 205 128 192 M134 192 Q151 205 158 187" fill="none"' + outline(7, 0.68) + "/>" : "",
      detail >= 3 ? '<path d="M95 101 C112 88 146 88 164 101" fill="none" stroke="url(#' + uid + '-accent)" stroke-width="8" opacity="0.45" stroke-linecap="round"/>' : "",
      affinityMark(uid, pet.affinity, 130, 174, detail >= 3 ? 11 : 8),
      elderVeil(stage),
      face(130, 132, mood, variant, 0.96, stage),
      "</g>"
    ].join("");
  }

  function cowArt(uid, pet, stage, mood, variant) {
    var detail = stageMeta(stage).detail;
    return [
      '<g class="pet-art-creature pet-art-cow"' + transformFor(stage) + ">",
      '<path d="M94 84 C71 54 76 36 94 45 C107 52 103 71 94 84 Z" fill="#f0dfbc"' + outline(4) + "/>",
      '<path d="M166 84 C189 54 184 36 166 45 C153 52 157 71 166 84 Z" fill="#f0dfbc"' + outline(4) + "/>",
      '<ellipse cx="81" cy="115" rx="25" ry="34" fill="url(#' + uid + '-accent)" opacity="0.78"' + outline(4) + "/>",
      '<ellipse cx="179" cy="115" rx="25" ry="34" fill="url(#' + uid + '-accent)" opacity="0.78"' + outline(4) + "/>",
      '<ellipse cx="130" cy="143" rx="74" ry="66" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<ellipse cx="130" cy="165" rx="39" ry="26" fill="#ffd7d8" opacity="0.86"' + outline(4, 0.62) + "/>",
      '<ellipse cx="118" cy="163" rx="4" ry="5" fill="#2a2430" opacity="0.5"/><ellipse cx="142" cy="163" rx="4" ry="5" fill="#2a2430" opacity="0.5"/>',
      bodyMarks(uid, variant, detail + 1, stage, "cow"),
      detail >= 2 ? '<path d="M98 192 Q114 205 127 190 M133 190 Q148 205 164 192" fill="none"' + outline(8, 0.7) + "/>" : "",
      affinityMark(uid, pet.affinity, 130, 125, detail >= 3 ? 10 : 7),
      elderVeil(stage),
      face(130, 125, mood, variant, 0.9, stage),
      "</g>"
    ].join("");
  }

  function birdArt(uid, pet, stage, mood, variant) {
    var detail = stageMeta(stage).detail;
    return [
      '<g class="pet-art-creature pet-art-bird"' + transformFor(stage) + ">",
      detail >= 2 ? '<path d="M95 158 C55 143 58 101 91 86 C82 121 93 140 119 153 Z" fill="url(#' + uid + '-accent)" opacity="0.68"' + outline(5) + "/>" : "",
      detail >= 2 ? '<path d="M165 158 C205 143 202 101 169 86 C178 121 167 140 141 153 Z" fill="url(#' + uid + '-accent)" opacity="0.68"' + outline(5) + "/>" : "",
      '<path d="M105 196 L90 219 M130 199 L130 224 M155 196 L170 219" stroke="#2a2430" stroke-width="5" stroke-linecap="round"/>',
      '<ellipse cx="130" cy="142" rx="65" ry="72" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="M112 75 C118 51 131 44 145 73 C133 67 122 68 112 75 Z" fill="url(#' + uid + '-accent)"' + outline(4) + "/>",
      '<path d="M116 142 L144 142 L130 162 Z" fill="#f2a23b"' + outline(3, 0.72) + "/>",
      bodyMarks(uid, variant, detail, stage, "bird"),
      detail >= 3 ? '<path d="M91 199 C74 214 59 204 55 188 C71 192 83 184 91 169 Z" fill="url(#' + uid + '-accent)" opacity="0.58"' + outline(4) + "/>" : "",
      affinityMark(uid, pet.affinity, 130, 174, detail >= 3 ? 10 : 7),
      elderVeil(stage),
      face(130, 122, mood, variant, 0.86, stage),
      "</g>"
    ].join("");
  }

  function rabbitArt(uid, pet, stage, mood, variant) {
    var detail = stageMeta(stage).detail;
    var droop = stage === "elder";
    return [
      '<g class="pet-art-creature pet-art-rabbit"' + transformFor(stage) + ">",
      '<path d="' + (droop ? "M91 95 C62 94 42 118 50 151 C72 139 88 123 98 101" : "M93 94 C78 49 88 30 111 73 C106 82 101 89 93 94") + '" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="' + (droop ? "M169 95 C198 94 218 118 210 151 C188 139 172 123 162 101" : "M167 94 C182 49 172 30 149 73 C154 82 159 89 167 94") + '" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="M96 84 C89 58 95 47 106 75" fill="none" stroke="#ffc8d6" stroke-width="9" stroke-linecap="round" opacity="0.66"/>',
      '<path d="M164 84 C171 58 165 47 154 75" fill="none" stroke="#ffc8d6" stroke-width="9" stroke-linecap="round" opacity="0.66"/>',
      '<circle cx="190" cy="174" r="' + (detail >= 3 ? 19 : 14) + '" fill="#ffffff" opacity="0.88"' + outline(4, 0.55) + "/>",
      '<ellipse cx="130" cy="146" rx="68" ry="66" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      bodyMarks(uid, variant, detail, stage, "rabbit"),
      detail >= 2 ? '<rect x="124" y="162" width="8" height="16" rx="2" fill="#ffffff" opacity="0.86"/><rect x="134" y="162" width="8" height="16" rx="2" fill="#ffffff" opacity="0.86"/>' : "",
      '<path d="M93 194 Q109 207 125 190 M135 190 Q151 207 167 194" fill="none"' + outline(7, 0.68) + "/>",
      affinityMark(uid, pet.affinity, 130, 132, detail >= 3 ? 10 : 7),
      elderVeil(stage),
      face(130, 128, mood, variant, 0.94, stage),
      "</g>"
    ].join("");
  }

  function foxArt(uid, pet, stage, mood, variant) {
    var detail = stageMeta(stage).detail;
    return [
      '<g class="pet-art-creature pet-art-fox"' + transformFor(stage) + ">",
      '<path d="M174 166 C224 143 226 93 183 72 C205 110 197 142 164 160 Z" fill="url(#' + uid + '-accent)"' + outline(5) + "/>",
      '<path d="M197 82 C216 96 217 120 205 139 C202 115 194 99 178 85 Z" fill="#ffffff" opacity="0.72"/>',
      '<path d="M91 94 L68 45 L113 75 Z" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="M169 94 L192 45 L147 75 Z" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<ellipse cx="130" cy="143" rx="70" ry="65" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="M86 126 C105 109 155 109 174 126 C156 139 105 139 86 126 Z" fill="#ffffff" opacity="0.34"/>',
      '<path d="M103 177 C117 191 142 191 157 177 C147 199 113 199 103 177 Z" fill="#ffffff" opacity="0.62"/>',
      bodyMarks(uid, variant, detail, stage, "fox"),
      detail >= 3 ? '<path d="M87 72 L103 83 M173 72 L157 83" stroke="#2a2430" stroke-width="4" opacity="0.55" stroke-linecap="round"/>' : "",
      affinityMark(uid, pet.affinity, 130, 168, detail >= 3 ? 11 : 8),
      elderVeil(stage),
      face(130, 130, mood, variant, 0.95, stage),
      "</g>"
    ].join("");
  }

  function turtleArt(uid, pet, stage, mood, variant) {
    var detail = stageMeta(stage).detail;
    return [
      '<g class="pet-art-creature pet-art-turtle"' + transformFor(stage) + ">",
      '<ellipse cx="130" cy="93" rx="33" ry="30" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<ellipse cx="70" cy="154" rx="24" ry="18" fill="url(#' + uid + '-body)"' + outline(4) + "/>",
      '<ellipse cx="190" cy="154" rx="24" ry="18" fill="url(#' + uid + '-body)"' + outline(4) + "/>",
      '<ellipse cx="95" cy="199" rx="21" ry="16" fill="url(#' + uid + '-body)"' + outline(4) + "/>",
      '<ellipse cx="165" cy="199" rx="21" ry="16" fill="url(#' + uid + '-body)"' + outline(4) + "/>",
      '<ellipse cx="130" cy="153" rx="82" ry="61" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<ellipse cx="130" cy="153" rx="55" ry="40" fill="url(#' + uid + '-accent)" opacity="0.48"' + outline(3, 0.55) + "/>",
      '<path d="M130 113 L154 153 L130 193 L106 153 Z" fill="#ffffff" opacity="0.22"' + outline(3, 0.38) + "/>",
      detail >= 2 ? '<path d="M75 153 H185 M100 122 L118 185 M160 122 L142 185" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.36" stroke-linecap="round"/>' : "",
      bodyMarks(uid, variant, detail, stage, "turtle"),
      affinityMark(uid, pet.affinity, 130, 153, detail >= 3 ? 10 : 7),
      elderVeil(stage),
      face(130, 88, mood, variant, 0.65, stage),
      "</g>"
    ].join("");
  }

  function unicornArt(uid, pet, stage, mood, variant) {
    var detail = stageMeta(stage).detail;
    return [
      '<g class="pet-art-creature pet-art-unicorn"' + transformFor(stage) + ">",
      '<path d="M183 158 C207 135 224 145 226 172 C206 162 196 188 177 180 Z" fill="url(#' + uid + '-accent)"' + outline(5) + "/>",
      '<ellipse cx="143" cy="161" rx="58" ry="47" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="M85 120 C80 80 104 62 132 78 C155 92 153 130 129 145 C111 157 91 145 85 120 Z" fill="url(#' + uid + '-body)"' + outline(5) + "/>",
      '<path d="M109 70 L121 28 L134 75 Z" fill="url(#' + uid + '-accent)"' + outline(4) + "/>",
      '<path d="M92 87 L70 55 L104 72 Z" fill="url(#' + uid + '-body)"' + outline(4) + "/>",
      detail >= 2 ? '<path d="M133 76 C154 88 156 116 144 135" fill="none" stroke="url(#' + uid + '-accent)" stroke-width="12" opacity="0.72" stroke-linecap="round"/>' : "",
      bodyMarks(uid, variant, detail, stage, "unicorn"),
      '<path d="M112 199 L108 221 M149 201 L151 224 M175 195 L183 217" stroke="#2a2430" stroke-width="6" stroke-linecap="round"/>',
      detail >= 3 ? star(121, 31, 8, "#ffffff", 0.72) : "",
      affinityMark(uid, pet.affinity, 142, 160, detail >= 3 ? 10 : 7),
      elderVeil(stage),
      face(112, 115, mood, variant, 0.78, stage),
      "</g>"
    ].join("");
  }

  function creatureArt(uid, pet, stage, mood, variant) {
    var family = pet.family;
    if (family === "dragon") {
      return dragonArt(uid, pet, stage, mood, variant);
    }
    if (family === "fish") {
      return fishArt(uid, pet, stage, mood, variant);
    }
    if (family === "cat") {
      return catArt(uid, pet, stage, mood, variant);
    }
    if (family === "dog") {
      return dogArt(uid, pet, stage, mood, variant);
    }
    if (family === "cow") {
      return cowArt(uid, pet, stage, mood, variant);
    }
    if (family === "bird") {
      return birdArt(uid, pet, stage, mood, variant);
    }
    if (family === "rabbit") {
      return rabbitArt(uid, pet, stage, mood, variant);
    }
    if (family === "fox") {
      return foxArt(uid, pet, stage, mood, variant);
    }
    if (family === "turtle") {
      return turtleArt(uid, pet, stage, mood, variant);
    }
    return unicornArt(uid, pet, stage, mood, variant);
  }

  function buildSvg(pet, stage, mood, eggType, concealed, compact) {
    var egg = getEgg(eggType);
    var isEgg = stage === "egg" || !pet;
    var seed = (pet ? pet.id : egg.id) + "-" + stage + "-" + mood + "-" + (concealed ? "hidden" : "shown");
    var uid = nextId(seed);
    var colors = getColors(pet, egg, isEgg || concealed);
    var variant = hashString(seed) % 5;
    var family = isEgg || concealed ? "egg" : pet.family;
    var affinity = pet && !isEgg ? pet.affinity : egg.affinities[variant % egg.affinities.length];
    var art = isEgg ? eggArt(uid, colors, egg, pet, mood || "normal") : aura(uid, affinity, stage, variant) + creatureArt(uid, pet, stage, mood || "normal", variant);
    var className = "pet-art" + (compact ? " pet-art-compact" : "");

    return [
      '<div class="' + className + '" data-art-family="' + family + '" data-art-stage="' + stage + '" data-art-affinity="' + affinity + '" style="--art-primary:' + colors[0] + ';--art-secondary:' + colors[1] + ';--art-accent:' + colors[2] + ';">',
      '<svg class="pet-art-svg" viewBox="0 0 260 260" focusable="false" aria-hidden="true" role="presentation">',
      defs(uid, colors),
      art,
      "</svg>",
      "</div>"
    ].join("");
  }

  function render(element, options) {
    options = options || {};
    if (!element) {
      return;
    }
    var stage = options.stage || "egg";
    var shownSpecies = options.species || null;
    var hiddenSpecies = options.hiddenSpecies || null;
    var artSpecies = shownSpecies || hiddenSpecies;
    var concealed = !shownSpecies;
    var mood = options.mood || "normal";
    var key = [
      artSpecies ? artSpecies.id : "",
      stage,
      mood,
      options.eggType || "",
      concealed ? "hidden" : "shown"
    ].join("|");

    if (element.getAttribute("data-art-key") === key) {
      return;
    }
    element.innerHTML = buildSvg(artSpecies, stage, mood, options.eggType, concealed, false);
    element.setAttribute("data-art-key", key);
  }

  function thumbnail(pet, stage) {
    return buildSvg(pet, stage || "prime", "happy", null, false, true);
  }

  return {
    buildSvg: buildSvg,
    render: render,
    thumbnail: thumbnail
  };
})();
