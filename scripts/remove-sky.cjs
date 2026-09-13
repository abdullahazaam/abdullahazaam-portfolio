const sharp = require('sharp');

async function removeSky() {
  const headW = 540;
  const headH = 680;

  // Let's load abdullah-profile.jpg head crop
  const { data, info } = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: headW, height: headH })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Create an alpha mask buffer (1 channel, 8-bit)
  const alphaBuf = Buffer.alloc(headW * headH);

  for (let y = 0; y < headH; y++) {
    for (let x = 0; x < headW; x++) {
      const idx = y * headW + x;
      const pix = idx * info.channels;
      const r = data[pix];
      const g = data[pix + 1];
      const b = data[pix + 2];

      const dx = (x - 270);
      const dy = (y - 340);

      // Distance from face center
      // Top hair rx ~ 140, ry ~ 230
      // Jaw rx ~ 115, ry ~ 240
      const rx = y < 220 ? 140 : (y > 450 ? 105 : 125);
      const ry = dy < 0 ? 240 : 250;
      const dist = Math.sqrt((dx / rx) * (dx / rx) + (dy / ry) * (dy / ry));

      // Sky detection: blue dominant or very bright sky
      const isSky = (b > 120 && b > r + 20) || (b > 160 && g > 140 && r < 140);
      // Tan building background: dist > 0.85 and not dark hair
      const isTanBG = dist > 0.82 && (g > 100 && r > 120 && r > b + 15 && y < 450 && y > 220);

      if (dist > 1.0 || isSky || isTanBG || y > 580) {
        alphaBuf[idx] = 0;
      } else if (dist > 0.78) {
        const f = (1.0 - dist) / 0.22;
        alphaBuf[idx] = Math.max(0, Math.min(255, Math.round(f * 255)));
      } else {
        alphaBuf[idx] = 255;
      }
    }
  }

  // Smooth the alpha mask with slight blur to remove hard steps
  const blurredAlpha = await sharp(alphaBuf, { raw: { width: headW, height: headH, channels: 1 } })
    .blur(3)
    .toBuffer();

  // Combine with RGB image
  const outRgba = Buffer.alloc(headW * headH * 4);
  for (let i = 0; i < headW * headH; i++) {
    const pix = i * info.channels;
    const outPix = i * 4;
    const r = data[pix];
    const g = data[pix + 1];
    const b = data[pix + 2];
    const a = blurredAlpha[i];

    const x = i % headW;
    const y = Math.floor(i / headW);

    // Studio color grading:
    // Slightly deepen shadows
    let cr = Math.pow(r / 255, 1.05) * 255;
    let cg = Math.pow(g / 255, 1.1) * 255;
    let cb = Math.pow(b / 255, 1.18) * 255;

    // Right rim light (red glow from right neon/studio lights)
    if (x > 260) {
      const rim = Math.min(1, (x - 260) / 120);
      cr = Math.min(255, cr + rim * 70);
      cg = Math.max(0, cg - rim * 12);
      cb = Math.max(0, cb - rim * 20);
    }

    outRgba[outPix] = Math.round(cr);
    outRgba[outPix + 1] = Math.round(cg);
    outRgba[outPix + 2] = Math.round(cb);
    outRgba[outPix + 3] = a;
  }

  await sharp(outRgba, { raw: { width: headW, height: headH, channels: 4 } })
    .png()
    .toFile('public/abdullah-head-isolated.png');

  console.log("Isolated head created!");
}

removeSky().catch(console.error);
