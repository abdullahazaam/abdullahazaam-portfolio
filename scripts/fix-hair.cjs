const sharp = require('sharp');

async function fixHairSky() {
  const headW = 540;
  const headH = 680;

  // 1. Abdullah head crop with warm studio grading
  const { data, info } = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: headW, height: headH })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rawBuf = Buffer.from(data);
  // Kill sky pixels: wherever b > 115 and (b - r) > 10, darken heavily to match dark hair
  for (let y = 0; y < 220; y++) {
    for (let x = 0; x < headW; x++) {
      const idx = (y * headW + x) * info.channels;
      const r = rawBuf[idx];
      const g = rawBuf[idx + 1];
      const b = rawBuf[idx + 2];

      // Blue sky
      if (b > 110 && b > r + 15) {
        rawBuf[idx] = 12;
        rawBuf[idx + 1] = 10;
        rawBuf[idx + 2] = 15;
      } else if (b > 90 && b > r + 5 && y < 140) {
        rawBuf[idx] = Math.round(r * 0.2);
        rawBuf[idx + 1] = Math.round(g * 0.2);
        rawBuf[idx + 2] = Math.round(b * 0.2);
      }
    }
  }

  const cropped = await sharp(rawBuf, { raw: { width: headW, height: headH, channels: info.channels } })
    .modulate({
      brightness: 0.94,
      saturation: 1.15
    })
    .toBuffer();

  // 2. Head contour mask with feathered edges
  const svgMask = Buffer.from(`
    <svg width="${headW}" height="${headH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="feather" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8"/>
        </filter>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="68%" stop-color="white" stop-opacity="1"/>
          <stop offset="85%" stop-color="white" stop-opacity="0.8"/>
          <stop offset="95%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="
        M 270 82
        C 335 72, 395 105, 410 165
        C 425 215, 415 285, 405 335
        C 395 385, 375 445, 345 485
        C 315 535, 295 575, 270 580
        C 245 575, 225 535, 195 485
        C 165 445, 145 385, 135 335
        C 125 285, 115 215, 130 165
        C 145 105, 205 72, 270 82
        Z
      " fill="url(#bottomFade)" filter="url(#feather)"/>
    </svg>
  `);

  // 3. Smooth red rim light INSIDE the head contour
  const svgRim = Buffer.from(`
    <svg width="${headW}" height="${headH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="72%" stop-color="transparent"/>
          <stop offset="88%" stop-color="#E50914" stop-opacity="0.4"/>
          <stop offset="96%" stop-color="#FF3333" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
      </defs>
      <rect width="${headW}" height="${headH}" fill="url(#rimGrad)"/>
    </svg>
  `);

  const rimmed = await sharp(cropped)
    .composite([
      { input: svgRim, blend: 'over' }
    ])
    .toBuffer();

  const maskedHead = await sharp(rimmed)
    .composite([
      { input: svgMask, blend: 'dest-in' }
    ])
    .png()
    .toBuffer();

  const targetW = 186;
  const targetH = 234;

  const resizedHead = await sharp(maskedHead)
    .resize(targetW, targetH, { fit: 'fill' })
    .toBuffer();

  // Workstation crop from seq-bot
  const workstation = await sharp('public/seq-bot.png')
    .extract({ left: 360, top: 0, width: 852, height: 468 })
    .toBuffer();

  const posX = 305;
  const posY = -5;

  const fadeLeftSvg = Buffer.from(`
    <svg width="852" height="468" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lf" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stop-color="#050505" stop-opacity="1"/>
          <stop offset="14%" stop-color="#050505" stop-opacity="0.95"/>
          <stop offset="28%" stop-color="#050505" stop-opacity="0.5"/>
          <stop offset="40%" stop-color="#050505" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="852" height="468" fill="url(#lf)"/>
    </svg>
  `);

  await sharp(workstation)
    .composite([
      { input: resizedHead, left: posX, top: posY, blend: 'over' },
      { input: fadeLeftSvg, blend: 'over' }
    ])
    .png()
    .toFile('public/hero-front-composite.png');

  console.log("Hair sky fixed and hero-front-composite.png updated!");
}

fixHairSky().catch(console.error);
