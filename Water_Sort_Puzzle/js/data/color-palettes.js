export const COLOR_IDS = [
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'cyan',
  'blue',
  'purple',
  'pink',
  'brown',
  'gray',
  'navy',
];

export const COLOR_META = {
  red: { name: '紅色' },
  orange: { name: '橘色' },
  yellow: { name: '黃色' },
  lime: { name: '萊姆綠' },
  green: { name: '綠色' },
  cyan: { name: '青色' },
  blue: { name: '藍色' },
  purple: { name: '紫色' },
  pink: { name: '粉紅色' },
  brown: { name: '莓紫色' },
  gray: { name: '灰色' },
  navy: { name: '深藍色' },
};

export function colorName(colorId) {
  return COLOR_META[colorId]?.name ?? '空白';
}
