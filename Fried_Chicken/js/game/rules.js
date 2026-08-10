(function (global) {
  "use strict";
  var CCC = global.CCC = global.CCC || {};
  var clamp = (CCC.utils && CCC.utils.clamp) || function (value, min, max) { return Math.min(max, Math.max(min, value)); };

  function marinadeScore(progress, prepLevel) {
    var low = prepLevel >= 2 ? 65 : 70;
    var high = prepLevel >= 2 ? 95 : 90;
    if (progress > 100 || progress < 35) { return 10; }
    if (progress >= low && progress <= high) { return 100; }
    if (progress >= 50 && progress <= 100) { return 72; }
    return 38;
  }

  function coatingScore(progress, prepLevel) {
    var perfectAt = prepLevel >= 3 ? 85 : 90;
    if (progress >= perfectAt) { return 100; }
    if (progress >= 70) { return 75; }
    return Math.max(25, progress * .72);
  }

  function fryingScore(fry) {
    if (!fry || fry.doneness < 80 || fry.doneness > 115) { return 0; }
    var doneness = fry.doneness >= 90 && fry.doneness <= 100 ? 100 : 68;
    var temperature = clamp((fry.idealRatio || 0) / .7, 0, 1) * 100;
    var flip = fry.flipAt >= 45 && fry.flipAt <= 60 ? 100 : (typeof fry.flipAt === "number" ? 58 : 20);
    return Math.round(doneness * .5 + temperature * .32 + flip * .18);
  }

  function totalQuality(piece) {
    var marinade = marinadeScore(piece.marinade, piece.prepLevel || 1);
    var coating = coatingScore(piece.coating, piece.prepLevel || 1);
    var frying = fryingScore(piece.fry);
    var flavor = piece.flavorScore == null ? 0 : piece.flavorScore;
    var score = marinade * .20 + coating * .20 + frying * .45 + flavor * .15;
    var total = Math.round(clamp(score, 0, 100));
    if (piece.seasoningAttempts > 1) {
      if (total >= 90) { total = 89; }
      else if (total >= 75) { total = 74; }
      else if (total >= 60) { total = 59; }
    }
    return {
      marinade: Math.round(marinade), coating: Math.round(coating), frying: Math.round(frying),
      flavor: Math.round(flavor), total: total
    };
  }

  function grade(score) {
    if (score >= 90) { return { id: "perfect", multiplier: 1.15 }; }
    if (score >= 75) { return { id: "delicious", multiplier: 1.00 }; }
    if (score >= 60) { return { id: "normal", multiplier: .80 }; }
    return { id: "pass", multiplier: .60 };
  }

  function comboMultiplier(combo) {
    if (combo >= 10) { return 1.15; }
    if (combo >= 6) { return 1.10; }
    if (combo >= 3) { return 1.05; }
    return 1;
  }

  function patienceMultiplier(ratio) { return .70 + clamp(ratio, 0, 1) * .30; }

  function income(basePrice, qualityScore, patienceRatio, combo) {
    return Math.round(basePrice * grade(qualityScore).multiplier * patienceMultiplier(patienceRatio) * comboMultiplier(combo));
  }

  function stars(revenue, goal, satisfaction, waste) {
    if (revenue < goal) { return 0; }
    if (revenue >= goal * 1.4 && satisfaction >= 90 && waste <= 1) { return 3; }
    if (revenue >= goal * 1.2 && satisfaction >= 75) { return 2; }
    return 1;
  }

  CCC.rules = {
    marinadeScore: marinadeScore,
    coatingScore: coatingScore,
    fryingScore: fryingScore,
    totalQuality: totalQuality,
    grade: grade,
    comboMultiplier: comboMultiplier,
    patienceMultiplier: patienceMultiplier,
    income: income,
    stars: stars
  };

  if (typeof module !== "undefined" && module.exports) { module.exports = CCC.rules; }
}(typeof window !== "undefined" ? window : globalThis));
