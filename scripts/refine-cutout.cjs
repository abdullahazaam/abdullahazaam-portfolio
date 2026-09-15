const sharp = require('sharp');

async function refineCutout() {
  const { data, info } = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: 540, height: 680 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width; // 540
  const H = info.height; // 680
  const rgba = Buffer.alloc(W * H * 4);

  // Face center is around x=265, y=360
  // Hair top is around y=50 to y=200
  // Chin is around y=580
  // Left ear: x=140, Right ear: x=395

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * info.channels;
      const outIdx = (y * W + x) * 4;
      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];

      // Distance from vertical center line (x=265)
      const cx = 265;
      const dx = Math.abs(x - cx);

      // Max allowable width from center depends on y:
      // Top of hair (y < 120): width up to 130
      // Mid hair (120 <= y < 240): width up to 155
      // Forehead / eyes (240 <= y < 380): width up to 145 (inside ears)
      // Cheeks (380 <= y < 480): width tapers from 135 down to 110
      // Jaw/chin (480 <= y < 590): width tapers from 110 down to 60
      // Below chin (y >= 590): 0
      let maxDx = 0;
      if (y >= 40 && y < 120) {
        maxDx = 70 + (y - 40) * 0.75;
      } else if (y >= 120 && y < 240) {
        maxDx = 130 + (y - 120) * 0.15;
      } else if (y >= 240 && y < 360) {
        maxDx = 145 - (y - 240) * 0.1;
      } else if (y >= 360 && y < 480) {
        maxDx = 133 - (y - 360) * 0.22;
      } else if (y >= 480 && y < 580) {
        maxDx = 107 - (y - 480) * 0.45;
      } else if (y >= 580 && y < 610) {
        maxDx = 62 - (y - 580) * 1.8;
      }

      // Check blue sky:
      const isSky = b > 125 && (b - r) > 20;

      let alpha = 0;
      if (!isSky && maxDx > 0 && dx <= maxDx) {
        // Feather near maxDx
        const edgeDist = maxDx - dx;
        if (edgeDist < 8) {
          alpha = Math.round((edgeDist / 8) * 255);
        } else {
          alpha = 255;
        }
      }

      // Apply studio color grading to the face pixels:
      // 1. Overall dark cinematic studio grading (slightly more contrast, dark shadows)
      // 2. Right rim light: if x > 280, add red light
      if (alpha > 0) {
        // Contrast / gamma
        let cr = Math.pow(r / 255, 1.1) * 255;
        let cg = Math.pow(g / 255, 1.15) * 255;
        let cb = Math.pow(b / 255, 1.25) * 255;

        // Red rim light on right edge
        if (x > 260) {
          const rimStrength = Math.min(1, Math.max(0, (x - 260) / 120));
          cr = Math.min(255, cr + rimStrength * 70);
          cg = Math.max(0, cg - rimStrength * 15);
          cb = Math.max(0, cb - rimStrength * 25);
        }

        // Red bounce from laptop screen onto chin (y > 480)
        if (y > 480) {
          const bounce = Math.min(1, (y - 480) / 100);
          cr = Math.min(255, cr + bounce * 40);
          cg = Math.max(0, cg - bounce * 10);
        }

        rgba[outIdx] = Math.round(cr);
        rgba[outIdx + 1] = Math.round(cg);
        rgba[outIdx + 2] = Math.round(cb);
      } else {
        rgba[outIdx] = r;
        rgba[outIdx + 1] = g;
        rgba[outIdx + 2] = b;
      }
      rgba[outIdx + 3] = alpha;
    }
  }

  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile('public/abdullah-head-graded.png');

  console.log("Refined graded head created!");
}

refineCutout().catch(console.error);
