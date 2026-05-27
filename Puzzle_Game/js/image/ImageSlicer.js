export function slice(source, cols) {
  const pieces = [];
  const sourceSize = source.width;
  const tileSize = sourceSize / cols;

  for (let row = 0; row < cols; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = tileSize;
      canvas.height = tileSize;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(source, col * tileSize, row * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize);
      pieces.push({ id: row * cols + col, row, col, canvas });
    }
  }

  return pieces;
}
