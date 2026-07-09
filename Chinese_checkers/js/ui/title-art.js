function drawTitleArt() {
  const c = titleCanvas, t = titleCtx;
  const size = c.width;
  t.clearRect(0, 0, size, size);
  const center = size / 2;
  t.save();
  t.translate(center, center);
  t.fillStyle = getComputedStyle(document.body).getPropertyValue("--surface");
  t.beginPath();
  t.arc(0, 0, 190, 0, Math.PI * 2);
  t.fill();
  t.strokeStyle = getComputedStyle(document.body).getPropertyValue("--border");
  t.lineWidth = 3;
  t.stroke();
  const colors = ["#d9573b", "#2d82d8", "#31995b", "#d1a018"];
  for (let ring = 0; ring < 5; ring++) {
    for (let i = 0; i < 6 + ring * 6; i++) {
      const a = i / (6 + ring * 6) * Math.PI * 2 + ring * .18;
      const r = 18 + ring * 31;
      t.beginPath();
      t.arc(Math.cos(a) * r, Math.sin(a) * r, 8 + ring * .4, 0, Math.PI * 2);
      t.fillStyle = colors[(i + ring) % colors.length];
      t.globalAlpha = .88;
      t.fill();
    }
  }
  t.globalAlpha = 1;
  t.restore();
}
