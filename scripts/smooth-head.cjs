const sharp = require('sharp');

async function smoothHead() {
  // Let's take abdullah-profile.jpg head crop
  const { data, info } = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: 540, height: 680 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;
  const alphaMask = Buffer.alloc(W * H);

  // We want a smooth organic head contour
  // Center of face: cx = 270, cy = 350
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      const pixIdx = idx * info.channels;
      const r = data[pixIdx];
      const g = data[pixIdx + 1];
      const b = data[pixIdx + 2];

      const dx = (x - 270);
      const dy = (y - 340);

      // Normalized coordinates
      // Hair top (y < 220): oval with radius rx=145, ry=250
      // Cheeks/jaw (y >= 220): oval with rx=125, ry=250
      let rx = 135;
      if (y < 200) {
        rx = 145; // top of hair
      } else if (y >= 200 && y < 360) {
        rx = 135; // eyes/temple
      } else if (y >= 360 && y < 480) {
        rx = 120; // cheek
      } else if (y >= 480) {
        rx = 90 - (y - 480) * 0.35; // chin taper
      }

      const ndx = Math.abs(dx) / rx;
      const ndy = Math.abs(dy) / (dy < 0 ? 270 : 250);
      const dist = Math.sqrt(ndx * ndx + ndy * ndy);

      // Sky check
      const isSky = b > 125 && (b - r) > 20 && y < 300;

      if (isSky || dist > 1.05 || y > 590) {
        alphaMask[idx] = 0;
      } else if (dist > 0.88) {
        const factor = (1.05 - dist) / (1.05 - 0.88);
        alphaMask[idx] = Math.max(0, Math.min(255, Math.round(factor * 255)));
      } else {
        alphaMask[idx] = 255;
      }
    }
  }

  // Smooth the alpha mask with Gaussian blur
  const blurredMask = await sharp(alphaMask, { raw: { width: W, height: H, channels: 1 } })
    .blur(4)
    .toBuffer();

  // Create final RGBA with studio color grading
  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const pixIdx = i * info.channels;
    const outIdx = i * 4;
    const r = data[pixIdx];
    const g = data[pixIdx + 1];
    const b = data[pixIdx + 2];
    const a = blurredMask[i];

    const x = i % W;
    const y = Math.floor(i / W);

    let cr = Math.pow(r / 255, 1.08) * 255;
    let cg = Math.pow(g / 255, 1.12) * 255;
    let cb = Math.pow(b / 255, 1.2) * 255;

    // Right rim light
    if (x > 260) {
      const rim = Math.min(1, (x - 260) / 130);
      cr = Math.min(255, cr + rim * 65);
      cg = Math.max(0, cg - rim * 10);
      cb = Math.max(0, cb - rim * 20);
    }

    rgba[outIdx] = Math.round(cr);
    rgba[outIdx + 1] = Math.round(cg);
    rgba[outIdx + 2] = Math.round(cb);
    rgba[outIdx + 3] = a;
  }

  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile('public/abdullah-head-final.png');

  console.log("Smooth head created!");
}

smoothHead().catch(console.error);
