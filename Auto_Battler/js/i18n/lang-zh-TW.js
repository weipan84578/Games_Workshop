(function (root) {
  root.AutoBattlerLang = root.AutoBattlerLang || {};
  root.AutoBattlerLang["zh-TW"] = {
    app: {
      title: "Starry Sprouts",
      tagline: "種下夢想，讓小夥伴自動出擊！",
      offline: "離線可玩・進度保存在本機"
    },
    menu: {
      start: "開始遊戲",
      continue: "繼續遊戲",
      help: "遊戲說明",
      settings: "設定",
      home: "主畫面",
      noSave: "尚無存檔紀錄",
      overwriteTitle: "要開啟新的冒險嗎？",
      overwriteCopy: "開始新遊戲將覆蓋現有進度，確定要開始嗎？"
    },
    common: {
      backHome: "返回主畫面",
      gameStatus: "遊戲狀態",
      mainMenu: "主畫面",
      settings: "設定",
      language: "語言",
      board: "戰鬥棋盤",
      helpChapters: "說明章節",
      cancel: "取消",
      confirm: "確定",
      close: "關閉",
      yes: "好，開始吧！",
      no: "先不要",
      ok: "知道了",
      gold: "金幣",
      active: "已啟用",
      inactive: "未啟用",
      locked: "已鎖定",
      unlocked: "未鎖定"
    },
    game: {
      gold: "金幣",
      health: "生命",
      round: "回合",
      level: "等級",
      synergies: "羈絆",
      tipTitle: "小提示",
      boardEyebrow: "星光戰場",
      boardTitle: "布陣棋盤",
      exp: "經驗",
      readyHint: "買下小夥伴，點擊棋子再點擊格子來布陣吧！",
      selectHint: "已選取 {name}，請選擇棋盤格",
      boardFull: "棋盤已達目前等級上限",
      placed: "{name} 已就位！",
      removed: "{name} 回到備戰區",
      shop: "星光商店",
      bench: "備戰區",
      benchHint: "點擊備戰區棋子，再點擊棋盤格放置",
      refresh: "刷新",
      lock: "鎖定",
      unlock: "解鎖",
      startBattle: "開始戰鬥",
      buyXp: "購買經驗",
      noGold: "金幣不夠喔！",
      noUnits: "至少放一位小夥伴上場吧！",
      alreadyOut: "生命值已歸零，請開始新的冒險。",
      boardTile: "棋盤格 {number}",
      lockedShop: "商店已鎖定",
      refreshed: "商店刷新完成！",
      bought: "買到 {name}！",
      xpBought: "獲得 {amount} 點經驗",
      levelUp: "升到等級 {level}！棋盤容量增加了！",
      placedAuto: "{name} 已加入備戰區",
      phase: { prepare: "準備階段", battle: "自動戰鬥", settle: "回合結算" },
      stage: "第 {round} 波",
      battleStarting: "雙方陣容已鎖定，戰鬥模擬中…",
      battleVictory: "勝利！星光夥伴守住了戰場",
      battleDefeat: "惜敗！下一回合再追回來",
      battleDraw: "平手！雙方都很努力",
      attackLog: "{attacker} 對 {target} 造成 {damage} 傷害",
      healLog: "{target} 回復 {amount} 生命",
      shieldLog: "{target} 獲得 {amount} 護盾",
      skillLog: "{attacker} 施放了 {skill}！",
      defeatedLog: "{name} 倒下了",
      rewardLog: "收入 +{income} 金幣（基礎 {base}・利息 {interest}）",
      damageTaken: "受到 {damage} 點傷害",
      resultTitleWin: "勝利！",
      resultTitleLose: "再接再厲！",
      resultTitleDraw: "漂亮的平手！",
      resultCopyWin: "你的陣容在星光下閃閃發亮。",
      resultCopyLose: "整理陣容、累積羈絆，下一波會更好！",
      resultCopyDraw: "勢均力敵，準備好下一場精彩對決。",
      survivors: "存活棋子：{player} / {enemy}",
      resultDamage: "本回合生命變化：{damage}",
      resultContinue: "繼續下一回合",
      gameOverTitle: "冒險暫告一段落",
      gameOverCopy: "你守住了 {round} 個回合，星光會記得這次旅程。",
      backToMenu: "回到主畫面",
      tooLoud: "⚠️ 音量過大可能造成破音或不適，請留意音量",
      narrowHint: "請放大視窗或使用直向手機，仍可繼續遊玩。",
      tips: [
        "每 10 枚金幣會產生 1 枚利息，最多 5 枚。",
        "三隻相同棋子會自動合成，升星後能力大幅提升。",
        "羈絆數量會以棋盤上的棋子計算，先湊出 2 件套也很有幫助。",
        "商店鎖定後，進入下一回合也會保留目前的棋子。",
        "法師需要一點時間累積法力，但技能往往能扭轉戰局。"
      ]
    },
    races: {
      forest: "森林",
      flame: "火焰",
      tide: "潮汐",
      sky: "天空",
      crystal: "水晶"
    },
    classes: {
      guardian: "守護者",
      striker: "鬥士",
      mystic: "秘術師",
      ranger: "遊俠",
      mage: "魔法師"
    },
    units: {
      mossling: { name: "芽芽", ability: "苔蘚護盾" },
      emberfox: { name: "焰尾狐", ability: "小小爆炎" },
      tidepup: { name: "泡泡犬", ability: "潮汐療癒" },
      moonmoth: { name: "月光蛾", ability: "月影箭" },
      stoneback: { name: "石甲龜", ability: "大地屏障" },
      cloudmage: { name: "雲朵法師", ability: "雲端祝福" },
      thornknight: { name: "荊棘騎士", ability: "荊棘反擊" },
      starseer: { name: "星語者", ability: "流星雨" },
      sunlion: { name: "曦光獅", ability: "太陽咆哮" },
      crystaldragon: { name: "晶翼龍", ability: "彩晶爆發" }
    },
    synergies: {
      forest: { name: "森林之心", bonus: "全體防禦 +12%" },
      flame: { name: "熾熱火花", bonus: "全體攻擊 +15%" },
      tide: { name: "潮汐回響", bonus: "全體法力回復 +20%" },
      sky: { name: "輕盈羽翼", bonus: "全體攻速 +15%" },
      crystal: { name: "水晶共鳴", bonus: "全體生命 +18%" },
      guardian: { name: "堅定守線", bonus: "守護者受到傷害 -15%" },
      striker: { name: "勇往直前", bonus: "鬥士攻擊 +12%" },
      mystic: { name: "祕法流光", bonus: "技能傷害 +18%" },
      ranger: { name: "遠星瞄準", bonus: "遊俠攻速 +12%" },
      mage: { name: "魔力潮汐", bonus: "魔法師初始法力 +20" }
    },
    help: {
      eyebrow: "新手指南",
      title: "遊戲說明",
      startNow: "現在開始遊戲",
      chapters: {
        goal: "遊戲目標",
        economy: "金幣與經濟",
        shop: "商店與購買",
        board: "布陣操作",
        merge: "合成升星",
        synergy: "羈絆系統",
        battle: "戰鬥規則",
        result: "勝負結算",
        faq: "常見問題"
      },
      goal: {
        title: "守住星光，成為最後的隊伍！",
        intro: "每回合買下合適的夥伴、擺好位置，讓他們在自動戰鬥中為你爭取勝利。",
        steps: [
          { title: "觀察商店", text: "留意費用、種族與職業，找到能互相加成的組合。" },
          { title: "布置棋盤", text: "點擊備戰區棋子，再點擊棋盤格；前排承受火力，後排安心輸出。" },
          { title: "撐過波次", text: "每回合結算收入與生命，活得越久，評分越高。" }
        ],
        callout: "小提醒：沒有存檔也不用擔心，遊戲會在每回合結算後自動保存。"
      },
      economy: {
        title: "金幣會讓夢想長大",
        intro: "經濟節奏是自走棋的另一場戰鬥。保留一些金幣拿利息，也別忘了及時強化陣容。",
        steps: [
          { title: "基礎收入", text: "每回合固定獲得 5 金幣，勝利還會帶來連勝獎勵。" },
          { title: "利息", text: "每持有 10 金幣就多 1 金幣利息，最多 5 金幣。" },
          { title: "投資經驗", text: "花 4 金幣購買經驗，升級後可多放棋子，也更容易找到高費棋子。" }
        ],
        callout: "平衡小訣竅：準備刷新商店前，先看看自己是否能保留下一個利息門檻。"
      },
      shop: {
        title: "在商店挑選星光夥伴",
        intro: "商店每回合提供五位候選棋子。看中就買下，暫時不想變動就按鎖定。",
        steps: [
          { title: "購買棋子", text: "點擊卡片右側金幣按鈕，棋子會進入備戰區。" },
          { title: "刷新商店", text: "花費 2 金幣換一批選擇；鎖定中的商店不會在回合切換時刷新。" },
          { title: "比較費用", text: "高費棋子更稀有，但低費棋子更容易合成升星，沒有唯一答案。" }
        ],
        callout: "商店卡片上的種族與職業標籤，就是組成羈絆的線索。"
      },
      board: {
        title: "兩種操作，輕鬆完成布陣",
        intro: "桌機可以拖曳棋子，手機則建議使用點擊選取再點擊目標格，避免誤觸。",
        steps: [
          { title: "選取", text: "點擊備戰區的棋子，卡片亮起就代表已經選取。" },
          { title: "放置", text: "點擊空棋盤格，棋子就會站上場；棋盤容量由等級決定。" },
          { title: "調整", text: "點擊已上場棋子可以收回備戰區，再重新安排位置。" }
        ],
        callout: "每個可操作元件都保留舒適的觸控尺寸，手機橫向也能左右滑看商店。"
      },
      merge: {
        title: "三合一，星級閃耀升級",
        intro: "收集三隻同名、同星級棋子，系統會自動合成一隻更強的夥伴。",
        steps: [
          { title: "收集三隻", text: "棋子可以分散在棋盤與備戰區，系統會一起計算。" },
          { title: "自動合成", text: "合成不需額外費用，完成時會顯示升星提示與音效。" },
          { title: "突破極限", text: "一星、二星、三星的能力係數為 1.0、1.8、3.2。" }
        ],
        callout: "合成優先保留已經上場的棋子，讓你的陣線不會突然空掉。"
      },
      synergy: {
        title: "羈絆讓小隊彼此發光",
        intro: "同一種族或職業在棋盤上達到門檻，就會啟動全隊加成。",
        steps: [
          { title: "看標籤", text: "每張棋子卡都會顯示一個種族與一個職業。" },
          { title: "湊門檻", text: "左側羈絆面板會顯示目前數量與下一個啟動門檻。" },
          { title: "享受加成", text: "加成會在戰鬥開始前套用到所有符合條件的戰鬥單位。" }
        ],
        callout: "不一定要追求最多羈絆；集中強化一兩個核心羈絆通常更穩。"
      },
      battle: {
        title: "自動戰鬥，數值也有節奏",
        intro: "戰鬥開始後玩家不能操作，雙方會依攻速、目標策略、法力與技能自動決勝。",
        steps: [
          { title: "行動 tick", text: "每 0.1 秒檢查攻擊計時器，達到門檻的棋子就會出手。" },
          { title: "選擇目標", text: "預設攻擊最近的敵人，也可以在設定改成優先攻擊最低血量。" },
          { title: "技能爆發", text: "攻擊與受擊都會累積法力，滿法力就會自動施放技能。" }
        ],
        formula: "實際傷害 = max(1, 攻擊力 × (1 − 防禦力 ÷ (防禦力 + 100)))",
        callout: "棋盤上的特效只是戰鬥結果的可愛演出，真正的勝負已經由 tick 模擬完成。"
      },
      result: {
        title: "勝負會變成下一回合的力量",
        intro: "戰鬥結束後，系統會依勝負更新生命、金幣、連勝／連敗與存檔。",
        steps: [
          { title: "勝利", text: "保留生命，獲得收入與可能的連勝獎勵。" },
          { title: "惜敗", text: "依敵方存活棋子與星級受到傷害，仍會獲得基本收入。" },
          { title: "重新準備", text: "回合數增加、商店更新，整理陣容後再按開始戰鬥。" }
        ],
        callout: "生命歸零會結束冒險，但設定與最高回合不會被清除。"
      },
      faq: {
        title: "常見問題",
        intro: "把最常遇到的小疑問放在這裡，點擊問題即可展開答案。",
        items: [
          { q: "可以直接雙擊 index.html 嗎？", a: "可以。這是一個沒有 build、沒有 CDN 依賴的原生網頁遊戲，離線開啟也能遊玩。" },
          { q: "遊戲會自動保存嗎？", a: "會，每回合結算後會把遊戲狀態保存到瀏覽器 localStorage；設定則使用獨立的設定存檔。" },
          { q: "為什麼商店刷新不了？", a: "刷新一次需要 2 金幣；若金幣不足，先出售不存在於本版本的棋子是不需要的，保留經濟並等待收入即可。" },
          { q: "手機可以拖曳棋子嗎？", a: "可以，但手機預設推薦點擊選取再點擊棋盤格，操作更穩定；桌機則支援拖曳。" },
          { q: "音量為什麼可以超過 100%？", a: "規格允許 BGM 最高 1000%，系統會用 DynamicsCompressorNode 抑制削波；超過 300% 仍建議小心聆聽。" }
        ]
      }
    },
    settings: {
      eyebrow: "個人化體驗",
      autoSave: "自動儲存",
      reset: "恢復預設值",
      appearance: "外觀主題",
      language: "語言",
      audio: "音效設定",
      gameplay: "遊戲設定",
      data: "資料管理",
      themeLabel: "選擇一個喜歡的色彩世界",
      languageLabel: "切換後會立即重新渲染所有頁面",
      bgm: "BGM 音量",
      sfx: "音效音量",
      mute: "靜音開關",
      muted: "目前靜音中",
      soundOn: "聲音開啟",
      battleSpeed: "戰鬥動畫速度",
      targetStrategy: "攻擊目標策略",
      nearest: "最近優先",
      lowest: "最低血量優先",
      deleteTitle: "要清除遊戲存檔嗎？",
      deleteCopy: "這只會刪除遊戲進度，不會影響語言、主題與音量設定。",
      deleteSave: "清除存檔",
      resetTitle: "恢復所有設定？",
      resetCopy: "主題、語言、音量與戰鬥偏好都會回到預設值。",
      resetDone: "設定已恢復預設值",
      saved: "設定已自動保存",
      themes: { cute: "可愛粉萌", ocean: "海洋清新", sunset: "夕陽暖橘", forest: "森林綠意", galaxy: "星空夢幻", dark: "護眼深色" },
      languages: { "zh-TW": "繁體中文", en: "English", ja: "日本語" }
    },
    audio: { click: "按鈕點擊", buy: "購買棋子", place: "棋子放置", merge: "合成升星", victory: "勝利", defeat: "失敗" },
    toast: { saved: "進度已保存", cleared: "遊戲存檔已清除", audioReady: "音效已啟用" },
    errors: { generic: "發生了一點小問題，請再試一次。" }
  };
}(window));
