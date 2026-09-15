const sharp = require('sharp');

async function testCutout() {
  const { data, info } = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: 540, height: 680 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;
  // Let's create an alpha channel (RGBA)
  const rgba = Buffer.alloc(W * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * info.channels;
      const outIdx = (y * W + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      rgba[outIdx] = r;
      rgba[outIdx + 1] = g;
      rgba[outIdx + 2] = b;

      // Distance from center of face (around x=270, y=340)
      const dx = (x - 270) / 220;
      const dy = (y - 330) / 290;
      const dist = dx * dx + dy * dy;

      // Blue sky condition: b > 140, b > r + 30
      const isSky = b > 130 && (b - r) > 25;
      // Building background condition (outside face boundary): dist > 0.9 and yellowish/tan
      const isBuilding = dist > 0.85 && g > r * 0.7 && b > r * 0.5 && r > 100;

      if (isSky || (dist > 0.95) || isBuilding) {
        rgba[outIdx + 3] = 0; // transparent
      } else if (dist > 0.75) {
        // Feather edge
        const alpha = Math.max(0, Math.min(255, Math.round((1 - (dist - 0.75) / 0.2) * 255)));
        rgba[outIdx + 3] = alpha;
      } else {
        rgba[outIdx + 3] = 255;
      }
    }
  }

  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile('public/test-cutout.png');

  console.log("Cutout test created!");
}

testCutout().catch(console.error);
