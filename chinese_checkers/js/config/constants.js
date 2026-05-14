const HEX_DIRECTIONS = [[1,0],[-1,0],[0,1],[0,-1],[1,-1],[-1,1]];
const PLAYER_ORDER = ["red", "blue", "green", "yellow"];
const PLAYER_META = {
  red: { label: "玩家", short: "紅", color: "#d9573b", zone: "top" },
  blue: { label: "AI 藍", short: "藍", color: "#2d82d8", zone: "bottom" },
  green: { label: "AI 綠", short: "綠", color: "#31995b", zone: "left" },
  yellow: { label: "AI 黃", short: "黃", color: "#d1a018", zone: "right" }
};
const ZONE_LABELS = {
  top: "上方",
  bottom: "下方",
  left: "左方",
  right: "右方",
  upperLeft: "左上",
  lowerRight: "右下"
};
const ZONE_OPPOSITE = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
  upperLeft: "lowerRight",
  lowerRight: "upperLeft"
};
const HOME_TRIADS = [
  ["top", "left", "lowerRight"],
  ["bottom", "right", "upperLeft"]
];
const ALL_ZONES = ["top", "bottom", "left", "right", "upperLeft", "lowerRight"];
const FONT_SCALES = { S: "15px", M: "17px", L: "19px", XL: "22px" };
const DIFFICULTY = {
  easy: { delay: 800, depth: 1, beam: 6, random: .38 },
  normal: { delay: 600, depth: 1, beam: 8, random: .14 },
  hard: { delay: 400, depth: 2, beam: 8, random: .04 }
};
