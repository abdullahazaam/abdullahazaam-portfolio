const sharp = require('sharp');

async function perfectFit() {
  const headW = 540;
  const headH = 680;

  // 1. Abdullah head crop with warm studio grading
  const cropped = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: headW, height: headH })
    .modulate({
      brightness: 0.95,
      saturation: 1.18
    })
    .toBuffer();

  // 2. Head contour mask with organic feathered edges
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
        M 270 80
        C 335 70, 395 110, 410 170
        C 425 220, 415 290, 405 340
        C 395 390, 375 450, 345 490
        C 315 540, 295 580, 270 585
        C 245 580, 225 540, 195 490
        C 165 450, 145 390, 135 340
        C 125 290, 115 220, 130 170
        C 145 110, 205 70, 270 80
        Z
      " fill="url(#bottomFade)" filter="url(#feather)"/>
    </svg>
  `);

  // 3. Smooth red rim light that clips to the head mask!
  const svgRim = Buffer.from(`
    <svg width="${headW}" height="${headH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="70%" stop-color="transparent"/>
          <stop offset="85%" stop-color="#E50914" stop-opacity="0.45"/>
          <stop offset="95%" stop-color="#FF3333" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
      </defs>
      <rect width="${headW}" height="${headH}" fill="url(#rimGrad)"/>
    </svg>
  `);

  const maskedHead = await sharp(cropped)
    .composite([
      { input: svgMask, blend: 'dest-in' },
      { input: svgRim, blend: 'over' }
    ])
    .png()
    .toBuffer();

  // Target size to match the AI body:
  const targetW = 180;
  const targetH = 228;

  const resizedHead = await sharp(maskedHead)
    .resize(targetW, targetH, { fit: 'fill' })
    .toBuffer();

  // Workstation crop
  const workstation = await sharp('public/seq-bot.png')
    .extract({ left: 360, top: 0, width: 852, height: 468 })
    .toBuffer();

  // Position:
  // Center is at x = 398, y = 118
  // posX = 398 - (targetW / 2) = 398 - 90 = 308
  // posY = 118 - (targetH / 2) = 118 - 114 = 4
  const posX = 308;
  const posY = 4;

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

  console.log("Updated hero-front-composite.png!");
}

perfectFit().catch(console.error);
