(function (PSG) {
  'use strict';

  var speciesOrder = ['eagle', 'lion', 'crocodile'];
  var cached = {};
  var nameParts = {
    'zh-Hant': { prefix: ['疾風','晨星','青葉','琥珀','霜羽','潮音','赤焰','銀月','晴空','岩心'], core: ['阿爾','米菈','諾亞','凜','索恩','露卡','凱伊','希亞','羅恩','亞瑟'], title: ['旅者','守望者','挑戰者','追光者','鍛鍊家','競技士'] },
    en: { prefix: ['Swift','Dawn','Verdant','Amber','Frost','Tidal','Scarlet','Silver','Azure','Stone'], core: ['Arlo','Mira','Noah','Rin','Thorne','Luca','Kai','Thea','Rowan','Arthur'], title: ['Wayfarer','Warden','Challenger','Lightseeker','Trainer','Duelist'] },
    ja: { prefix: ['疾風','暁星','青葉','琥珀','霜羽','潮音','紅蓮','銀月','蒼空','岩心'], core: ['アル','ミラ','ノア','リン','ソーン','ルカ','カイ','シア','ロアン','アーサー'], title: ['旅人','守り人','挑戦者','光追い','鍛錬士','闘士'] }
  };
  var rivalNames = {
    'zh-Hant': { rival_sora:'蒼空・索拉',rival_leon:'赤鬃・里昂',rival_goro:'岩甲・五郎',rival_aria:'天翔・艾莉亞',rival_nova:'烈星・諾瓦',rival_bruno:'深潭・布魯諾',rival_ren:'疾風・蓮',rival_regulus:'金獅・雷古勒斯',rival_titan:'古岩・泰坦',rival_marea:'潮汐・瑪蕾雅',rival_zenith:'天頂・澤尼斯',rival_crown:'冠冕・奧雷恩' },
    en: { rival_sora:'Sora of the Azure Sky',rival_leon:'Leon Redmane',rival_goro:'Goro Stoneplate',rival_aria:'Aria Skyborne',rival_nova:'Nova Blazestar',rival_bruno:'Bruno of the Deep',rival_ren:'Ren Galefoot',rival_regulus:'Regulus Goldmane',rival_titan:'Titan Ancientrock',rival_marea:'Marea Tideshield',rival_zenith:'Zenith Highsky',rival_crown:'Aureon the Crown' },
    ja: { rival_sora:'蒼空のソラ',rival_leon:'赤鬃のレオン',rival_goro:'岩甲のゴロウ',rival_aria:'天翔のアリア',rival_nova:'烈星のノヴァ',rival_bruno:'深潭のブルーノ',rival_ren:'疾風のレン',rival_regulus:'金獅子レグルス',rival_titan:'古岩のタイタン',rival_marea:'潮汐のマレア',rival_zenith:'天頂のゼニス',rival_crown:'冠王アウレオン' }
  };

  function createRankOrder(seed) {
    var order = [];
    for (var rank = 1; rank <= 999; rank += 1) order.push(PSG.data.rivalByRank[rank] ? PSG.data.rivalByRank[rank].id : 'ai_' + String(rank).padStart(4, '0'));
    order.push('player');
    return order;
  }
  function originalRank(id) {
    // AI strength is tied to its immutable ID rank. Swapping with the player must not mutate its build.
    if (PSG.data.rivalById[id]) return PSG.data.rivalById[id].rank;
    return Number(String(id).split('_')[1]) || 999;
  }
  function stageForRank(rank) {
    if (rank <= 25) return 6; if (rank <= 100) return 5; if (rank <= 250) return 4; if (rank <= 500) return 3; if (rank <= 750) return 2; return 1;
  }
  function aiName(id, seed, language) {
    var rival = PSG.data.rivalById[id];
    if (rival) return (rivalNames[language] || rivalNames['zh-Hant'])[id];
    var rank = originalRank(id);
    var dict = nameParts[language] || nameParts['zh-Hant'];
    var rng = new PSG.utils.RNG(PSG.utils.seedFrom(seed, id, 'name'));
    var separator = language === 'en' ? ' ' : '・';
    return rng.pick(dict.prefix) + separator + rng.pick(dict.core) + separator + rng.pick(dict.title) + ' ' + String(rank).padStart(3, '0');
  }
  function equipmentFor(stage, speciesId, rank) {
    var strength = PSG.data.species[speciesId].strengths;
    var armorKey = strength.indexOf('hp') >= 0 ? 'vital' : 'guard';
    var accessoryKey = strength.indexOf('spAttack') >= 0 ? 'spirit' : 'strike';
    var emblemKey = rank % 4 === 0 ? 'fortune' : 'gale';
    return { armor: 'eq_' + stage + '_' + armorKey, accessory: 'eq_' + stage + '_' + accessoryKey, emblem: 'eq_' + stage + '_' + emblemKey };
  }
  function getAI(id, seed, language) {
    var cacheKey = [id, seed, language].join('|');
    if (cached[cacheKey]) return cached[cacheKey];
    var rank = originalRank(id);
    var rival = PSG.data.rivalById[id];
    // Every identity/configuration decision derives from rankingSeed + stable ID for reload determinism.
    var progress = 1 - ((rank - 1) / 999);
    var level = PSG.utils.math.clamp(Math.round(1 + 99 * Math.pow(progress, 0.75)), 1, 100);
    var masteryTarget = Math.round(20 * Math.pow(progress, 1.10));
    // Cycling species keeps every 30-rank window balanced; the seed only rotates the starting species.
    var offset = PSG.utils.seedFrom(seed, 'species') % 3;
    var speciesId = rival ? rival.speciesId : speciesOrder[(rank + offset) % 3];
    var mastery = {};
    PSG.constants.STAT_KEYS.forEach(function (key) {
      var advantage = PSG.data.species[speciesId].strengths.indexOf(key) >= 0 ? 1 : -1;
      mastery[key] = { level: PSG.utils.math.clamp(masteryTarget + advantage, 0, 20), xp: 0 };
    });
    var stage = stageForRank(rank);
    var ai = {
      id: id, originalRank: rank, name: aiName(id, seed, language), speciesId: speciesId, level: level,
      tactic: rival ? rival.tactic : speciesId === 'crocodile' ? 'defense' : rank % 2 ? 'normal' : 'offense',
      equipmentStage: stage, milestone: Boolean(rival),
      pet: { name: aiName(id, seed, language), speciesId: speciesId, level: level, xp: 0, affection: Math.round(progress * 100), mastery: mastery },
      economy: { equipped: equipmentFor(stage, speciesId, rank) }
    };
    ai.stats = PSG.pet.stats.effective(ai);
    ai.bp = PSG.pet.stats.battlePower(ai);
    cached[cacheKey] = ai;
    return ai;
  }

  PSG.ranking.generator = { createRankOrder: createRankOrder, getAI: getAI, originalRank: originalRank, stageForRank: stageForRank, rivalNames: rivalNames };
})(window.PSG);
